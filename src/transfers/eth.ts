import { PublicClient } from "viem";
import { TransactionFetcher } from ".";
import { Transaction } from "../commons/types";

export async function fetchTransactions(walletAddress: `0x${string}`): Promise<Transaction[]> {
    return [];
}

export class EthFetcher implements TransactionFetcher {
    //constructor(private readonly client: PublicClient) {}

    async fetchTransactions(walletAddress: `0x${string}`): Promise<Transaction[]> {
        return [];
        // Logic for ETH native txns
    }
}
