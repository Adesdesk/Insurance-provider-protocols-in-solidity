// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract InsuranceProtocol {
    address public admin;
    uint256 public regularPremium = 100000 wei;
    uint256 public mediumPremium = 1000000 wei;
    uint256 public comprehensivePremium = 10000000 wei;
    uint256 public regularWhitelistDays = 84;
    uint256 public mediumWhitelistDays = 56;
    uint256 public comprehensiveWhitelistDays = 28;

    struct Policy {
        address walletOwner;
        uint256 premiumPaid;
        uint256 lastPaymentTimestamp;
    }

    mapping(address => Policy) public policies;
    mapping(address => uint256) public whitelistAmounts;  // Amount the whitelisted address can withdraw
    mapping(address => bool) public whitelistedAddresses;
    uint256 public commonPoolBalance;

    event PolicyCreated(address indexed walletOwner, uint256 premiumPaid);
    event WhitelistUpdated(address indexed walletOwner, bool whitelisted);
    event Withdrawal(address indexed walletOwner, uint256 amount);
    event PaymentMade(address indexed walletOwner, uint256 premiumPaid);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only the admin can call this function");
        _;
    }

    constructor(address _admin) {
        admin = _admin;
    }

    function createPolicy(uint256 _premiumPaid) external payable {
        require(
            _premiumPaid == regularPremium ||
            _premiumPaid == mediumPremium ||
            _premiumPaid == comprehensivePremium,
            "Invalid premium amount"
        );
        require(
            policies[msg.sender].walletOwner == address(0),
            "Policy already exists"
        );

        Policy memory newPolicy = Policy(
            msg.sender,
            _premiumPaid,
            block.timestamp
        );
        policies[msg.sender] = newPolicy;

        commonPoolBalance += msg.value;

        emit PolicyCreated(msg.sender, _premiumPaid);
    }

    function makePayment() external payable {
        Policy storage policy = policies[msg.sender];
        require(policy.walletOwner != address(0), "Policy does not exist");

        uint256 premiumDueTimestamp = policy.lastPaymentTimestamp + 28 days;
        require(
            block.timestamp >= premiumDueTimestamp,
            "Payment is not due yet"
        );

        uint256 premiumPaid = policy.premiumPaid;
        require(msg.value == premiumPaid, "Incorrect payment amount");

        commonPoolBalance += msg.value;
        policy.lastPaymentTimestamp = block.timestamp;

        emit PaymentMade(msg.sender, msg.value);
    }

    function makeClaim(uint256 _amount) external {
        require(whitelistedAddresses[msg.sender], "Address is not whitelisted");
        require(
            _amount <= whitelistAmounts[msg.sender],
            "Exceeds the allowed withdrawal amount"
        );
        require(
            _amount <= commonPoolBalance,
            "Insufficient balance in the common pool"
        );

        commonPoolBalance -= _amount;
        whitelistAmounts[msg.sender] -= _amount;
        payable(msg.sender).transfer(_amount);

        emit Withdrawal(msg.sender, _amount);
    }

    function withdrawFromCommonPool(uint256 _amount) external onlyAdmin {
        require(
            _amount <= commonPoolBalance,
            "Insufficient balance in the common pool"
        );

        commonPoolBalance -= _amount;
        payable(admin).transfer(_amount);

        emit Withdrawal(admin, _amount);
    }

    function getPolicyDetails(
        address _walletOwner
    ) external view returns (address, uint256, uint256) {
        Policy memory policy = policies[_walletOwner];
        return (
            policy.walletOwner,
            policy.premiumPaid,
            policy.lastPaymentTimestamp
        );
    }

    function whitelistAddress(address _user, uint256 _amount) external onlyAdmin {
        require(policies[_user].walletOwner != address(0), "Policy does not exist");

        whitelistedAddresses[_user] = true;
        whitelistAmounts[_user] = _amount;

        emit WhitelistUpdated(_user, true);
    }

    function updateWhitelist(address _user, bool _whitelisted) external onlyAdmin {
        require(policies[_user].walletOwner != address(0), "Policy does not exist");

        whitelistedAddresses[_user] = _whitelisted;

        emit WhitelistUpdated(_user, _whitelisted);
    }
}
