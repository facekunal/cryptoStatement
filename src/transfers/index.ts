import { Transaction, TransferType } from "../commons/types";
import { fetchTransactions as fetchErc20Transactions } from "./erc20";

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
