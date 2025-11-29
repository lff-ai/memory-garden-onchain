import { useState, useEffect } from 'react'
import { Contract, parseEther } from 'ethers'

/**
 * 智能合约交互 Hook
 *
 * 使用说明:
 * 1. 将合约 ABI 放在 src/contracts/abi.json
 * 2. 在 src/contracts/config.js 中配置合约地址
 * 3. 取消下面的注释并导入配置文件
 */

import contractABI from '../contracts/abi.json'
import { CONTRACT_CONFIG } from '../contracts/config'

export const useContract = (provider, account) => {
  const [contract, setContract] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // 初始化合约实例
  useEffect(() => {
    if (!provider || !account) {
      setContract(null)
      return
    }

    const initContract = async () => {
      try {
        const signer = await provider.getSigner()
        const contractInstance = new Contract(
          CONTRACT_CONFIG.address,
          contractABI,
          signer
        )
        setContract(contractInstance)
        console.log('合约初始化成功，地址:', CONTRACT_CONFIG.address)
      } catch (err) {
        console.error('合约初始化失败:', err)
        setError(err.message)
      }
    }

    initContract()
  }, [provider, account])

  /**
   * 发送花束（调用合约 offer）
   * @param {number} flowers - 花束数量（前端计算好的整数）
   * @param {string|number} amount - 支付金额（DEV）
   */
  const leaveMemory = async (flowers, amount) => {
    if (!contract) {
      throw new Error('合约未初始化')
    }

    setIsLoading(true)
    setError(null)

    try {
      // offer(flowers) 并携带 value
      const tx = await contract.offer(flowers, {
        value: parseEther(amount.toString())
      })

      // 等待交易确认
      const receipt = await tx.wait()

      console.log('交易成功:', receipt.hash)
      return receipt
    } catch (err) {
      console.error('交易失败:', err)
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * 获取用户的花束数量
   * @param {string} userAddress - 用户地址
   */
  const getMemories = async (userAddress) => {
    if (!contract) {
      throw new Error('合约未初始化')
    }

    try {
      const memories = await contract.getMemories(userAddress)
      return memories
    } catch (err) {
      console.error('获取记忆列表失败:', err)
      throw err
    }
  }

  return {
    contract,
    isLoading,
    error,
    leaveMemory,
    getMemories
  }
}
