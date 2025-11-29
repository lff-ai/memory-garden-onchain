import hardhatToolboxViemPlugin from "@nomicfoundation/hardhat-toolbox-viem";
import { defineConfig } from "hardhat/config";
import * as dotenv from "dotenv";

dotenv.config();

const MONAD_TESTNET_PRIVATE_KEY = process.env.MONAD_TESTNET_PRIVATE_KEY || "";
const MONAD_TESTNET_RPC_URL = process.env.MONAD_TESTNET_RPC_URL || "";

export default defineConfig({
  plugins: [hardhatToolboxViemPlugin],
  solidity: {
    profiles: {
      default: {
        version: "0.8.28",
      },
      production: {
        version: "0.8.28",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    },
  },
  networks: {
    hardhatMainnet: {
      type: "edr-simulated",
      chainType: "l1",
    },
    hardhatOp: {
      type: "edr-simulated",
      chainType: "op",
    },
    monadTestnet: {
      type: "http",
      chainType: "l1",
      url: MONAD_TESTNET_RPC_URL,
      accounts: MONAD_TESTNET_PRIVATE_KEY ? [MONAD_TESTNET_PRIVATE_KEY] : [],
      chainId: 10143, // Monad Testnet 的 chainId
    },
  },
});
