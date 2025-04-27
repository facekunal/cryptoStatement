import { TransactionFetcher } from ".";
import { Transaction } from "../commons/types";

export async function fetchTransactions(walletAddress: `0x${string}`): Promise<Transaction[]> {
    return [];
}
  
export class Erc1155Fetcher implements TransactionFetcher {
    async fetchTransactions(walletAddress: `0x${string}`): Promise<Transaction[]> {
        return [];
        // Logic for ERC1155 TransferSingle/TransferBatch
    }
}
