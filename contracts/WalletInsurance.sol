// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title CollateralInsurance Smart Contract
 * @author Adeola David Adelakun
 * @notice This contract implements an insurance service that offers users up to 3 varieties of insurance policies in a 
 * WalletInsurance.sol smart contract. Users can choose one of the 3 packages namely Regular, Robust, and Comprehensive, 
 * all provided in a custom data type (enum InsurancePackage). 
 * The packages require users to pay an insurance amount of 1000wei, 10000wei and 100000wei respectively, every 28 days. 
 * The contract also recognizes an admin (the insurance company) to whose address all insurance amounts are paid. 
 * This admin gets to approve that a user be able to claim up to 2 times the total amount they have ever paid as premium, 
 * in a case that they raise a claim as a result of compromise to their insured wallet. The admin judges this and may approve 
 * or decline user claims.
 */

contract WalletInsurance {
    address payable public verifierCompany;
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
        uint256 totalPayments; 
        bool isActive;
    }

    mapping(address => User) public users;
    mapping(address => ClaimStatus) public claims;

    constructor(address payable _verifierCompany) {
        verifierCompany = _verifierCompany;
    }

    modifier onlyAdmin() {
        require(
            msg.sender == verifierCompany,
            "Only the terms & conditions verifier can perform this action."
        );
        _;
    }

    // Function for users to select an insurance package and make the premium payment
    function selectPackage(InsurancePackage _package) external payable {
        require(
            _package >= InsurancePackage.Regular && _package <= InsurancePackage.Comprehensive,
            "Invalid insurance package selected."
        );
        require(
            !users[msg.sender].isActive,
            "User already has an active insurance package."
        );

        User storage user = users[msg.sender];
        user.package = _package;
        user.isActive = true;
        user.lastPaymentTimestamp = block.timestamp;

        // Set the premium amount based on the selected insurance package
        if (_package == InsurancePackage.Regular) {
            user.premiumAmount = regularPremium;
        } else if (_package == InsurancePackage.Robust) {
            user.premiumAmount = robustPremium;
        } else if (_package == InsurancePackage.Comprehensive) {
            user.premiumAmount = comprehensivePremium;
        }

        // Transfer premium amount to the verifier company
        require(
            msg.value >= user.premiumAmount,
            "Insufficient premium amount."
        );
        (bool success, ) = verifierCompany.call{value: msg.value}("");
        require(success, "Premium transfer failed.");
    }
    

    // Function for users to submit a claim for their insured wallet
    function submitClaim() external {
        require(
            users[msg.sender].isActive,
            "User does not have an active insurance package."
        );
        require(
            claims[msg.sender] == ClaimStatus.Pending,
            "Claim has already been submitted or processed."
        );
        claims[msg.sender] = ClaimStatus.Pending;
    }

    // Function for the admin to approve a user's claim and transfer the claim payout
    function approveClaim(address _user) external onlyAdmin {
        require(
            users[_user].isActive,
            "User does not have an active insurance package."
        );
        require(
            claims[_user] == ClaimStatus.Pending,
            "No pending claim for this user."
        );

        claims[_user] = ClaimStatus.Approved;
        uint256 claimPayout = users[_user].totalPayments * 2; // Payout value is twice the total payments made by the user
        (bool success, ) = _user.call{value: claimPayout}("");
        require(success, "Claim payout failed.");
    }

    // Function for the admin to reject a user's claim
    function rejectClaim(address _user) external onlyAdmin {
        require(
            users[_user].isActive,
            "User does not have an active insurance package."
        );
        require(
            claims[_user] == ClaimStatus.Pending,
            "No pending claim for this user."
        );

        claims[_user] = ClaimStatus.Rejected;
    }

    // Function for users to cancel their insurance package
    function cancelInsurance() external {
        require(
            users[msg.sender].isActive,
            "User does not have an active insurance package."
        );

        users[msg.sender].isActive = false;
    }

    // Function for users to pay their premium to the verifier company
    function payPremiumToVerifier() external payable {
        User storage user = users[msg.sender];
        require(
            user.isActive,
            "User does not have an active insurance package"
        );

        uint256 elapsedTime = block.timestamp - user.lastPaymentTimestamp;
        uint256 missedPayments = elapsedTime / paymentInterval;
        uint256 paymentDue = user.lastPaymentTimestamp + (missedPayments * paymentInterval);

        require(
            block.timestamp >= paymentDue,
            "Premium payment is not yet due"
        );

        // Calculate the number of premiums due
        uint256 premiumsDue = missedPayments + 1;

        // Calculate the total premium amount due
        uint256 totalPremiumAmountDue = premiumsDue * user.premiumAmount;

        // Update last payment timestamp and total payments made by the user
        user.lastPaymentTimestamp = paymentDue;
        user.totalPayments += premiumsDue;

        // Transfer premium amount to the verifier company
        require(
            msg.value >= totalPremiumAmountDue,
            "Insufficient premium amount"
        );
        (bool success, ) = verifierCompany.call{value: totalPremiumAmountDue}("");
        require(success, "Premium transfer failed");
    }
}
