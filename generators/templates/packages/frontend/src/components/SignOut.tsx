import React from 'react';
import styled from 'styled-components';
import { useWeb3React } from '@web3-react/core';

export interface Props {
	account: string | null | undefined;
	closeModal: () => void;
}

const SignOut = ({ account, closeModal }: Props) => {
	const { deactivate } = useWeb3React();

	const handleClick = () => {
		deactivate();
		closeModal();
	};

	return (
		<SignOutComponent>
			<p>You are connected:</p>
			<span>{account}</span>
			<SignOutBtn onClick={handleClick}>Sign out</SignOutBtn>
		</SignOutComponent>
	);
};

const SignOutComponent = styled.div`
	display: flex;
	align-items: center;
	padding: 20px 40px;
	justify-content: space-around;
	flex-direction: column;
	overflow: hidden;
	height: 25vh;

	& p {
		margin: 0;
		font-size: 1.5rem;
	}

	& span {
		font-size: 1.5rem;
		color: #4c7909;
	}
`;

const SignOutBtn = styled.div`
	margin-top: 20px;
	padding: 10px 30px;
	border-radius: 10px;
	background-color: rgb(248, 80, 80);
	color: white;
	cursor: pointer;
`;

export default SignOut;
