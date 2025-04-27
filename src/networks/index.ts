import { PublicClient } from "viem";
import { CLIENTS } from "../commons/config";

/**
 * The Network class provides static methods to interact with blockchain networks
 * using a set of configured PublicClient instances.
 */
export class Network {
  /**
   * Array of PublicClient instances used to interact with blockchain networks.
   * These clients are loaded from the CLIENTS configuration.
   */
  private static clients: PublicClient[] = CLIENTS;

  /**
   * Cached block number to avoid redundant network calls.
   */
  private static cachedBlockNumber: bigint | null = null;

  /**
   * Private constructor to prevent instantiation of the Network class.
   * All methods are static and should be accessed directly from the class.
   */
  private constructor() { }

  /**
   * Fetches the latest block number from the available clients.
   * Caches the result for the lifetime of the process (single run).
   *
   * @returns {Promise<bigint>} The latest block number as a bigint.
   * @throws {Error} If all clients fail to fetch the latest block number.
   */
  static async fetchLatestBlockNumber(): Promise<bigint> {
    if (Network.cachedBlockNumber !== null) {
      return Network.cachedBlockNumber;
    }

    for (const client of Network.clients) {
      try {
        const blockNumber = await client.getBlockNumber();
        Network.cachedBlockNumber = blockNumber;
        return blockNumber;
      } catch (error) {
        console.error(`Error fetching block number from client: ${error}`);
      }
    }
    throw new Error("All clients failed to fetch the latest block number.");
  }

  /**
   * Fetches ERC20 token information (decimals, name, symbol) for a given token address.
   * Uses the first available client that responds successfully.
   *
   * @param {string} tokenAddress - The ERC20 token contract address.
   * @returns {Promise<{ decimals: number; name: string; symbol: string }>} Token info.
   * @throws {Error} If all clients fail to fetch the token info.
   */
  static async fetchERC20TokenInfo(tokenAddress: `0x${string}`): Promise<{ decimals: number; name: string; symbol: string }> {
    const erc20Abi = [
      { type: "function", name: "decimals", stateMutability: "view", inputs: [], outputs: [{ type: "uint8", name: "" }] },
      { type: "function", name: "name", stateMutability: "view", inputs: [], outputs: [{ type: "string", name: "" }] },
      { type: "function", name: "symbol", stateMutability: "view", inputs: [], outputs: [{ type: "string", name: "" }] },
    ] as const;

    for (const client of Network.clients) {
      try {
        const [decimals, name, symbol] = await Promise.all([
          client.readContract({ address: tokenAddress, abi: erc20Abi, functionName: "decimals" }) as Promise<number>,
          client.readContract({ address: tokenAddress, abi: erc20Abi, functionName: "name" }) as Promise<string>,
          client.readContract({ address: tokenAddress, abi: erc20Abi, functionName: "symbol" }) as Promise<string>,
        ]);
        return { decimals, name, symbol };
      } catch (error) {
        console.error(`Error fetching ERC20 token info from client: ${error}`);
      }
    }
    throw new Error("All clients failed to fetch ERC20 token info.");
  }

  /**
   * Fetches a block by its block number or block hash from the available clients.
   * Iterates through the configured clients and returns the block from the first
   * client that responds successfully. If all clients fail, an error is thrown.
   *
   * @param {bigint | string} blockIdentifier - The block number (as bigint) or block hash (as string).
   * @returns {Promise<any>} The block data.
   * @throws {Error} If all clients fail to fetch the block.
   */
  static async fetchBlock(blockNumber: bigint): Promise<any> {
    console.debug("Fetching block details");
    for (const client of Network.clients) {
      try {
        const block = await client.getBlock({ blockNumber: blockNumber });
        return block;
      } catch (error) {
        console.error(`Error fetching block from client: ${error}`);
      }
    }
    throw new Error("All clients failed to fetch the block.");
  }
}
