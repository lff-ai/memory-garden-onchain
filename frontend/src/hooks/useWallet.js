import { useState, useEffect } from 'react'
import { BrowserProvider } from 'ethers'

export const useWallet = () => {
  const [account, setAccount] = useState(null)
  const [provider, setProvider] = useState(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState(null)

  // 检查是否安装了 MetaMask
  const isMetaMaskInstalled = () => {
    return typeof window.ethereum !== 'undefined'
  }

  // 连接钱包
  const connectWallet = async () => {
    if (!isMetaMaskInstalled()) {
      setError('请安装 MetaMask 钱包')
      alert('请先安装 MetaMask 钱包插件！')
      return
    }

    setIsConnecting(true)
    setError(null)

    try {
      // 请求账户访问
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      })

      if (accounts.length > 0) {
        const provider = new BrowserProvider(window.ethereum)
        setProvider(provider)
        setAccount(accounts[0])
      }
    } catch (err) {
      console.error('连接钱包失败:', err)
      if (err.code === 4001) {
        setError('用户拒绝了连接请求')
      } else {
        setError('连接钱包失败，请重试')
      }
    } finally {
      setIsConnecting(false)
    }
  }

  // 断开钱包
  const disconnectWallet = () => {
    setAccount(null)
    setProvider(null)
    setError(null)
  }

  // 格式化地址（显示为简写形式）
  const formatAddress = (address) => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  // 监听账户变化
  useEffect(() => {
    if (!isMetaMaskInstalled()) return

    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        // 用户断开了所有账户
        disconnectWallet()
      } else if (accounts[0] !== account) {
        // 用户切换了账户
        setAccount(accounts[0])
      }
    }

    const handleChainChanged = () => {
      // 链发生变化时重新加载页面
      window.location.reload()
    }

    window.ethereum.on('accountsChanged', handleAccountsChanged)
    window.ethereum.on('chainChanged', handleChainChanged)

    // 清理监听器
    return () => {
      if (window.ethereum.removeListener) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
        window.ethereum.removeListener('chainChanged', handleChainChanged)
      }
    }
  }, [account])

  // 页面加载时检查是否已连接
  useEffect(() => {
    if (!isMetaMaskInstalled()) return

    // 检查是否已经连接
    window.ethereum
      .request({ method: 'eth_accounts' })
      .then((accounts) => {
        if (accounts.length > 0) {
          const provider = new BrowserProvider(window.ethereum)
          setProvider(provider)
          setAccount(accounts[0])
        }
      })
      .catch(console.error)
  }, [])

  return {
    account,
    provider,
    isConnecting,
    error,
    isConnected: !!account,
    connectWallet,
    disconnectWallet,
    formatAddress,
    isMetaMaskInstalled: isMetaMaskInstalled()
  }
}
