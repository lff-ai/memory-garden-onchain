import { useState, useEffect } from 'react'
import './App.css'
import config from './config'
import { useWallet } from './hooks/useWallet'
import { useContract } from './hooks/useContract'

function App() {
  // 钱包状态
  const {
    account,
    provider,
    isConnecting,
    isConnected,
    connectWallet,
    disconnectWallet,
    formatAddress
  } = useWallet()

  // 合约状态
  const {
    contract,
    isLoading: isContractLoading,
    leaveMemory,
    getMemories
  } = useContract(provider, account)

  const [monAmount, setMonAmount] = useState(config.mon.defaultAmount)
  const [flowerCount, setFlowerCount] = useState(10)
  const [staticFlowers, setStaticFlowers] = useState([])
  const [floatingFlowers, setFloatingFlowers] = useState([])
  const [isOffering, setIsOffering] = useState(false)
  const [showTribute, setShowTribute] = useState(false)
  const [stars, setStars] = useState([])
  const [memoryContent, setMemoryContent] = useState('')
  const [totalFlowersOffered, setTotalFlowersOffered] = useState(0)

  // 生成星星（改成光点）
  useEffect(() => {
    const starArray = []
    for (let i = 0; i < 30; i++) {
      starArray.push({
        id: i,
        size: Math.random() * 4 + 2,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 3
      })
    }
    setStars(starArray)
  }, [])

  // 计算花朵数量
  const calculateFlowers = (amount) => {
    return Math.floor(amount * config.flower.flowerPerMon)
  }

  // 监听金额变化
  useEffect(() => {
    setFlowerCount(calculateFlowers(monAmount))
  }, [monAmount])

  // 献花功能
  const offerFlowers = async () => {
    if (!isConnected) {
      alert('请先连接钱包')
      return
    }

    if (flowerCount <= 0) {
      alert('请输入有效的 MON 币数量')
      return
    }

    if (!contract) {
      alert('合约未初始化，请检查网络连接')
      return
    }

    // 使用默认记忆内容（如果用户未输入）
    const content = memoryContent.trim() || '一段美好的青春记忆'

    setIsOffering(true)

    try {
      // 调用智能合约
      console.log('正在调用合约...')
      console.log('钱包地址:', account)
      console.log('投入金额:', monAmount, 'MON')
      console.log('记忆内容:', content)
      console.log('花束数量（传给合约 offer）:', flowerCount)

      const receipt = await leaveMemory(flowerCount, monAmount)

      console.log('交易成功！交易哈希:', receipt.hash)

      // 创建飘浮的花朵
      const flowersToProduce = Math.min(flowerCount, 30)
      const interval = 2000 / flowersToProduce

      for (let i = 0; i < flowersToProduce; i++) {
        setTimeout(() => {
          createFloatingFlower()
        }, i * interval)
      }

      // 添加静态花朵
      setTimeout(() => {
        addStaticFlowers(flowerCount)
      }, 2500)

      // 显示感谢消息
      setTimeout(() => {
        setShowTribute(true)
        setTimeout(() => setShowTribute(false), 3000)
      }, 2800)

      // 更新本地累计花朵数量（前端计算）
      setTimeout(() => {
        setTotalFlowersOffered((prev) => prev + flowerCount)
      }, 3000)

      // 恢复按钮
      setTimeout(() => {
        setIsOffering(false)
        setMonAmount(config.mon.defaultAmount)
        setMemoryContent('')
      }, 6000)
    } catch (err) {
      console.error('交易失败:', err)
      alert(`交易失败: ${err.message}`)
      setIsOffering(false)
    }
  }

  // 创建飘浮花朵
  const createFloatingFlower = () => {
    const id = Date.now() + Math.random()
    const startX = Math.random() * window.innerWidth
    const drift = (Math.random() - 0.5) * 100

    setFloatingFlowers(prev => [...prev, { id, startX, drift }])

    setTimeout(() => {
      setFloatingFlowers(prev => prev.filter(f => f.id !== id))
    }, 3000)
  }

  // 添加静态花朵
  const addStaticFlowers = (count) => {
    const maxFlowers = calculateMaxFlowers()
    const newFlowers = []

    for (let i = 0; i < count; i++) {
      newFlowers.push({
        id: Date.now() + i,
        delay: i * 0.05
      })
    }

    setStaticFlowers(prev => {
      const combined = [...prev, ...newFlowers]
      if (combined.length > maxFlowers) {
        return combined.slice(combined.length - maxFlowers)
      }
      return combined
    })
  }

  // 计算最大花朵数量
  const calculateMaxFlowers = () => {
    const isMobile = window.innerWidth <= 768
    const flowerSize = isMobile ? 20 : 26
    const gap = isMobile ? 4 : 6
    const totalSize = flowerSize + gap

    const containerWidth = 680
    const containerHeight = 200

    const flowersPerRow = Math.floor(containerWidth / totalSize)
    const rows = Math.floor(containerHeight / totalSize)

    return Math.max(flowersPerRow * rows, 15)
  }

  return (
    <div className="app">
      {/* 光点背景 */}
      <div className="stars">
        {stars.map(star => (
          <div
            key={star.id}
            className="star"
            style={{
              width: `${star.size}px`,
              height: `${star.size}px`,
              left: `${star.left}%`,
              top: `${star.top}%`,
              animationDelay: `${star.delay}s`
            }}
          />
        ))}
      </div>

      <header>
        <h1>青春纪念花园</h1>
        <p className="subtitle">
          每个人都有值得被记住的过去<br />
          青春不该被遗忘，也不该成为我们前行的羁绊<br />
          如果你愿意，这里可以留下你的故事
        </p>
      </header>

      {/* 莲花区域 */}
      <div className="tree-container">
        <div className="tree-wrapper">
          {/* 莲花 */}
          <div className="lotus">
            {/* 外层花瓣 */}
            <div className="lotus-petal outer-petal petal-1"></div>
            <div className="lotus-petal outer-petal petal-2"></div>
            <div className="lotus-petal outer-petal petal-3"></div>
            <div className="lotus-petal outer-petal petal-4"></div>
            <div className="lotus-petal outer-petal petal-5"></div>
            <div className="lotus-petal outer-petal petal-6"></div>

            {/* 中层花瓣 */}
            <div className="lotus-petal middle-petal petal-1"></div>
            <div className="lotus-petal middle-petal petal-2"></div>
            <div className="lotus-petal middle-petal petal-3"></div>
            <div className="lotus-petal middle-petal petal-4"></div>
            <div className="lotus-petal middle-petal petal-5"></div>
            <div className="lotus-petal middle-petal petal-6"></div>

            {/* 内层花瓣 */}
            <div className="lotus-petal inner-petal petal-1"></div>
            <div className="lotus-petal inner-petal petal-2"></div>
            <div className="lotus-petal inner-petal petal-3"></div>
            <div className="lotus-petal inner-petal petal-4"></div>
            <div className="lotus-petal inner-petal petal-5"></div>

            {/* 花蕊中心 */}
            <div className="lotus-center">
              <div className="lotus-core"></div>
            </div>

            {/* 莲花发光效果 */}
            <div className="lotus-glow"></div>
          </div>

          {/* 底座平台 */}
          <div className="platform">
            <div className="platform-stone"></div>
            <div className="platform-wood"></div>
          </div>

          {/* 莲花文字 */}
          <div className="tree-text">青春之莲</div>
        </div>

        {/* 花朵堆积区 */}
        <div className="flowers-area">
          <div className="flowers-pile">
            {staticFlowers.map(flower => (
              <div
                key={flower.id}
                className="flower-static"
                style={{ animationDelay: `${flower.delay}s` }}
              >
                🌸
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer>
        <p>纪念我们的青春 · 青春如花，谁人不青春</p>
      </footer>

      {/* 控制面板 */}
      <div className="control-panel">
        <div className="control-content">
          {/* 钱包连接按钮 */}
          <div className="wallet-section">
            {!isConnected ? (
              <button
                className="wallet-button"
                onClick={connectWallet}
                disabled={isConnecting}
              >
                {isConnecting ? '连接中...' : '🔗 连接钱包'}
              </button>
            ) : (
              <div className="wallet-info">
                <div className="wallet-address">{formatAddress(account)}</div>
                <button className="wallet-disconnect" onClick={disconnectWallet}>
                  断开
                </button>
              </div>
            )}
          </div>

          <div className="input-group">
            <label htmlFor="memoryContent">记忆内容</label>
            <input
              type="text"
              id="memoryContent"
              placeholder="留下一段青春的记忆..."
              value={memoryContent}
              onChange={(e) => setMemoryContent(e.target.value)}
              disabled={!isConnected}
              style={{ width: '200px' }}
            />
          </div>

          <div className="input-group">
            <label htmlFor="monAmount">投入 MON 币数量（最多 {config.mon.maxAmount} MON）</label>
            <input
              type="number"
              id="monAmount"
              placeholder={`请输入金额（默认 ${config.mon.defaultAmount}）`}
              min={config.mon.minAmount}
              max={config.mon.maxAmount}
              step={config.mon.step}
              value={monAmount}
              onChange={(e) => {
                const value = parseFloat(e.target.value) || 0
                // 限制最大值
                if (value > config.mon.maxAmount) {
                  setMonAmount(config.mon.maxAmount)
                } else {
                  setMonAmount(value)
                }
              }}
              disabled={!isConnected}
            />
          </div>

          <div className="flower-display">
            <div className="flower-icon">🌸</div>
            <div className="flower-display-text">可献</div>
            <div className="flower-count">{flowerCount}</div>
            <div className="flower-display-text">朵 | 累计: {totalFlowersOffered}</div>
          </div>

          <button
            className="offer-button"
            onClick={offerFlowers}
            disabled={isOffering || !isConnected}
          >
            {isOffering ? '记录中...' : isConnected ? '留下记忆' : '请先连接钱包'}
          </button>
        </div>
      </div>

      {/* 飘浮的花朵 */}
      {floatingFlowers.map(flower => (
        <div
          key={flower.id}
          className="floating-flower"
          style={{
            left: `${flower.startX}px`,
            '--drift': `${flower.drift}px`
          }}
        >
          🌸
        </div>
      ))}

      {/* 感谢消息 */}
      <div className={`tribute-message ${showTribute ? 'show' : ''}`}>
        <div>🌸</div>
        <div style={{ marginTop: '20px' }}>感谢你的故事</div>
        <div style={{ fontSize: '0.8em', marginTop: '10px' }}>
          青春的记忆永不褪色
        </div>
      </div>
    </div>
  )
}

export default App
