/**
 * This module will provide functionality for fetching token information.
 */

import trustWalletAssetsMap from './trustwalletAssets/trustwalletAssets';
import { TokenType, ERC20Token } from './types';
import { Network } from '../networks';

import { createPublicClient, http, getContract } from "viem";
import { CLIENTS } from '../commons/config';

const ERC721_INTERFACE_ID = '0x80ac58cd';
const ERC1155_INTERFACE_ID = '0xd9b67a26';

// Create a simple in-memory cache
const contractStandardCache = new Map();

/**
 * Verifies if a contract is ERC721 or ERC1155, with in-memory caching
 * @param {string} contractAddress - The address of the contract
 * @returns {'ERC721' | 'ERC1155' | 'Unknown'} - Detected token standard
 */
export async function detectNFTStandard(contractAddress: `0x${string}`): Promise<TokenType> {
  // Check if result already cached
  if (contractStandardCache.has(contractAddress.toLowerCase())) {
    return contractStandardCache.get(contractAddress.toLowerCase());
  }

  let detected = TokenType.UNRESOLVED_NFT;

  for (const client of CLIENTS) {
    try {
      const contract = getContract({
        address: contractAddress,
        abi: [
          {
            type: "function",
            name: "supportsInterface",
            stateMutability: "view",
            inputs: [{ name: "interfaceId", type: "bytes4" }],
            outputs: [{ name: "", type: "bool" }]
          }
        ],
        client
      });

      const isERC721 = await contract.read.supportsInterface([ERC721_INTERFACE_ID]);
      const isERC1155 = await contract.read.supportsInterface([ERC1155_INTERFACE_ID]);

      if (isERC1155) {
        detected = TokenType.ERC1155;
      } else if (isERC721) {
        detected = TokenType.ERC721;
      }
      // Save to cache
      contractStandardCache.set(contractAddress.toLowerCase(), detected);

      return detected;
    } catch (error) {
      console.warn(`Contract ${contractAddress} supportsInterface() call failed:`, error);
    }
  }

  // Save to cache (save undetected to prioritize performance)
  contractStandardCache.set(contractAddress.toLowerCase(), detected);
  return detected;
}

// Note: Only to be used if transaction fetched data doesn't include token information.
// Currently not used in this project.
/**
 * Fetch token metadata (name, symbol, decimals, etc.) for a given contract address and token type.
 * 
 * Looks up static TrustWallet assets for ERC20 tokens first, then falls back to on-chain lookup.
 * 
 * @param address - The token contract address.
 * @param tokenType - The type of token (ERC20, ERC721, ERC1155).
 * @returns Token info object or null if not found.
 */
export async function getTokenInfo(address: string, tokenType: TokenType) {
  const lowerAddress = address.toLowerCase();

  // For ERC20 token
  // TrustWallet static assets lookup
  if (tokenType === TokenType.ERC20 && trustWalletAssetsMap[lowerAddress]) {
    return trustWalletAssetsMap[lowerAddress];
  }

  // On-chain lookup
  if (tokenType === TokenType.ERC20) {
    try {
      const info = await Network.fetchERC20TokenInfo(address as `0x${string}`);
      const token: ERC20Token = {
        name: info.name,
        symbol: info.symbol,
        decimals: info.decimals,
      };
      return token;
    } catch (e) {
        console.error(`Error fetching token info for ${address}:`, e);
    }
  }

  return null; // Not found in static assets or on-chain
}