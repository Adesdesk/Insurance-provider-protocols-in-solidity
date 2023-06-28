// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract InsuranceProtocol {
    address public admin;
    uint256 public regularPremium = 0.005 ether;
    uint256 public mediumPremium = 0.010 ether;
    uint256 public comprehensivePremium = 0.015 ether;
    uint256 public regularWhitelistDays = 252;
    uint256 public mediumWhitelistDays = 168;
    uint256 public comprehensiveWhitelistDays = 126;
    
    struct Policy {
        address walletOwner;
        uint256 premiumPaid;
        uint256 lastPaymentTimestamp;
    }
    
    mapping(address => Policy) public policies;
    mapping(address => uint256) public whitelistTimers;
    mapping(address => bool) public whitelistedAddresses;
    uint256 public commonPoolBalance;
    
    event PolicyCreated(address indexed walletOwner, uint256 premiumPaid);
    event WhitelistUpdated(address indexed walletOwner, bool whitelisted);
    event Withdrawal(address indexed walletOwner, uint256 amount);
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only the admin can call this function");
        _;
    }
    
    constructor() {
        admin = msg.sender;
    }
    
    function createPolicy(uint256 _premiumPaid) external payable {
        require(_premiumPaid == regularPremium || _premiumPaid == mediumPremium || _premiumPaid == comprehensivePremium, "Invalid premium amount");
        require(policies[msg.sender].walletOwner == address(0), "Policy already exists");
        
        Policy memory newPolicy = Policy(msg.sender, _premiumPaid, block.timestamp);
        policies[msg.sender] = newPolicy;
        
        commonPoolBalance += msg.value;
        
        emit PolicyCreated(msg.sender, _premiumPaid);
    }
    
    function updateWhitelist(address _walletOwner) internal {
        require(policies[_walletOwner].walletOwner != address(0), "Policy does not exist");
        
        if (policies[_walletOwner].premiumPaid == regularPremium) {
            whitelistTimers[_walletOwner] += 28 days;
            if (whitelistTimers[_walletOwner] >= regularWhitelistDays) {
                whitelistedAddresses[_walletOwner] = true;
                emit WhitelistUpdated(_walletOwner, true);
            }
        } else if (policies[_walletOwner].premiumPaid == mediumPremium) {
            whitelistTimers[_walletOwner] += 28 days;
            if (whitelistTimers[_walletOwner] >= mediumWhitelistDays) {
                whitelistedAddresses[_walletOwner] = true;
                emit WhitelistUpdated(_walletOwner, true);
            }
        } else if (policies[_walletOwner].premiumPaid == comprehensivePremium) {
            whitelistTimers[_walletOwner] += 28 days;
            if (whitelistTimers[_walletOwner] >= comprehensiveWhitelistDays) {
                whitelistedAddresses[_walletOwner] = true;
                emit WhitelistUpdated(_walletOwner, true);
            }
        }
    }

    function checkPremiumDue() external {
        Policy storage policy = policies[msg.sender];
        require(policy.walletOwner != address(0), "Policy does not exist");
        
        uint256 premiumDueTimestamp = policy.lastPaymentTimestamp + 28 days;
        require(block.timestamp >= premiumDueTimestamp, "Premium payment is not due yet");
        
        uint256 daysOverdue = (block.timestamp - premiumDueTimestamp) / 1 days;
        uint256 premiumPaid = policy.premiumPaid;
        
        uint256 whitelistDuration;
        if (premiumPaid == regularPremium) {
            whitelistDuration = regularWhitelistDays;
        } else if (premiumPaid == mediumPremium) {
            whitelistDuration = mediumWhitelistDays;
        } else if (premiumPaid == comprehensivePremium) {
            whitelistDuration = comprehensiveWhitelistDays;
        }
        
        if (daysOverdue >= whitelistDuration) {
            if (daysOverdue >= whitelistDuration + 3) {
                whitelistedAddresses[msg.sender] = false;
                whitelistTimers[msg.sender] = 0;
                emit WhitelistUpdated(msg.sender, false);
            } else {
                whitelistTimers[msg.sender] += (daysOverdue / 28) * 28 days;
                if (whitelistTimers[msg.sender] >= whitelistDuration) {
                    whitelistedAddresses[msg.sender] = true;
                    emit WhitelistUpdated(msg.sender, true);
                }
            }
        }
        
        // Reset the last payment timestamp to the current timestamp
        policy.lastPaymentTimestamp = block.timestamp;
    }
    
    function makeClaim(uint256 _amount) external {
        require(whitelistedAddresses[msg.sender], "Address is not whitelisted");
        require(_amount <= commonPoolBalance, "Insufficient balance in the common pool");
        
        commonPoolBalance -= _amount;
        payable(msg.sender).transfer(_amount);
        
        emit Withdrawal(msg.sender, _amount);
    }
    
    function withdrawFromCommonPool(uint256 _amount) external onlyAdmin {
        require(_amount <= commonPoolBalance, "Insufficient balance in the common pool");
        
        commonPoolBalance -= _amount;
        payable(admin).transfer(_amount);
        
        emit Withdrawal(admin, _amount);
    }
    
    function getPolicyDetails(address _walletOwner) external view returns (address, uint256, uint256) {
        Policy memory policy = policies[_walletOwner];
        return (policy.walletOwner, policy.premiumPaid, policy.lastPaymentTimestamp);
    }
}
