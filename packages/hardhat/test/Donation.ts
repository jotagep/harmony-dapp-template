import { expect } from 'chai';
import { ethers } from 'hardhat';
import { Donation } from '../types/Donation';

describe('Donation', function () {
	it("Should return the donation stored once it's changed", async function () {
		const Donation = await ethers.getContractFactory('Donation');
		const donation = (await Donation.deploy()) as Donation;
		await donation.deployed();

		ethers.utils.parseEther('150');
		const initialDonation = await donation.getDonationStored();

		expect(ethers.utils.formatEther(initialDonation)).to.equal('0.0');
		const donationToAdd = ethers.utils.parseEther('150');
		const addDonationTx = await donation.addDonation({
			value: donationToAdd,
		});

		// wait until the transaction is mined
		await addDonationTx.wait();
		const finalDonation = await donation.getDonationStored();
		expect(ethers.utils.formatEther(finalDonation)).to.equal('150.0');
	});
});
