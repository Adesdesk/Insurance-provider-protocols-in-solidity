// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract CollateralInsurance {
    address payable public verifierCompany;
    uint256 public constant CATEGORY_A_PREMIUM = 100000 wei;
    uint256 public constant CATEGORY_B_PREMIUM = 10000 wei;
    uint256 public constant PAYMENT_INTERVAL = 28 days;
    uint256 public constant CATEGORY_A_MAX_COLLATERAL = 3 ether;
    uint256 public constant CATEGORY_B_MAX_COLLATERAL = 2 ether;

    struct User {
        uint256 collateralAmount;
        bool hasDropped;
        bool isApproved;
        uint256 lastPaymentTimestamp;
    }

    mapping(address => User) public users;

    constructor(address payable _verifierCompany) {
        verifierCompany = _verifierCompany;
    }

    modifier onlyAdmin() {
        require(msg.sender == verifierCompany, "Only the contract verifier can call this function");
        _;
    }

    // Function to allow users to set their collateral value and whether it has dropped
    function setCollateralValue(uint256 _collateralAmount) external payable {
        require(_collateralAmount <= getCategoryMaxCollateral(), "Collateral value exceeds the limit");
        users[msg.sender].collateralAmount = _collateralAmount;
    }

    function setCollateralStatus(bool hasDropped) external payable {
        require(users[msg.sender].collateralAmount > 0, "No collateral value set");
        users[msg.sender].hasDropped = hasDropped;
        users[msg.sender].isApproved = false;
    }


    // Function for Category A users to pay the premium every 28 days
    function payPremiumCategoryA() external payable {
        require(users[msg.sender].collateralAmount > 0, "No collateral value set");
        require(users[msg.sender].collateralAmount <= CATEGORY_A_MAX_COLLATERAL, "Collateral value exceeds the limit for Category A");
        require(msg.value >= CATEGORY_A_PREMIUM, "Incorrect premium amount");

        if (users[msg.sender].lastPaymentTimestamp == 0) {
            users[msg.sender].lastPaymentTimestamp = block.timestamp;
        } else {
            require(block.timestamp >= users[msg.sender].lastPaymentTimestamp + PAYMENT_INTERVAL, "Payment interval not reached");
            users[msg.sender].lastPaymentTimestamp = block.timestamp;
        }

        verifierCompany.transfer(msg.value); // Transfer the premium amount to the verifier company
    }

    // Function for Category B users to pay the premium every 28 days
    function payPremiumCategoryB() external payable {
        require(users[msg.sender].collateralAmount > 0, "No collateral value set");
        require(users[msg.sender].collateralAmount <= CATEGORY_B_MAX_COLLATERAL, "Collateral value is within the limit for Category A");

        require(msg.value >= CATEGORY_B_PREMIUM, "Incorrect premium amount");

        if (users[msg.sender].lastPaymentTimestamp == 0) {
            users[msg.sender].lastPaymentTimestamp = block.timestamp;
        } else {
            require(block.timestamp >= users[msg.sender].lastPaymentTimestamp + PAYMENT_INTERVAL, "Payment interval not reached");
            users[msg.sender].lastPaymentTimestamp = block.timestamp;
        }

        verifierCompany.transfer(msg.value); // Transfer the premium amount to the verifier company
    }

    // Function for the contract owner to approve or decline a user's collateral value
    function approveCollateral(address userAddress, bool isApproved) external onlyAdmin {
        require(users[userAddress].collateralAmount > 0, "No collateral valueset");

        users[userAddress].isApproved = isApproved;

        if (isApproved) {
            verifierCompany.transfer(users[userAddress].collateralAmount); // Transfer the collateral amount to the user
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
