import * as readline from "readline";
import { fetchTransactions } from "./transfers";
import { exportToCSV } from "./repository";
import path from "path";
import { TransferType } from "./commons/types";

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question("Enter Ethereum wallet address: ", async (walletAddress: string) => {
    if (!walletAddress) {
      console.error("Error: Wallet address cannot be empty.");
      rl.close();
      return;
    }

    try {
      console.log("Fetching transactions...");
      // @ts-ignore
      const transactions = await fetchTransactions(TransferType.ERC20, walletAddress);

      console.log("Transactions fetched successfully:", transactions);

      const outputFile = path.resolve(__dirname, `../outputs/${walletAddress}_transaction_history.csv`);
      console.log(`Exporting transactions to ${outputFile}...`);

      if (transactions.length > 0) {
        await exportToCSV(transactions, outputFile);
      }
    } catch (error) {
      console.error("Failed to process transactions:", error);
    } finally {
      rl.close();
    }
  });
}

main();