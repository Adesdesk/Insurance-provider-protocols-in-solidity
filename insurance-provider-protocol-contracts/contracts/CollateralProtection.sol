// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract CollateralProtection {
    address public escrowAddress;  // Address that can update the collateral status
    uint256 public constant MAX_LOAN_AMOUNT = 2 ether;  // Maximum loan amount
    
    mapping(address => bool) public whitelist;  // Stores the whitelist status of users
    mapping(address => uint256) public lastPaymentTimestamp;  // Stores the timestamp of last payment
    
    uint256 public regularInsuranceAmount = 0.005 ether;  // Insurance amount for the regular plan
    uint256 public comprehensiveInsuranceAmount = 0.010 ether;  // Insurance amount for the comprehensive plan
    
    uint256 public constant INSURANCE_PERIOD = 28 days;  // Insurance payment period
    uint256 public constant QUALIFICATION_PERIOD = 168 days;  // Qualification period for whitelisting
    uint256 public constant DEFAULT_PERIOD = 3 days;  // Default period for delisting
    
    bool public totalLoss;  // Flag indicating the total loss of collateral
    bool public dropInValue;  // Flag indicating a drop in collateral value
    
    uint256 public loanAmount;  // Current loan amount
    
    event Whitelisted(address indexed user);
    event Delisted(address indexed user);
    
    constructor(address _escrowAddress) {
        escrowAddress = _escrowAddress;
    }
    
    // Function to pay the insurance amount
    function payInsurance() external payable {
        require(isWhitelisted(msg.sender), "User is not whitelisted");
        require(msg.value == regularInsuranceAmount || msg.value == comprehensiveInsuranceAmount, "Invalid insurance amount");
        
        lastPaymentTimestamp[msg.sender] = block.timestamp;
        
        // If payment is made for 168 days continuously, user gets whitelisted
        if (block.timestamp - lastPaymentTimestamp[msg.sender] >= QUALIFICATION_PERIOD) {
            whitelist[msg.sender] = true;
            emit Whitelisted(msg.sender);
        }
    }
    
    // Function for the escrow address to update the collateral status
    function updateCollateralStatus(bool _totalLoss, bool _dropInValue) external {
        require(msg.sender == escrowAddress, "Only the escrow address can call this function");
        
        totalLoss = _totalLoss;
        dropInValue = _dropInValue;
        
        if (totalLoss && whitelist[msg.sender]) {
            // If total loss and user is whitelisted, pay back entire loan amount
            if (loanAmount > 0 && loanAmount <= MAX_LOAN_AMOUNT) {
                payable(msg.sender).transfer(loanAmount);
                loanAmount = 0;
            }
        } else if (dropInValue && whitelist[msg.sender]) {
            // If drop in value and user is whitelisted, pay back 50% of loan amount
            if (loanAmount > 0 && loanAmount <= MAX_LOAN_AMOUNT) {
                payable(msg.sender).transfer(loanAmount / 2);
                loanAmount = 0;
            }
        }
    }
    
    // Function to delist a user if they default in payment
    function delistUser(address user) external {
        require(isWhitelisted(user), "User is not whitelisted");
        require(block.timestamp - lastPaymentTimestamp[user] > DEFAULT_PERIOD, "User has not defaulted");
        
        whitelist[user] = false;
        emit Delisted(user);
    }
    
    // Function to check if a user is whitelisted
    function isWhitelisted(address user) public view returns (bool) {
        return whitelist[user];
    }
}
