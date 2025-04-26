import { createPublicClient, http, parseAbi } from "viem";
import { mainnet } from "viem/chains";
import { Transaction, TransferType } from "../commons/types";
import { RPCS, TOTAL_BLOCKS } from "../commons/config";


/**
 * Fetches ERC20 transactions for a given wallet address.
 * @param walletAddress - The wallet address to fetch transactions for.
 * @returns A promise that resolves to an array of transactions.
 * @throws An error if all RPC endpoints fail.
 */
export async function fetchTransactions(walletAddress: `0x${string}`): Promise<Transaction[]> {
  const BLOCK_RANGE = BigInt(1000);

  let allTransactions: Transaction[] = [];
  let rpcIndex = 0;

  while (rpcIndex < RPCS.length) {
    try {
      const client = createPublicClient({
        chain: mainnet,
        transport: http(RPCS[rpcIndex]), // Use the current RPC endpoint
      });

      const latestBlockNumber = await client.getBlockNumber();

      for (let i = BigInt(0); i < TOTAL_BLOCKS; i += BLOCK_RANGE) {
        const fromBlock = latestBlockNumber - i - BLOCK_RANGE;
        const toBlock = latestBlockNumber - i;

        // Fetch logs for the current block range
        const transferEventAbi = parseAbi([
          "event Transfer(address indexed from, address indexed to, uint256 value)"
        ]);

        // Fetch outgoing transactions (where the wallet is the sender)
        const outLogs = await client.getLogs({
          event: transferEventAbi[0],
          fromBlock: fromBlock > BigInt(0) ? fromBlock : BigInt(0), // Ensure fromBlock is not negative
          toBlock,
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
            to: walletAddress,
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
      }

      return allTransactions; // Return if successful
    } catch (error) {
      console.error(`Error fetching transactions from RPC ${RPCS[rpcIndex]}:`, error);
      rpcIndex++; // Move to the next RPC in the list
      if (rpcIndex >= RPCS.length) {
        throw new Error("All RPC endpoints failed.");
      }
    }
  }

  return allTransactions;
}