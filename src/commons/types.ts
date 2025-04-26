// enum for transfer types - ETH, ERC20, ERC721, ERC1155
export enum TransferType {
    ETH = "ETH",
    ERC20 = "ERC20",
    ERC721 = "ERC721",
    ERC1155 = "ERC1155"
}

// type for the transaction statement
export interface Transaction {
    transactionHash: string;
    blockHash: string;
    blockNumber: bigint;
    from: string | undefined;
    to: string | undefined;
    amount: bigint | undefined;
    transactionType: TransferType;
    // isContractInteraction: boolean; can be a separate field to differentiate contract/EOA interactions
    assetContractAddress: string;
    metadata?: object // tokenID for nft, etc.
}