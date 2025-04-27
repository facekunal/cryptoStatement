/**
 * This module will provide functionality for fetching token information.
 * 
 * Token data can be retrieved either directly from the blockchain using the Network class,
 * or from external repositories such as TrustWallet's assets repository.
 * 
 * Responsibilities:
 * - Fetch token metadata (name, symbol, decimals, etc.) for a given contract address.
 * - Support multiple sources: on-chain lookups and off-chain repositories.
 * - Provide a unified interface for token information retrieval.
 * 
 * Different Token Standards:
 * - ERC-20:
 *   - Has `name()`, `symbol()`, and optional `decimals()`.
 *   - Used for fungible tokens (all tokens are identical).
 *
 * - ERC-721:
 *   - Has `name()`, `symbol()`.
 *   - Each token ID is unique with metadata (via URI).
 *
 * - ERC-1155:
 *   - No global `name()` or `symbol()`.
 *   - Each token ID can have its own metadata via `uri(tokenId)`.
 *   - Supports both fungible and non-fungible tokens.
 * 
 * Example sources:
 * - Blockchain (via Network class)
 * - Static repos - https://github.com/trustwallet/assets
 */

import trustWalletAssetsMap from './trustwalletAssets/trustwalletAssets';
import { TokenType, ERC20Token } from './types';
import { Network } from '../networks';

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
        address,
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


