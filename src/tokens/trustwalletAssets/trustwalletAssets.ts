/**
 * trustWalletAssetsMap provides a mapping from token address to token information.
 *
 * The data is sourced from `src/tokens/trustwalletAssets/assets.json`, which contains
 * an array of token objects with the following structure:
 *
 * {
 *   "address": "0x0000000000085d4780B73119b644AE5ecd22b376",
 *   "name": "TrueUSD",
 *   "symbol": "TUSD",
 *   "decimals": 18,
 *   "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/undefined/logo.png"
 * }
 *
 * This module converts the array into a map for efficient lookup by address.
 */
import { ERC20Token } from '../types';
import assets from './assets.json';

export type TrustWalletAssetsMap = Record<string, ERC20Token>;

// Convert the array of tokens to a map: address (lowercase) => token info
const trustWalletAssetsMap: TrustWalletAssetsMap = {};

if (Array.isArray(assets)) {
  for (const token of assets) {
    if (token.address) {
      trustWalletAssetsMap[token.address.toLowerCase()] = {
        name: token.name,
        symbol: token.symbol,
        decimals: token.decimals,
      };
    }
  }
}

export default trustWalletAssetsMap;