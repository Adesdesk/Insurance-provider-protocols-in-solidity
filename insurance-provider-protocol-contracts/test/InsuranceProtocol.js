const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("InsuranceProtocol", function () {
  let insuranceProtocol;
  let admin;
  let user1;
  let user2;

  beforeEach(async function () {
    [admin, user1, user2] = await ethers.getSigners();

    const InsuranceProtocol = await ethers.getContractFactory("InsuranceProtocol");
    insuranceProtocol = await InsuranceProtocol.deploy(admin.address);
    await insuranceProtocol.deployed();
  });

  it("should allow the admin to create a policy", async function () {
    const premiumPaid = 1000000;
    const value = ethers.utils.parseEther("1");

    await expect(
      insuranceProtocol.connect(user1).createPolicy(premiumPaid, { value: value })
    )
      .to.emit(insuranceProtocol, "PolicyCreated")
      .withArgs(user1.address, premiumPaid);

    const policy = await insuranceProtocol.policies(user1.address);
    expect(policy.walletOwner).to.equal(user1.address);
    expect(policy.premiumPaid).to.equal(premiumPaid);
  });

  it("should not allow creating a policy with an invalid premium amount", async function () {
    const premiumPaid = 123456;

    await expect(
      insuranceProtocol.connect(user1).createPolicy(premiumPaid)
    ).to.be.revertedWith("Invalid premium amount");
  });

  it("should not allow creating a policy if one already exists", async function () {
    const premiumPaid = 1000000;
    const value = ethers.utils.parseEther("1");

    await insuranceProtocol.connect(user1).createPolicy(premiumPaid, { value: value });

    await expect(
      insuranceProtocol.connect(user1).createPolicy(premiumPaid, { value: value })
    ).to.be.revertedWith("Policy already exists");
  });


  it("should return the correct policy details", async function () {
    const premiumPaid = 1000000;
    const value = ethers.utils.parseEther("1");
  
    await insuranceProtocol.connect(user1).createPolicy(premiumPaid, { value: value });
  
    const [walletOwner, premium, lastPaymentTimestamp] = await insuranceProtocol.getPolicyDetails(user1.address);
    expect(walletOwner).to.equal(user1.address);
    expect(premium).to.equal(premiumPaid);
    expect(lastPaymentTimestamp).to.not.equal(0);
  });

  it("should allow policy holders to make premium payments", async function () {
    const premiumPaid = 1000000;
    const value = ethers.utils.parseEther("1");
  
    await insuranceProtocol.connect(user1).createPolicy(premiumPaid, { value: value });
  
    // Increase the time by 29 days to make the payment due
    await ethers.provider.send("evm_increaseTime", [29 * 24 * 60 * 60]);
    await ethers.provider.send("evm_mine");
  
    // Make the premium payment
    await expect(
      insuranceProtocol.connect(user1).makePayment({ value: premiumPaid })
    )
      .to.emit(insuranceProtocol, "PaymentMade")
      .withArgs(user1.address, premiumPaid);
  
    const policy = await insuranceProtocol.policies(user1.address);
    expect(policy.lastPaymentTimestamp).to.not.equal(0);
  });
  
  it("should revert if policy holder tries to make payment before it is due", async function () {
    const premiumPaid = 1000000;
    const value = ethers.utils.parseEther("1");
  
    await insuranceProtocol.connect(user1).createPolicy(premiumPaid, { value: value });
  
    // Try to make the payment before it is due
    await expect(
      insuranceProtocol.connect(user1).makePayment({ value: premiumPaid })
    ).to.be.revertedWith("Payment is not due yet");
  });
  
  it("should revert if policy holder makes incorrect payment amount", async function () {
    const premiumPaid = 1000000;
    const value = ethers.utils.parseEther("1");
  
    await insuranceProtocol.connect(user1).createPolicy(premiumPaid, { value: value });
  
    // Increase the time by 29 days to make the payment due
    await ethers.provider.send("evm_increaseTime", [29 * 24 * 60 * 60]);
    await ethers.provider.send("evm_mine");
  
    // Try to make the payment with an incorrect amount
    await expect(
      insuranceProtocol.connect(user1).makePayment({ value: premiumPaid * 2 })
    ).to.be.revertedWith("Incorrect payment amount");
  });
  
  it("should revert if policy does not exist when making payment", async function () {
    const premiumPaid = 1000000;
  
    // Try to make a payment for a non-existent policy
    await expect(
      insuranceProtocol.connect(user1).makePayment({ value: premiumPaid })
    ).to.be.revertedWith("Policy does not exist");
  });  
  
});
  
