# 智能合约配置指南

## 概述
本项目已集成智能合约功能，可以将用户的记忆和献花记录存储在区块链上。

## 当前状态
✅ ABI 文件已配置：`src/contracts/abi.json`
✅ 合约 Hook 已启用：`src/hooks/useContract.js`
✅ 前端集成已完成：`src/App.jsx`
⚠️ **待配置**：合约地址

## 配置步骤

### 1. 部署智能合约
首先需要在 Moonbase Alpha 测试网上部署智能合约。

### 2. 更新合约地址
部署完成后，打开文件：`src/contracts/config.js`

找到这一行：
```javascript
address: '0x0000000000000000000000000000000000000000', // TODO: 填写实际的合约地址
```

将其替换为你部署的合约地址，例如：
```javascript
address: '0x1234567890abcdef1234567890abcdef12345678',
```

### 3. 配置网络（可选）
默认配置使用 Moonbase Alpha 测试网。如果需要修改网络配置，可以在 `src/contracts/config.js` 中调整：

```javascript
network: {
  chainId: '0x507', // 1287 in hex (Moonbase Alpha)
  chainName: 'Moonbase Alpha',
  nativeCurrency: {
    name: 'DEV',
    symbol: 'DEV',
    decimals: 18
  },
  rpcUrls: ['https://rpc.api.moonbase.moonbeam.network'],
  blockExplorerUrls: ['https://moonbase.moonscan.io/']
}
```

### 4. 启动应用
```bash
npm run dev
```

### 5. 测试功能
1. 连接 MetaMask 钱包
2. 确保钱包已切换到 Moonbase Alpha 测试网
3. 输入记忆内容
4. 设置 MON 币数量
5. 点击"留下记忆"按钮
6. 在 MetaMask 中确认交易

## 合约功能说明

### 合约方法

#### `leaveMemory(string content)`
- **功能**：留下一段记忆并购买相应数量的花束
- **参数**：
  - `content`: 记忆内容（字符串）
- **支付**：需要支付一定数量的 MON 代币（通过 `value` 参数）
- **返回**：交易回执

#### `getFlowerCount(address user)`
- **功能**：获取指定用户的花束总数
- **参数**：
  - `user`: 用户地址
- **返回**：花束数量（uint256）

#### `getMemories(address user)`
- **功能**：获取指定用户的所有记忆
- **参数**：
  - `user`: 用户地址
- **返回**：记忆列表（string[]）

## 前端集成说明

### Hook 使用
```javascript
import { useContract } from './hooks/useContract'

// 在组件中使用
const { contract, isLoading, leaveMemory, getFlowerCount, getMemories } = useContract(provider, account)
```

### 调用示例
```javascript
// 留下记忆
await leaveMemory('青春的记忆', 0.001) // 内容和金额

// 获取花束数量
const count = await getFlowerCount(userAddress)

// 获取记忆列表
const memories = await getMemories(userAddress)
```

## 网络配置

### Moonbase Alpha 测试网信息
- **网络名称**：Moonbase Alpha
- **Chain ID**：1287 (0x507)
- **RPC URL**：https://rpc.api.moonbase.moonbeam.network
- **区块浏览器**：https://moonbase.moonscan.io/
- **测试币水龙头**：https://faucet.moonbeam.network/

### 添加网络到 MetaMask
1. 打开 MetaMask
2. 点击网络下拉菜单
3. 点击"添加网络"
4. 输入上述网络信息
5. 保存

## 故障排除

### 问题：合约未初始化
- **原因**：未填写合约地址或地址无效
- **解决**：检查 `src/contracts/config.js` 中的合约地址

### 问题：交易失败
- **可能原因**：
  1. 钱包余额不足
  2. 网络不匹配
  3. Gas 费用过低
- **解决**：
  1. 确保钱包有足够的 DEV 代币
  2. 切换到 Moonbase Alpha 测试网
  3. 增加 Gas 费用

### 问题：无法连接钱包
- **原因**：未安装 MetaMask
- **解决**：安装 MetaMask 浏览器插件

## 开发注意事项

1. **测试环境**：建议先在测试网充分测试后再部署到主网
2. **Gas 优化**：注意优化合约调用以降低 Gas 费用
3. **错误处理**：所有合约调用都已包含错误处理
4. **交易确认**：使用 `await tx.wait()` 等待交易确认

## 下一步

- [ ] 部署智能合约
- [ ] 更新合约地址
- [ ] 测试合约功能
- [ ] 优化用户体验
- [ ] 添加更多功能（如查看历史记忆等）
