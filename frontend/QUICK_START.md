# 快速开始指南

## ✅ 已完成的工作

### 1. 智能合约集成
- ✅ ABI 文件已配置（`src/contracts/abi.json`）
- ✅ 合约配置文件已创建（`src/contracts/config.js`）
- ✅ 合约交互 Hook 已启用（`src/hooks/useContract.js`）
- ✅ 前端 UI 已集成合约功能（`src/App.jsx`）

### 2. 功能特性
- ✅ 钱包连接（MetaMask）
- ✅ 留下记忆并购买花束
- ✅ 查询用户花束数量
- ✅ 查询用户记忆列表
- ✅ 实时显示链上数据
- ✅ 交易状态反馈

### 3. 用户界面
- ✅ 记忆内容输入框
- ✅ MON 币数量输入
- ✅ 花束数量实时计算
- ✅ 链上总花束数量显示
- ✅ 交易进度提示

## ⚠️ 需要配置

### 唯一需要做的事情：填写合约地址

**文件位置**：[src/contracts/config.js](src/contracts/config.js:10)

找到这一行：
```javascript
address: '0x0000000000000000000000000000000000000000', // TODO: 填写实际的合约地址
```

替换为你部署的合约地址。

## 🚀 使用步骤

### 1. 部署智能合约
使用你的 ABI 对应的合约源码部署到 Moonbase Alpha 测试网。

### 2. 更新合约地址
```javascript
// src/contracts/config.js
export const CONTRACT_CONFIG = {
  address: '0x你的合约地址', // ← 在这里填写
  // ...
}
```

### 3. 启动应用
```bash
npm run dev
```

### 4. 测试功能
1. 打开 http://localhost:5173
2. 点击"连接钱包"按钮
3. 在 MetaMask 中确认连接
4. 确保钱包切换到 Moonbase Alpha 测试网
5. 输入记忆内容（可选，有默认值）
6. 设置 MON 币数量（默认 0.001）
7. 点击"留下记忆"
8. 在 MetaMask 中确认交易
9. 等待交易确认，花朵会飞起并堆积

## 📝 合约方法说明

### leaveMemory(string content)
- **功能**：留下记忆并购买花束
- **参数**：记忆内容
- **支付**：MON 代币
- **前端调用**：用户点击"留下记忆"按钮时自动调用

### getFlowerCount(address user)
- **功能**：获取用户的花束总数
- **前端调用**：
  - 连接钱包后自动加载
  - 交易成功后自动更新

### getMemories(address user)
- **功能**：获取用户的记忆列表
- **前端调用**：已集成但未在 UI 中展示（可扩展）

## 🔧 开发说明

### 项目结构
```
frontend/
├── src/
│   ├── contracts/
│   │   ├── abi.json           # 合约 ABI（已配置）
│   │   └── config.js          # 合约配置（需填写地址）
│   ├── hooks/
│   │   ├── useWallet.js       # 钱包连接 Hook
│   │   └── useContract.js     # 合约交互 Hook
│   ├── App.jsx                # 主应用组件
│   └── config.js              # 应用配置
├── CONTRACT_SETUP.md          # 详细配置指南
└── QUICK_START.md             # 本文件
```

### 关键代码位置

#### 合约调用
[src/hooks/useContract.js](src/hooks/useContract.js)
```javascript
// 留下记忆
const receipt = await leaveMemory(content, amount)

// 获取花束数量
const count = await getFlowerCount(userAddress)

// 获取记忆列表
const memories = await getMemories(userAddress)
```

#### 前端集成
[src/App.jsx](src/App.jsx:76-150)
```javascript
const offerFlowers = async () => {
  // 调用智能合约
  const receipt = await leaveMemory(content, monAmount)

  // 更新 UI
  // ...
}
```

## 🌐 网络配置

### Moonbase Alpha 测试网
- **Chain ID**：1287 (0x507)
- **RPC**：https://rpc.api.moonbase.moonbeam.network
- **浏览器**：https://moonbase.moonscan.io/
- **水龙头**：https://faucet.moonbeam.network/

### 添加到 MetaMask
应用会自动提示用户添加网络（如果检测到网络不匹配）。

## 📊 数据流

```
用户操作
  ↓
连接钱包 (useWallet)
  ↓
初始化合约 (useContract)
  ↓
调用合约方法 (leaveMemory/getFlowerCount)
  ↓
等待交易确认
  ↓
更新 UI 状态
  ↓
显示花朵动画
```

## ❓ 常见问题

### Q: 合约未初始化？
A: 请检查 `src/contracts/config.js` 中的合约地址是否已填写。

### Q: 交易失败？
A: 可能原因：
1. 钱包余额不足
2. 网络错误（需切换到 Moonbase Alpha）
3. 合约地址错误

### Q: 花束数量不更新？
A: 等待交易确认后会自动更新，如果仍未更新，刷新页面。

## 📚 更多信息

详细配置说明请查看：[CONTRACT_SETUP.md](CONTRACT_SETUP.md)

## 🎉 完成！

配置完合约地址后，你的青春纪念花园就可以在区块链上记录永恒的记忆了！
