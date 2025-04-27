import { describe } from "node:test";
import { Network } from "./index";

describe("Network.fetchLatestBlockNumber (integration)", () => {
    it("should fetch the latest block number", async () => {
      const blockNumber = await Network.fetchLatestBlockNumber();
      expect(typeof blockNumber).toBe("bigint");
      expect(blockNumber).toBeGreaterThan(0);
    });
});

describe("Network.fetchERC20TokenInfo", () => {
  it("should fetch decimals, name, and symbol", async () => {
    const tokenAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
    const info = await Network.fetchERC20TokenInfo(tokenAddress);
    expect(info).toEqual({ decimals: 6, name: "Tether USD", symbol: "USDT" });
  });
});

describe.only("Network.fetchBlock", () => {
  const mockBlock = { number: 12345, hash: "0xabc" };

  it("should return block data from the first successful client", async () => {
    console.log("getting block details");
    const block = await Network.fetchBlock(BigInt("22360695"));
    console.log("block details", block);
    expect(block).toEqual(mockBlock);
  });
});