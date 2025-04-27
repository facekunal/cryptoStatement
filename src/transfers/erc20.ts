import { parseAbi } from "viem";
import { Transaction, TransferType } from "../commons/types";
import { CLIENTS, TOTAL_BLOCKS } from "../commons/config";
import { TransactionFetcher } from ".";
import { Network } from "../networks";

export class Erc20Fetcher implements TransactionFetcher {

  async fetchTransactions(walletAddress: `0x${string}`): Promise<Transaction[]> {
    console.log("Fetching ERC20 transactions...");
    const BLOCK_RANGE = BigInt(1000);
  
    let allTransactions: Transaction[] = [];
    let clientIndex = 0;
    const latestBlockNumber = await Network.fetchLatestBlockNumber();
  
    while (clientIndex < CLIENTS.length) {
      try {
        const client = CLIENTS[clientIndex];
  
        for (let i = BigInt(0); i < TOTAL_BLOCKS; i += BLOCK_RANGE) {
          const fromBlock = latestBlockNumber - (i + BLOCK_RANGE) + BigInt(1);
          const toBlock = latestBlockNumber - i;
  
          // Fetch logs for the current block range
          const transferEventAbi = parseAbi([
            "event Transfer(address indexed from, address indexed to, uint256 value)"
          ]);
  
          // Fetch outgoing transactions (where the wallet is the sender)
          const outLogs = await client.getLogs({
            event: transferEventAbi[0],
            fromBlock: fromBlock > BigInt(0) ? fromBlock : BigInt(0), // Ensure fromBlock is not negative
            toBlock: toBlock,
            args: {
              from: walletAddress,
            },
          });
  
          const outStatements: Transaction[] = outLogs.map((log) => {
            return {
              transactionHash: log.transactionHash,
              blockHash: log.blockHash,
              blockNumber: log.blockNumber,
              from: log.args.from,
              to: log.args.to,
              amount: log.args.value,
              transactionType: TransferType.ERC20,
              assetContractAddress: log.address,
            };
          });
  
          allTransactions = allTransactions.concat(outStatements);
  
          // Fetch incoming transactions (where the wallet is the recipient)
          const inLogs = await client.getLogs({
            event: transferEventAbi[0],
            fromBlock: fromBlock > BigInt(0) ? fromBlock : BigInt(0), // Ensure fromBlock is not negative
            toBlock,
            args: {
              to: walletAddress as `0x${string}`,
            },
          });
  
          const inStatements: Transaction[] = inLogs.map((log) => {
            return {
              transactionHash: log.transactionHash,
              blockHash: log.blockHash,
              blockNumber: log.blockNumber,
              from: log.args.from,
              to: log.args.to,
              amount: log.args.value,
              transactionType: TransferType.ERC20,
              assetContractAddress: log.address,
            };
          });
  
          allTransactions = allTransactions.concat(inStatements);
  
          console.log(`Fetched ${outStatements.length + inStatements.length} transactions from block ${fromBlock} to ${toBlock}`);
        }
  
        return allTransactions; // Return if successful
      } catch (error) {
        console.error(`Error fetching transactions from RPC: ${clientIndex}`, error);
        clientIndex++; // Move to the next RPC in the list
        if (clientIndex >= CLIENTS.length) {
          throw new Error("All RPC endpoints failed.");
        }
      }
    }
  
    return allTransactions;
  }
}