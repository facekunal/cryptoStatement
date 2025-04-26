import axios from "axios";
import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";
import { checksumAddress, createPublicClient, http, parseAbi, parseEther } from "viem";
import { mainnet } from "viem/chains";

// Replace with your Etherscan API key
const ETHERSCAN_API_KEY = "your_etherscan_api_key";

const RPCS = [
  "https://1rpc.io/eth",
  "https://eth.llamarpc.com",
  "https://eth.drpc.org",
];

interface Transaction {
  blockNumber: string;
  timeStamp: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  hash: string;
}

const ERC20_TRANSFER_EVENT_SIGNATURE = "Transfer(address,address,uint256)";

async function fetchERC20Transactions(walletAddress: `0x${string}`): Promise<void> {
  const client = createPublicClient({
    chain: mainnet,
    transport: http(RPCS[0]), // Use the first RPC endpoint from the list
  });

  try {
    // Define the ERC-20 Transfer event signature
    const transferEventAbi = parseAbi([
      "event Transfer(address indexed from, address indexed to, uint256 value)"
    ]);

    // OUT
    const outLogs = await client.getLogs({
      event: transferEventAbi[0],
      fromBlock: BigInt(22335483), // or a specific block if you want 
      toBlock: BigInt(22336483),
      // This filters logs where 'from' is your address
      args: {
        from: walletAddress,
      },
    });

    const outStatements = outLogs.map((log) => {
      return {
        transactionHash: log.transactionHash,
        blockHash: log.blockHash,
        blockNumber: log.blockNumber,
        from: log.args.from,
        to: log.args.to,
        amount: log.args.value,
        transactionType: "erc20 transfer",
        tokenId: "erc20",
        assetContractAddress: log.address,
      }
    });

    console.log("ERC20 OUT statement:", outStatements);
  } catch (error) {
    console.error("Error fetching transactions from RPC:", JSON.stringify(error));
    throw error;
  }
}

// TODO: Implement and test
function exportToCSV(transactions: Transaction[], outputFile: string): void {
  const csvHeader = [
    "Block Number",
    "Timestamp",
    "From",
    "To",
    "Value (ETH)",
    "Gas",
    "Gas Price (Gwei)",
    "Hash",
  ];
  const csvRows = transactions.map((tx) => [
    tx.blockNumber,
    new Date(parseInt(tx.timeStamp) * 1000).toISOString(), // Convert timestamp to ISO format
    tx.from,
    tx.to,
    (parseInt(tx.value) / 10 ** 18).toFixed(18), // Convert Wei to ETH
    tx.gas,
    (parseInt(tx.gasPrice) / 10 ** 9).toFixed(9), // Convert Wei to Gwei
    tx.hash,
  ]);

  const csvContent = [csvHeader, ...csvRows]
    .map((row) => row.join(","))
    .join("\n");

  fs.writeFileSync(outputFile, csvContent, "utf8");
  console.log(`Transaction history exported successfully to ${outputFile}`);
}

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
      const transactions = await fetchERC20Transactions(walletAddress);

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