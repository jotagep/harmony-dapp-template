//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract Donation {
    uint256 donationStored = 0;

    function addDonation() public payable {
        donationStored += msg.value;
    }

    function getDonationStored() public view returns (uint256) {
        return donationStored;
    }
}
