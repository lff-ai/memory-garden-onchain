// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @title Memory Garden - 链上记忆花园（自动回响 + 防重入 + 可提现）
/// @notice
///  - 用户随时可以献花：一次交易传入花朵数量 + 支付金额(msg.value)
///  - 若金额达到最小门槛，则按比例给当前用户一笔“回响奖励”
///  - 献花过小只记入统计，不发回响（避免 0 wei 奖励）
///  - owner 可以随时提取合约余额，不会锁死资金
contract MemoryGarden {
    address public owner;

    /// @dev 最小触发自动回响的献花金额
    uint256 public constant MIN_OFFER_VALUE = 0.0001 ether;

    /// @dev 回响比例（万分比）：1000 = 10%，1500 = 15%
    uint256 public constant REWARD_BPS = 1000; // 10%

    // 全局统计
    uint256 public totalFlowers; // 所有用户总献花朵数
    uint256 public totalValue; // 合约收到的总金额（wei）
    uint256 public totalRewardPaid; // 合约累计发出的回响总额

    // 用户维度统计
    mapping(address => uint256) public userFlowers; // 每个地址累计献花朵数
    mapping(address => uint256) public userValue; // 每个地址累计支付金额
    mapping(address => uint256) public userReward; // 每个地址累计获得的回响奖励

    /// @dev 防重入锁
    bool private _locked;

    /// @dev 每次献花事件（前端展示用）
    event FlowerSent(
        address indexed sender,
        uint256 flowers,
        uint256 value,
        uint256 reward,
        uint256 timestamp
    );

    event Withdraw(address indexed operator, uint256 amount);
    event Funded(address indexed from, uint256 amount);
    event OwnershipTransferred(
        address indexed oldOwner,
        address indexed newOwner
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    modifier nonReentrant() {
        require(!_locked, "Reentrancy");
        _locked = true;
        _;
        _locked = false;
    }

    constructor() {
        owner = msg.sender;
        emit OwnershipTransferred(address(0), msg.sender);
    }

    /// @notice 一次献花（花朵数量和金额都由前端传入）
    /// @param flowers 本次献花朵数（> 0）
    /// @dev
    ///  - 用户一次交易表达“献 N 朵花 + 支付 X 金额”
    ///  - 如果 msg.value >= MIN_OFFER_VALUE，则按 REWARD_BPS 比例计算回响金额
    ///  - 如果 msg.value 太小，则不回响，只做统计 & 事件
    function offer(uint256 flowers) external payable nonReentrant {
        require(flowers > 0, "flowers must > 0");
        require(msg.value > 0, "No value sent");

        // 1. 先记账（统计）
        userFlowers[msg.sender] += flowers;
        userValue[msg.sender] += msg.value;

        totalFlowers += flowers;
        totalValue += msg.value;

        uint256 reward = 0;

        // 2. 计算并尝试发放自动回响
        if (msg.value >= MIN_OFFER_VALUE && REWARD_BPS > 0) {
            reward = (msg.value * REWARD_BPS) / 10000; // 按万分比计算

            // 过小奖励直接视为 0，不发
            if (reward > 0) {
                uint256 balance = address(this).balance;
                // 理论上 reward <= msg.value + 之前余额，这里再兜底
                if (reward <= balance) {
                    userReward[msg.sender] += reward;
                    totalRewardPaid += reward;

                    (bool ok, ) = payable(msg.sender).call{value: reward}("");
                    require(ok, "Reward transfer failed");
                } else {
                    // 奖励资金不足：不发奖励，但不让整笔交易回滚
                    reward = 0;
                }
            }
        }

        emit FlowerSent(
            msg.sender,
            flowers,
            msg.value,
            reward,
            block.timestamp
        );
    }

    /// @notice 主办方给合约充值（作为回响奖励池）
    function fund() external payable {
        require(msg.value > 0, "No value");
        emit Funded(msg.sender, msg.value);
    }

    /// @notice 合约允许接收裸转账（直接转账到合约地址）
    receive() external payable {
        emit Funded(msg.sender, msg.value);
    }

    /// @notice 主办方提取指定金额（不会锁死合约余额）
    function withdraw(uint256 amount) external onlyOwner nonReentrant {
        require(amount <= address(this).balance, "Insufficient balance");
        (bool ok, ) = payable(owner).call{value: amount}("");
        require(ok, "Withdraw failed");
        emit Withdraw(msg.sender, amount);
    }

    /// @notice 主办方提取全部余额
    function withdrawAll() external onlyOwner nonReentrant {
        uint256 amount = address(this).balance;
        require(amount > 0, "No balance");
        (bool ok, ) = payable(owner).call{value: amount}("");
        require(ok, "Withdraw failed");
        emit Withdraw(msg.sender, amount);
    }

    /// @notice 修改 owner，方便迁移/交接
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Zero addr");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
}
