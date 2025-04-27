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
   * Private constructor to prevent instantiation of the Network class.
   * All methods are static and should be accessed directly from the class.
   */
  private constructor() {}

  /**
   * Fetches the latest block number from the available clients.
   * Iterates through the configured clients and returns the block number from the first
   * client that responds successfully. If all clients fail, an error is thrown.
   *
   * @returns {Promise<bigint>} The latest block number as a bigint.
   * @throws {Error} If all clients fail to fetch the latest block number.
   */
  static async fetchLatestBlockNumber(): Promise<bigint> {
    for (const client of Network.clients) {
      try {
        const blockNumber = await client.getBlockNumber();
        return blockNumber;
      } catch (error) {
        console.error(`Error fetching block number from client: ${error}`);
      }
    }
    throw new Error("All clients failed to fetch the latest block number.");
  }
}
