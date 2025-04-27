import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";

// The total number of blocks to fetched
export const TOTAL_BLOCKS = BigInt(5_000);

/**
 * List of RPC endpoints
 * These are public endpoints and may have rate limits or restrictions
 * 
 * Note: In production, couple of paid endpoints and few public endpoints should be used as fallback
 */
const RPCS = [
    "https://1rpc.io/eth",
    "https://eth.llamarpc.com",
    "https://eth.drpc.org",
    "https://ethereum-rpc.publicnode.com",
    "https://gateway.tenderly.co/public/mainnet"
];

// List of static clients
export const CLIENTS = RPCS.map(rpc => 
    createPublicClient({
        chain: mainnet,
        transport: http(rpc), // Use the current RPC endpoint
    })
);
