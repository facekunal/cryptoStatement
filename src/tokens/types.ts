/** 
 * Separate interfaces for different token standards
 * 
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
 **/


export interface ERC20Token {
    name: string;
    symbol: string;
    decimals: number;
}

export interface ERC721Token {
    name: string;
    symbol: string;
    tokenId: string;
}

export interface ERC1155Token {
    name: string;
    symbol: string;
    tokenId: string;
}

// enum for transfer types - ETH, ERC20, ERC721, ERC1155
export enum TokenType {
    ETH = "ETH",
    ERC20 = "ERC20",
    ERC721 = "ERC721",
    ERC1155 = "ERC1155",
    UNRESOLVED_NFT = "ERC721/ERC1155", // Used when we can't determine if it's ERC721 or ERC1155
}