/**
 * Entry point for the cryptoStatement script.
 * 
 * This script prompts the user for an Ethereum wallet address, fetches the transaction
 * history for that address, and exports the results to a CSV file in the outputs directory.
 */

import * as readline from "readline";
import { fetchTransactions } from "./transfers";
import { CSVExporter } from "./repository";
import path from "path";

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

      // set the output file path
      const outputFile = path.resolve(__dirname, `../outputs/${walletAddress}_transaction_history.csv`);
      CSVExporter.setOutputFile(outputFile);

      // @ts-ignore
      const transactions = await fetchTransactions(walletAddress);
      console.log(`Transactions fetched successfully: ${transactions?.length}`);

      // save to csv
      if (transactions.length > 0) {
        await CSVExporter.export(transactions);
      } else {
        console.log("No transactions found for the given wallet address. Try increasing the block range.");
      }
    } catch (error) {
      console.error("Failed to process transactions:", error);
    } finally {
      rl.close();
    }
  });
}

main();