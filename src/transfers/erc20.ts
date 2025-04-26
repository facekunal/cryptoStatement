import { createPublicClient, http, parseAbi, parseEther } from "viem";
import { mainnet } from "viem/chains";
import { Transaction, TransferType } from ".";

const RPCS = [
    "https://1rpc.io/eth",
    "https://eth.llamarpc.com",
    "https://eth.drpc.org",
];

export async function fetchTransactions(walletAddress: `0x${string}`): Promise<Transaction[]> {
  const client = createPublicClient({
    chain: mainnet,
    transport: http(RPCS[0]), // Use the first RPC endpoint from the list
  });

  try {
    // Define the ERC-20 Transfer event signature
    const transferEventAbi = parseAbi([
      "event Transfer(address indexed from, address indexed to, uint256 value)"
    ]);

    const BLOCK_RANGE = BigInt(1000);
    const latestBlockNumber = await client.getBlockNumber();

    // OUT
    const outLogs = await client.getLogs({
      event: transferEventAbi[0],
      fromBlock: latestBlockNumber - BLOCK_RANGE,
      toBlock: latestBlockNumber,
      // This filters logs where 'from' is your address
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
      }
    });

    console.log("ERC20 OUT statement:", outStatements);
    return outStatements;
  } catch (error) {
    console.error("Error fetching transactions from RPC:", JSON.stringify(error));
    throw error;
  }
}