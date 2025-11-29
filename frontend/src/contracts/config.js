// 智能合约配置
export const CONTRACT_CONFIG = {
  // 合约地址
  address: '0x6b251f5ad94b7cc9f75e059bccb79c9d5c85ffdb',

  // 网络配置
  network: {
    // Moonbase Alpha 测试网
    chainId: '0x507', // 1287 in hex
    chainName: 'Moonbase Alpha',
    nativeCurrency: {
      name: 'DEV',
      symbol: 'DEV',
      decimals: 18
    },
    rpcUrls: ['https://rpc.api.moonbase.moonbeam.network'],
    blockExplorerUrls: ['https://moonbase.moonscan.io/']
  }
}
