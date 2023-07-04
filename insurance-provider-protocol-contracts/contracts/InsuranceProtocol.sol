// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract InsuranceProtocol {
    address public contractOwner;
    uint256 constant private regularPremium = 1000;
    uint256 constant private robustPremium = 10000;
    uint256 constant private comprehensivePremium = 100000;
    uint256 constant private paymentInterval = 28 days;

    enum InsurancePackage {Regular, Robust, Comprehensive}
    enum ClaimStatus {Pending, Approved, Rejected}

    struct User {
        InsurancePackage package;
        uint256 premiumAmount;
        uint256 lastPaymentTimestamp;
        uint256 totalPayments; // New field to store the total payments made by the user
        bool isActive;
    }

    mapping(address => User) public users;
    mapping(address => ClaimStatus) public claims;

    constructor() {
        contractOwner = tx.origin; // prevent the owner address from changing with various deployers
    }

    modifier onlyContractOwner() {
        require(msg.sender == contractOwner, "Only the contract owner can perform this action.");
        _;
    }

    function selectPackage(InsurancePackage _package) external payable {
        require(_package >= InsurancePackage.Regular && _package <= InsurancePackage.Comprehensive, "Invalid insurance package selected.");
        require(!users[msg.sender].isActive, "User already has an active insurance package.");

        User storage user = users[msg.sender];
        user.package = _package;
        user.isActive = true;
        user.lastPaymentTimestamp = block.timestamp;

        if (_package == InsurancePackage.Regular) {
            user.premiumAmount = regularPremium;
        } else if (_package == InsurancePackage.Robust) {
            user.premiumAmount = robustPremium;
        } else if (_package == InsurancePackage.Comprehensive) {
            user.premiumAmount = comprehensivePremium;
        }

        // Transfer premium amount to the contract owner
        require(msg.value >= user.premiumAmount, "Insufficient premium amount.");
        (bool success, ) = contractOwner.call{value: msg.value}("");
        require(success, "Premium transfer failed.");
    }

    function submitClaim() external {
        require(users[msg.sender].isActive, "User does not have an active insurance package.");
        require(claims[msg.sender] == ClaimStatus.Pending, "Claim has already been submitted or processed.");
        claims[msg.sender] = ClaimStatus.Pending;
    }

    function approveClaim(address _user) external onlyContractOwner {
        require(users[_user].isActive, "User does not have an active insurance package.");
        require(claims[_user] == ClaimStatus.Pending, "No pending claim for this user.");

        claims[_user] = ClaimStatus.Approved;
        uint256 claimPayout = users[_user].totalPayments * 2; // Payout value is twice the total payments made by the user
        (bool success, ) = _user.call{value: claimPayout}("");
        require(success, "Claim payout failed.");
    }


    function rejectClaim(address _user) external onlyContractOwner {
        require(users[_user].isActive, "User does not have an active insurance package.");
        require(claims[_user] == ClaimStatus.Pending, "No pending claim for this user.");

        claims[_user] = ClaimStatus.Rejected;
    }

    function cancelInsurance() external {
        require(users[msg.sender].isActive, "User does not have an active insurance package.");

        users[msg.sender].isActive = false;
    }


    function payPremiumToOwner() external payable {
        User storage user = users[msg.sender];
        require(user.isActive, "User does not have an active insurance package.");
        
        uint256 elapsedTime = block.timestamp - user.lastPaymentTimestamp;
        uint256 missedPayments = elapsedTime / paymentInterval;
        uint256 paymentDue = user.lastPaymentTimestamp + (missedPayments * paymentInterval);
        
        require(block.timestamp >= paymentDue, "Premium payment is not yet due.");
        
        // Calculate the number of premiums due
        uint256 premiumsDue = missedPayments + 1;
        
        // Calculate the total premium amount due
        uint256 totalPremiumAmountDue = premiumsDue * user.premiumAmount;
        
        // Update last payment timestamp and total payments made by the user
        user.lastPaymentTimestamp = paymentDue;
        user.totalPayments += premiumsDue;
        
        // Transfer premium amount to the contract owner
        require(msg.value >= totalPremiumAmountDue, "Insufficient premium amount.");
        (bool success, ) = contractOwner.call{value: totalPremiumAmountDue}("");
        require(success, "Premium transfer failed.");
    }
}
