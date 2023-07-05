const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('CollateralInsurance', function () {
    let collateralInsurance;
    let owner;
    let user0;
    let user1;

    // Constants for premium and collateral values
    const CATEGORY_A_PREMIUM = ethers.utils.parseEther('0.1'); // 0.1 ether
    const CATEGORY_B_PREMIUM = ethers.utils.parseEther('0.01'); // 0.01 ether
    const CATEGORY_A_COLLATERAL = ethers.utils.parseEther('2.5'); // 2.5 ether
    const CATEGORY_B_COLLATERAL = ethers.utils.parseEther('1.5'); // 1.5 ether

    beforeEach(async function () {
        [owner, user0, user1] = await ethers.getSigners();
        const CollateralInsurance = await ethers.getContractFactory('CollateralInsurance');
        collateralInsurance = await CollateralInsurance.deploy(owner.address);
        await collateralInsurance.deployed();
    });

    describe('Deployment', function () {
        it('Should set the correct verifierCompany', async function () {
            expect(await collateralInsurance.verifierCompany()).to.equal(owner.address);
        });
    });

    describe('setCollateralValue', function () {
        it('Should set collateral value for a user', async function () {
            await collateralInsurance.connect(user0).setCollateralValue(CATEGORY_A_COLLATERAL);
            expect(await collateralInsurance.users(user0.address)).to.deep.include({
                collateralAmount: CATEGORY_A_COLLATERAL,
                hasDropped: false,
                isApproved: false,
                lastPaymentTimestamp: 0,
            });
        });

        it('Should not set collateral value exceeding the limit', async function () {
            await expect(collateralInsurance.connect(user0).setCollateralValue(CATEGORY_A_COLLATERAL + 1)).to.be.revertedWith('Collateral value exceeds the limit');
        });
    });

    describe('setCollateralStatus', function () {
        beforeEach(async function () {
            await collateralInsurance.connect(user0).setCollateralValue(CATEGORY_A_COLLATERAL);
        });

        it('Should set collateral status for a user', async function () {
            await collateralInsurance.connect(user0).setCollateralStatus(true);
            expect(await collateralInsurance.users(user0.address)).to.deep.include({ hasDropped: true, isApproved: false });
        });

        it('Should require collateral value to be set', async function () {
            await expect(collateralInsurance.connect(user1).setCollateralStatus(true)).to.be.revertedWith('No collateral value set');
        });
    });

    describe('payPremiumCategoryA', function () {
        beforeEach(async function () {
            await collateralInsurance.connect(user0).setCollateralValue(CATEGORY_A_COLLATERAL);
        });

        it('Should allow Category A user to pay premium', async function () {
            await expect(collateralInsurance.connect(user0).payPremiumCategoryA({ value: CATEGORY_A_PREMIUM })).to.not.be.reverted;
        });

        it('Should not allow Category B user to pay premium', async function () {
            await expect(collateralInsurance.connect(user0).payPremiumCategoryB({ value: CATEGORY_B_PREMIUM })).to.be.revertedWith('Collateral value is within the limit for Category A');
        });

        it('Should not allow payment below the premium amount', async function () {
            await expect(collateralInsurance.connect(user0).payPremiumCategoryA({value: CATEGORY_A_PREMIUM.sub(ethers.utils.parseEther('0.01')) })).to.be.revertedWith('Incorrect premium amount');
        });

        it('Should update the last payment timestamp', async function () {
            const initialTimestamp = await ethers.provider.getBlock('latest').timestamp;
            await collateralInsurance.connect(user0).payPremiumCategoryA({ value: CATEGORY_A_PREMIUM });
            const updatedTimestamp = await collateralInsurance.users(user0.address).lastPaymentTimestamp;
            expect(updatedTimestamp).to.be.gt(initialTimestamp);
        });

        it('Should transfer premium amount to the verifierCompany', async function () {
            const initialBalance = await ethers.provider.getBalance(owner.address);
            await collateralInsurance.connect(user0).payPremiumCategoryA({ value: CATEGORY_A_PREMIUM });
            const finalBalance = await ethers.provider.getBalance(owner.address);
            expect(finalBalance).to.equal(initialBalance.add(CATEGORY_A_PREMIUM));
        });
    });

    describe('payPremiumCategoryB', function () {
        beforeEach(async function () {
            await collateralInsurance.connect(user1).setCollateralValue(CATEGORY_B_COLLATERAL);
        });

        it('Should allow Category B user to pay premium', async function () {
            await expect(collateralInsurance.connect(user1).payPremiumCategoryB({ value: CATEGORY_B_PREMIUM })).to.not.be.reverted;
        });

        it('Should not allow Category A user to pay premium', async function () {
            await expect(collateralInsurance.connect(user1).payPremiumCategoryA({ value: CATEGORY_A_PREMIUM })).to.be.revertedWith('Collateral value exceeds the limit for Category A');
        });

        it('Should not allow payment below the premium amount', async function () {
            await expect(collateralInsurance.connect(user1).payPremiumCategoryB({ value: CATEGORY_B_PREMIUM.sub(ethers.utils.parseEther('0.001')) })).to.be.revertedWith('Incorrect premium amount');
        });

        it('Should update the last payment timestamp', async function () {
            const initialTimestamp = await ethers.provider.getBlock('latest').timestamp;
            await collateralInsurance.connect(user1).payPremiumCategoryB({ value: CATEGORY_B_PREMIUM });
            const updatedTimestamp = await collateralInsurance.users(user1.address).lastPaymentTimestamp;
            expect(updatedTimestamp).to.be.gt(initialTimestamp);
        });

        it('Should transfer premium amount to the verifierCompany', async function () {
            const initialBalance = await ethers.provider.getBalance(owner.address);
            await collateralInsurance.connect(user1).payPremiumCategoryB({ value: CATEGORY_B_PREMIUM });
            const finalBalance = await ethers.provider.getBalance(owner.address);
            expect(finalBalance).to.equal(initialBalance.add(CATEGORY_B_PREMIUM));
        });
    });

    describe('approveCollateral', function () {
        beforeEach(async function () {
            await collateralInsurance.connect(user0).setCollateralValue(CATEGORY_A_COLLATERAL);
            await collateralInsurance.connect(owner).approveCollateral(user0.address, true);
        });

        it('Should approve the collateral value', async function () {
            expect(await collateralInsurance.users(user0.address)).to.deep.include({ isApproved: true });
        });

        it('Should transfer the collateral amount to the user when approved', async function () {
            const initialBalance = await ethers.provider.getBalance(user0.address);
            await collateralInsurance.connect(owner).approveCollateral(user0.address, true);
            const finalBalance = await ethers.provider.getBalance(user0.address);
            expect(finalBalance).to.equal(initialBalance.add(CATEGORY_A_COLLATERAL));
        });

        it('Should not transfer the collateral amount when not approved', async function () {
            const initialBalance = await ethers.provider.getBalance(user0.address);
            await collateralInsurance.connect(owner).approveCollateral(user0.address, false);
            const finalBalance = await ethers.provider.getBalance(user0.address);
            expect(finalBalance).to.equal(initialBalance);
        });

        it('Should require collateral value to be set', async function () {
            await expect(collateralInsurance.connect(owner).approveCollateral(user1.address, true)).to.be.revertedWith('No collateral value set');
        });
    });
});
