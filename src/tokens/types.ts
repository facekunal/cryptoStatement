// separate interfaces for different token standards

export interface ERC20Token {
    address: string;
    name: string;
    symbol: string;
    decimals: number;
}

export interface ERC721Token {
    address: string;
    name: string;
    symbol: string;
    tokenId: string;
}

export interface ERC1155Token {
    address: string;
    name: string;
    symbol: string;
    tokenId: string;
}

// enum for transfer types - ETH, ERC20, ERC721, ERC1155
export enum TokenType {
    ETH = "ETH",
    ERC20 = "ERC20",
    ERC721 = "ERC721",
    ERC1155 = "ERC1155"
}