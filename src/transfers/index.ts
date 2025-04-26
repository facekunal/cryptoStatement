import { fetchTransactions as fetchErc20Transactions } from "./erc20";

// create an enum for transfer types - ETH, ERC20, ERC721, ERC1155
export enum TransferType {
    ETH = "ETH",
    ERC20 = "ERC20",
    ERC721 = "ERC721",
    ERC1155 = "ERC1155"
}

// Define the type for the transaction statement
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

export async function fetchTransactions(transferType: TransferType, walletAddress: `0x${string}`): Promise<Transaction[]> {
    switch (transferType) {
        case TransferType.ERC20:
            // Call the function to fetch ERC20 transactions
            return await fetchErc20Transactions(walletAddress);
        // TODO: Implement other transfer types
        default:
            console.error("Unsupported transfer type");
            throw new Error("Unsupported transfer type");
    }    
}
