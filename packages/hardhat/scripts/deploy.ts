import { ethers } from "hardhat";

async function deploy() {
	const Greeter = await ethers.getContractFactory('Greeter');
	const greeter = await Greeter.deploy('Hello, Hardhat!');

	await greeter.deployed();

	console.log('Greeter deployed to:', greeter.address);
}

deploy()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
