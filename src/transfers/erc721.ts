import { TransactionFetcher } from ".";
import { Transaction } from "../commons/types";

export async function fetchTransactions(walletAddress: `0x${string}`): Promise<Transaction[]> {
    return [];
}
  
export class Erc721Fetcher implements TransactionFetcher {
    async fetchTransactions(walletAddress: `0x${string}`): Promise<Transaction[]> {
        return [];
        // Logic for ERC721 transfer events
    }
}