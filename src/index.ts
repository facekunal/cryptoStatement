import * as readline from "readline";
import { fetchTransactions, TransferType } from "./transfers";

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

      // const outputFile = path.resolve(__dirname, "transaction_history.csv");
      // console.log(`Exporting transactions to ${outputFile}...`);
      //exportToCSV(transactions, outputFile);
    } catch (error) {
      console.error("Failed to process transactions:");
    } finally {
      rl.close();
    }
  });
}

main();