// 应用配置文件
const config = {
  // MON 币相关配置
  mon: {
    // 最大输入数量限制
    maxAmount: 0.01,
    // 最小输入数量
    minAmount: 0,
    // 输入步长
    step: 0.001,
    // 默认数量
    defaultAmount: 0.001
  },

  // 花朵相关配置
  flower: {
    // 每个 MON 币对应的花朵数量
    flowerPerMon: 10000
  }
}

export default config
