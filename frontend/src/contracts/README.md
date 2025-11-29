# 智能合约集成说明

## 文件结构

将合约相关文件放在这个目录下：

```
contracts/
├── README.md          # 本说明文件
├── abi.json          # 合约 ABI (待添加)
└── config.js         # 合约配置 (待添加)
```

## 使用方法

### 1. 添加合约 ABI

将合约编译后生成的 ABI 文件保存为 `abi.json`：

```json
[
  {
    "inputs": [...],
    "name": "leaveMemory",
    "outputs": [...],
    "stateMutability": "payable",
    "type": "function"
  },
  ...
]
```

### 2. 配置合约地址

创建 `config.js` 文件：

```javascript
export const CONTRACT_CONFIG = {
  // 合约地址（部署后获得）
  address: '0x...',

  // 支持的链 ID
  chainId: {
    mainnet: 1,
    sepolia: 11155111,
    // 根据实际部署的链添加
  }
}
```

### 3. 在代码中使用

```javascript
import { ethers } from 'ethers'
import contractABI from './contracts/abi.json'
import { CONTRACT_CONFIG } from './contracts/config'

// 创建合约实例
const contract = new ethers.Contract(
  CONTRACT_CONFIG.address,
  contractABI,
  provider
)

// 调用合约方法
await contract.leaveMemory(content, {
  value: ethers.parseEther(amount.toString())
})
```

## 待办事项

- [ ] 添加合约 ABI 文件
- [ ] 添加合约配置文件
- [ ] 创建合约交互 Hook (useContract.js)
- [ ] 集成到 App.jsx 的 offerFlowers 函数中
