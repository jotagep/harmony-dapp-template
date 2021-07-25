import { expect } from 'chai';
import { ethers } from 'hardhat';
import { Money } from '../types/Money';

describe('Money', function () {
	it("Should return the money stored once it's changed", async function () {
		const Money = await ethers.getContractFactory('Money');
		const money = (await Money.deploy()) as Money;
		await money.deployed();

		ethers.utils.parseEther('150');
		const initialMoney = await money.getMoneyStored();

		expect(ethers.utils.formatEther(initialMoney)).to.equal('0.0');
		const moneyToAdd = ethers.utils.parseEther('150');
		const addMoneyTx = await money.addMoney({
			value: moneyToAdd,
		});

		// wait until the transaction is mined
		await addMoneyTx.wait();
		const finalMoney = await money.getMoneyStored();
		expect(ethers.utils.formatEther(finalMoney)).to.equal('150.0');
	});
});
