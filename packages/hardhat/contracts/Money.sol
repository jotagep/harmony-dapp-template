//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract Money {
	uint256 moneyStored = 0;

	function addMoney() public payable {
		moneyStored += msg.value;
	}

	function getMoneyStored() public view returns (uint256) {
		return moneyStored;
	}
}
