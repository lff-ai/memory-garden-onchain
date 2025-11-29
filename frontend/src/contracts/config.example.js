/**
 * 智能合约配置文件示例
 *
 * 使用方法:
 * 1. 复制此文件为 config.js
 * 2. 填入实际的合约地址
 * 3. 在代码中导入: import { CONTRACT_CONFIG } from './contracts/config'
 */

export const CONTRACT_CONFIG = {
  // 合约地址（部署后填入）
  address: '0x0000000000000000000000000000000000000000',

  // 支持的链 ID
  chains: {
    // 以太坊主网
    mainnet: {
      chainId: 1,
      name: 'Ethereum Mainnet',
      rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY'
    },

    // Sepolia 测试网
    sepolia: {
      chainId: 11155111,
      name: 'Sepolia Testnet',
      rpcUrl: 'https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY'
    },

    // Polygon 主网
    polygon: {
      chainId: 137,
      name: 'Polygon Mainnet',
      rpcUrl: 'https://polygon-mainnet.g.alchemy.com/v2/YOUR_API_KEY'
    },

    // Mumbai 测试网 (Polygon)
    mumbai: {
      chainId: 80001,
      name: 'Mumbai Testnet',
      rpcUrl: 'https://polygon-mumbai.g.alchemy.com/v2/YOUR_API_KEY'
    }
  },

  // 当前使用的链（根据实际部署情况修改）
  currentChain: 'sepolia'
}

// 获取当前链配置
export const getCurrentChainConfig = () => {
  return CONTRACT_CONFIG.chains[CONTRACT_CONFIG.currentChain]
}
