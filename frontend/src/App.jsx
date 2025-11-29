import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [monAmount, setMonAmount] = useState(0.001)
  const [flowerCount, setFlowerCount] = useState(10)
  const [staticFlowers, setStaticFlowers] = useState([])
  const [floatingFlowers, setFloatingFlowers] = useState([])
  const [isOffering, setIsOffering] = useState(false)
  const [showTribute, setShowTribute] = useState(false)
  const [stars, setStars] = useState([])

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
    return Math.floor(amount * 10000)
  }

  // 监听金额变化
  useEffect(() => {
    setFlowerCount(calculateFlowers(monAmount))
  }, [monAmount])

  // 献花功能
  const offerFlowers = () => {
    if (flowerCount <= 0) {
      alert('请输入有效的 MON 币数量')
      return
    }

    setIsOffering(true)

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

    // 恢复按钮
    setTimeout(() => {
      setIsOffering(false)
      setMonAmount(0.001)
    }, 6000)
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

      {/* 许愿树区域 */}
      <div className="tree-container">
        <div className="tree-wrapper">
          {/* 树冠 */}
          <div className="tree-crown">
            <div className="tree-crown-layer layer-1"></div>
            <div className="tree-crown-layer layer-2"></div>
            <div className="tree-crown-layer layer-3"></div>
          </div>

          {/* 树干 */}
          <div className="tree-trunk"></div>

          {/* 许愿树文字 */}
          <div className="tree-text">青春之树</div>
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
          <div className="input-group">
            <label htmlFor="monAmount">投入 MON 币数量</label>
            <input
              type="number"
              id="monAmount"
              placeholder="请输入金额（默认 0.001）"
              min="0"
              step="0.001"
              value={monAmount}
              onChange={(e) => setMonAmount(parseFloat(e.target.value) || 0)}
            />
          </div>

          <div className="flower-display">
            <div className="flower-icon">🌸</div>
            <div className="flower-display-text">可献</div>
            <div className="flower-count">{flowerCount}</div>
            <div className="flower-display-text">朵</div>
          </div>

          <button
            className="offer-button"
            onClick={offerFlowers}
            disabled={isOffering}
          >
            {isOffering ? '记录中...' : '留下记忆'}
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
