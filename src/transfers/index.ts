import { Transaction } from "../commons/types";
import { TokenType } from "../tokens/types";
import { Erc1155Fetcher, Erc20Fetcher, Erc721Fetcher, EthFetcher } from "./transactionFetchers";

/**
 * Fetches transactions for a given wallet address using the appropriate fetcher.
 *
 * @param walletAddress The wallet address to fetch transactions for.
 * @returns Promise resolving to an array of Transaction objects.
 */
export async function fetchTransactions(walletAddress: `0x${string}`): Promise<Transaction[]> {
    // Fetch for all supported token types in parallel
    const fetchers = [
        TransactionFetcherFactory.getFetcher(TokenType.ETH),
        TransactionFetcherFactory.getFetcher(TokenType.ERC20),
        TransactionFetcherFactory.getFetcher(TokenType.ERC721),
        TransactionFetcherFactory.getFetcher(TokenType.ERC1155),
    ];

    const results = await Promise.allSettled(
        fetchers.map(fetcher => fetcher.fetchTransactions(walletAddress))
    );

    // Flatten successful results, ignore rejected ones
    const transactions = results
        .filter(r => r.status === "fulfilled")
        .flatMap((r: any) => r.value);

    return transactions;
}

/**
 * Interface for transaction fetchers. Each fetcher should implement this interface
 * to provide a method for fetching transactions for a given wallet address.
 */
export interface TransactionFetcher {
    fetchTransactions(walletAddress: `0x${string}`): Promise<Transaction[]>;
}
  
/**
 * Factory class to instantiate the correct TransactionFetcher based on the transfer type.
 */
class TransactionFetcherFactory {
  /**
   * Returns an instance of the appropriate TransactionFetcher for the given transfer type.
   * @param transferType The type of transfer (ETH, ERC20, etc).
   * @returns An instance of a class implementing TransactionFetcher.
   * @throws {Error} If the transfer type is unsupported.
   */
  static getFetcher(transferType: TokenType): TransactionFetcher {
    switch (transferType) {
      case TokenType.ETH:
        return new EthFetcher();
      case TokenType.ERC20:
        return new Erc20Fetcher();
      case TokenType.ERC721:
        return new Erc721Fetcher();
      case TokenType.ERC1155:
        return new Erc1155Fetcher();
      case TokenType.UNRESOLVED_NFT:
      default:
        throw new Error(`Unsupported token type: ${transferType}`);
    }
  }
}
