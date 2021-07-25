import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { useWeb3React } from '@web3-react/core';
import { HarmonyAbstractConnector } from '@harmony-react/abstract-connector';
import { fromWei, Units, Unit } from '@harmony-js/utils';

import { useHarmony } from '../context/harmonyContext';
import Contracts from '../contracts/contracts.json';

const donations = ['1', '5', '10'];

const InfoContract = () => {
	const [contract, setContract] = useState<any>();
	const [moneyStored, setMoneyStored] = useState('0');
	const { account, connector } = useWeb3React();
	const { hmy, fetchBalance } = useHarmony();

	const contractInstance = useMemo(
		() => hmy.contracts.createContract(Contracts.contracts.Money.abi, Contracts.contracts.Money.address),
		[hmy],
	);

	const getMoneyStored = async () => {
		try {
			const money = await contractInstance.methods.getMoneyStored().call();
			const parsedMoney = fromWei(money, Units.one);
			setMoneyStored(parsedMoney);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		getMoneyStored();
	}, []);

	useEffect(() => {
		if (!account) {
			setContract(undefined);
		}
	}, [account]);

	useEffect(() => {
		if (connector && contractInstance) {
			const attachContract = async () => {
				const contractAttached = await (connector as HarmonyAbstractConnector).attachToContract(contractInstance);
				setContract(contractAttached);
			};
			attachContract();
		}
	}, [connector, contractInstance, setContract]);

	const handleClick = (value: string) => async () => {
		if (account) {
			try {
				await contract.methods.addMoney().send({
					from: account,
					gasPrice: 1000000000,
					gasLimit: 210000,
					value: new Unit(value).asOne().toWei(),
				});
				toast.success('Transaction done', {
					onClose: async () => {
						await fetchBalance(account);
						getMoneyStored();
					},
				});
			} catch (error) {
				toast.error(error);
			}
		} else {
			toast.error('Connect your wallet');
		}
	};

	return (
		<InfoContractComponent>
			<Wrapper>
				Total Staked Donations
				<TotalStaked>{moneyStored} ONE</TotalStaked>
			</Wrapper>
			<Subtitle>Your donation:</Subtitle>
			<FlexList>
				{donations.map((value, index) => (
					<Donation key={index} onClick={handleClick(value)}>
						{value} <span>ONE</span>
					</Donation>
				))}
			</FlexList>
		</InfoContractComponent>
	);
};

const InfoContractComponent = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 50%;
`;

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-top: -10vh;
	padding: 40px 60px;
	border-radius: 25px;
	width: 100%;
	background-color: white;
	box-shadow: 2px 8px 10px 4px rgba(0, 0, 0, 0.3);
	color: #a70000;
	font-size: 1.5rem;
`;

const FlexList = styled.ul`
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0;
	list-style: none;
	margin-top: 40px;
	width: 100%;

	& > li {
		margin-right: 20px;
	}
`;

const Subtitle = styled.h2`
	font-size: 2rem;
	color: white;
	margin-bottom: 0;
`;

const Donation = styled.li`
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: rgba(255, 255, 255, 0.7);
	color: black;
	padding: 20px 20px;
	border-radius: 10px;
	box-shadow: 1px 2px 4px 4px rgba(0, 0, 0, 0.2);
	font-size: 1.5rem;
	transition: background-color 0.3s ease;

	&:hover {
		background-color: rgba(255, 255, 255, 1);
		cursor: pointer;
	}

	span {
		font-size: 1rem;
		margin-left: 8px;
		align-self: flex-end;
	}
`;

const TotalStaked = styled.div`
	font-size: 3.5rem;
	margin-top: 16px;
	color: black;
`;

export default InfoContract;
