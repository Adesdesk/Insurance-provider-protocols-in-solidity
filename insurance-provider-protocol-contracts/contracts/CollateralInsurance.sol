// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract CollateralInsurance {
    address public owner;
    uint256 public constant CATEGORY_A_PREMIUM = 100000;
    uint256 public constant CATEGORY_B_PREMIUM = 10000;
    uint256 public constant PAYMENT_INTERVAL = 28 days;
    uint256 public constant TOTAL_PAYMENT_PERIOD = 280 days;
    uint256 public constant CATEGORY_A_MAX_COLLATERAL = 2 ether;
    uint256 public constant CATEGORY_B_MAX_COLLATERAL = 4 ether;

    struct User {
        uint256 collateralAmount;
        bool hasDropped;
        bool isApproved;
        uint256 lastPaymentTimestamp;
    }

    mapping(address => User) public users;

    constructor() {
        owner = tx.origin;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can call this function");
        _;
    }

    // Function to allow users to set their collateral value and whether it has dropped
    function setCollateralValue(bool hasDropped) external payable {
        require(msg.value <= getCategoryMaxCollateral(), "Collateral value exceeds the limit");

        users[msg.sender].collateralAmount = msg.value;
        users[msg.sender].hasDropped = hasDropped;
        users[msg.sender].isApproved = false;
    }

    // Function for Category A users to pay the premium every 28 days
    function payPremiumCategoryA() external payable {
        require(users[msg.sender].collateralAmount > 0, "No collateral value set");
        require(users[msg.sender].collateralAmount <= CATEGORY_A_MAX_COLLATERAL, "Collateral value exceeds the limit");
        require(!users[msg.sender].hasDropped, "Collateral value has dropped");

        uint256 currentPaymentPeriod = (block.timestamp - users[msg.sender].lastPaymentTimestamp) / PAYMENT_INTERVAL;
        require(currentPaymentPeriod < TOTAL_PAYMENT_PERIOD / PAYMENT_INTERVAL, "Payment period expired");

        uint256 premiumAmount = CATEGORY_A_PREMIUM * (currentPaymentPeriod + 1);
        require(msg.value >= premiumAmount, "Insufficient premium payment");

        users[msg.sender].lastPaymentTimestamp = block.timestamp;

        if (currentPaymentPeriod == (TOTAL_PAYMENT_PERIOD / PAYMENT_INTERVAL) - 1) {
            uint256 refundAmount = msg.value - premiumAmount;
            if (refundAmount > 0) {
                payable(msg.sender).transfer(refundAmount);
            }
        }
    }

    // Function for Category B users to pay the premium every 28 days
    function payPremiumCategoryB() external payable {
        require(users[msg.sender].collateralAmount > 0, "No collateral value set");
        require(users[msg.sender].collateralAmount <= CATEGORY_B_MAX_COLLATERAL, "Collateral value exceeds the limit");
        require(!users[msg.sender].hasDropped, "Collateral value has dropped");

        uint256 currentPaymentPeriod = (block.timestamp - users[msg.sender].lastPaymentTimestamp) / PAYMENT_INTERVAL;
        require(currentPaymentPeriod < TOTAL_PAYMENT_PERIOD / PAYMENT_INTERVAL, "Payment period expired");

        uint256 premiumAmount = CATEGORY_B_PREMIUM * (currentPaymentPeriod + 1);
        require(msg.value >= premiumAmount, "Insufficient premium payment");

        users[msg.sender].lastPaymentTimestamp = block.timestamp;

        if (currentPaymentPeriod == (TOTAL_PAYMENT_PERIOD / PAYMENT_INTERVAL) - 1) {
            uint256 refundAmount = msg.value - premiumAmount;
            if (refundAmount > 0) {
                payable(msg.sender).transfer(refundAmount);
            }
        }
    }

    // Function for the contract owner to approve or decline a user's collateral value
    function approveCollateral(address userAddress, bool isApproved) external onlyOwner {
        require(users[userAddress].collateralAmount > 0, "No collateral value set");

        users[userAddress].isApproved = isApproved;

        if (isApproved) {
            payable(userAddress).transfer(users[userAddress].collateralAmount);
        }
    }

    // Function to get the maximum collateral value allowed for the user's category
    function getCategoryMaxCollateral() private view returns (uint256) {
        if (users[msg.sender].collateralAmount == 0) {
            return CATEGORY_A_MAX_COLLATERAL; // Default to Category A for users who have not set their collateral value yet
        }
        if (users[msg.sender].collateralAmount <= CATEGORY_A_MAX_COLLATERAL) {
            return CATEGORY_A_MAX_COLLATERAL;
        } else {
            return CATEGORY_B_MAX_COLLATERAL;
        }
    }
}
