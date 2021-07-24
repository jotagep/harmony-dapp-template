#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Stores all the transaction information used in the test suite.

INVARIANT: Each account only sends 1 plain transaction (per shard) except for initial transaction(s).
"""
import functools
import json
import time
import random

from pyhmy import (
    account,
    blockchain
)
from pyhmy.rpc.request import (
    base_request
)

from utils import (
    check_and_unpack_rpc_response,
    is_valid_json_rpc
)

tx_timeout = 20  # In seconds
beacon_shard_id = 0
_is_cross_shard_era = False
_is_staking_era = False

# Endpoints sorted by shard
endpoints = [
    "http://localhost:9599/",  # shard 0
    "http://localhost:9598/",  # shard 1
]

# ORDER MATERS: tx n cannot be sent without tx n-1 being sent first due to nonce
# Only exception on invariant.
initial_funding = [
    {
        # Used by: `account_test_tx`
        "from": "one1zksj3evekayy90xt4psrz8h6j2v3hla4qwz4ur",
        "to": "one1v92y4v2x4q27vzydf8zq62zu9g0jl6z0lx2c8q",
        # scissors matter runway reduce flush illegal ancient absurd scare young copper ticket direct wise person hobby tomato chest edge cost wine crucial vendor elevator
        "amount": "100000",
        "from-shard": 0,
        "to-shard": 0,
        "hash": "0x5718a2fda967f051611ccfaf2230dc544c9bdd388f5759a42b2fb0847fc8d759",
        "nonce": "0x0",
        "signed-raw-tx": "0xf86f80843b9aca0082520880809461544ab146a815e6088d49c40d285c2a1f2fe84f8a152d02c7e14af68000008028a076b6130bc018cedb9f8891343fd8982e0d7f923d57ea5250b8bfec9129d4ae22a00fbc01c988d72235b4c71b21ce033d4fc5f82c96710b84685de0578cff075a0a",
    }
]

ganache_accounts_funding = [
    {
        "from": "one1v92y4v2x4q27vzydf8zq62zu9g0jl6z0lx2c8q",
        "to": "one1ax072u4nllu5z2f965dasqluwassy5kvjc36zr",
        "amount": "100",
        "from-shard": 0,
        "to-shard": 0,
        "hash": "0x9b0a5729a91009027e90a725b716a1459e03759829213c0c35eedd6a20fdfd7f",
        "nonce": "0x0",
        "signed-raw-tx": "0xf86e80843b9aca00825208808094e99fe572b3fff9412925d51bd803fc77610252cc89056bc75e2d631000008027a0d584534b64e113f3a847d60ae3bfa79190b6560c64b4446b30afc57afee668d3a0478eb10f344a7f2d82f0d0086da6f4411af2b81df0c499bbf38cd135b0b3e7ec"
    },
    {
        "from": "one1v92y4v2x4q27vzydf8zq62zu9g0jl6z0lx2c8q",
        "to": "one1ynkr6c3jc724htljta4hm9wvuxpgxyulf3mg2j",
        "amount": "100",
        "from-shard": 0,
        "to-shard": 0,
        "hash": "0xc970df8d775d9b8244b68728df462cc74a14df8a2e38cb51b2ab6ac647106666",
        "nonce": "0x1",
        "signed-raw-tx": "0xf86e01843b9aca0082520880809424ec3d6232c7955baff25f6b7d95cce18283139f89056bc75e2d631000008027a0644cf7b92348b26373affe6ca5535666f0a58fc20a90abdb510fb45f53c1f8d9a071fdcea11a543697de23ac730f9510f8292c5dfd815ade920aa7ed32e05dc478"
    },
    {
        "from": "one1v92y4v2x4q27vzydf8zq62zu9g0jl6z0lx2c8q",
        "to": "one18xl6vf4qpcf9lxn3e0j5694xcrv93jwl93j74u",
        "amount": "100",
        "from-shard": 0,
        "to-shard": 0,
        "hash": "0xc970df8d775d9b8244b68728df462cc74a14df8a2e38cb51b2ab6ac647106666",
        "nonce": "0x2",
        "signed-raw-tx": "0xf86e02843b9aca0082520880809439bfa626a00e125f9a71cbe54d16a6c0d858c9df89056bc75e2d631000008027a016eeee2c6da0160f705cb97a7a3251b07d434f18fb4153e5fa3e867b485fe47ea068abdd34ca56ddd071ec9883bee46b5968b5482324e9eb29c7e07e80d49648b6"
    },
    {
        "from": "one1v92y4v2x4q27vzydf8zq62zu9g0jl6z0lx2c8q",
        "to": "one1rsup4xsrh9k6v6pjr2jmutpj8hnrcg22dxvgpt",
        "amount": "100",
        "from-shard": 0,
        "to-shard": 0,
        "hash": "0x1f3bc1683dc6a38b810f8a21a51511107bee47fa8c1a1bb35c27ec5bba6e9be9",
        "nonce": "0x3",
        "signed-raw-tx": "0xf86e03843b9aca008252088080941c381a9a03b96da668321aa5be2c323de63c214a89056bc75e2d631000008028a0508dd95d3abde963f8dadd99a9a2ebbe5e173d0ba7ff068d84e87a506715a894a0582e9ab76af9ad7bc858b8fe7614d15b5b932158178d03d473e919051d3f4890"
    },
    {
        "from": "one1v92y4v2x4q27vzydf8zq62zu9g0jl6z0lx2c8q",
        "to": "one1705zuq02my9xgrwce8a020yve9fgj83m56wxpq",
        "amount": "100",
        "from-shard": 0,
        "to-shard": 0,
        "hash": "0x14cdc372918403b87b92da37e98b9712bbdfafdd55556f1a146b5617f22dc5b3",
        "nonce": "0x4",
        "signed-raw-tx": "0xf86d04843b9aca00825208808094f3e82e01ead90a640dd8c9faf53c8cc952891e3b89056bc75e2d631000008028a016f987c083676f309d3af4d4b36f06ea4fa0f76ddfc1614a419224605bdf3af79f17af6db347b19644c14ecc4ebf104d85e56eec0551777245283c4310ea5475"
    },
    {
        "from": "one1v92y4v2x4q27vzydf8zq62zu9g0jl6z0lx2c8q",
        "to": "one1u9fytdmjn24a8atfpltassunfq9jducedmxam2",
        "amount": "100",
        "from-shard": 0,
        "to-shard": 0,
        "hash": "0xe89b9898df1a33622aca6073ad35c528c2f77a9b994459d49ec9f4e656b2ae49",
        "nonce": "0x5",
        "signed-raw-tx": "0xf86e05843b9aca00825208808094e15245b7729aabd3f5690fd7d84393480b26f31989056bc75e2d631000008028a0dc620a5f76d5621d7aafcbfe6222702ee1bd98c1248c5bf0f79acc73576d7988a0280dd586fa4e6d944a5b1bf156532a54282e09ab2cd7da8c0de7beee54d9c9ac"
    },
    {
        "from": "one1v92y4v2x4q27vzydf8zq62zu9g0jl6z0lx2c8q",
        "to": "one1f6373nd4ymxgrszhz2mluakghgnhm7g8ltq2w8",
        "amount": "100",
        "from-shard": 0,
        "to-shard": 0,
        "hash": "0xa306156bfdc5b00991563afb8a5d91b346e32259e0e2ce03bff3d0d030ae7c05",
        "nonce": "0x6",
        "signed-raw-tx": "0xf86e06843b9aca008252088080944ea3e8cdb526cc81c05712b7fe76c8ba277df90789056bc75e2d631000008028a03caba913440a645dfbae55bbf2958980ad780d429d59f72a06579d7218726b30a068caf12c9b51a95189c040fb12f310ce1bd539f9c8925dd8da2d72a7c4e43cac"
    },
    {
        "from": "one1v92y4v2x4q27vzydf8zq62zu9g0jl6z0lx2c8q",
        "to": "one1nuy5t8qmz0ksklal9fa53urz3jc2yzwdp6xaks",
        "amount": "100",
        "from-shard": 0,
        "to-shard": 0,
        "hash": "0x1919e6420ab53f90caebe55c6d6c19cafc7788decdaaa618a1f6615c1cb69b1a",
        "nonce": "0x7",
        "signed-raw-tx": "0xf86e07843b9aca008252088080949f09459c1b13ed0b7fbf2a7b48f0628cb0a209cd89056bc75e2d631000008028a0f2ff1920367d3c668d5c9e39b4b05376a761cb197149c606d39704107788e789a04ecb6b58eb53ef59583927552eb8ae6971d8d568fcced0042179a6e8452e41f6"
    },
    {
        "from": "one1v92y4v2x4q27vzydf8zq62zu9g0jl6z0lx2c8q",
        "to": "one1tlj2520ulz7as4ynyj7rhftlwd8wjfhpnxh8l6",
        "amount": "100",
        "from-shard": 0,
        "to-shard": 0,
        "hash": "0x729ab6c65819c4652b736ba1d4f2271acc86453a666effaa8eaee92ab0b029c0",
        "nonce": "0x8",
        "signed-raw-tx": "0xf86e08843b9aca008252088080945fe4aa29fcf8bdd8549324bc3ba57f734ee926e189056bc75e2d631000008027a00bcfb79d7e6048f23a6f3ef532c19c31660ea1033fff23fc728c87326efb2f5ba0074ff73b73fa324b484e4f717d101dc411abd0306c2d36ab9d7c35b7fad83efe"
    },
    {
        "from": "one1v92y4v2x4q27vzydf8zq62zu9g0jl6z0lx2c8q",
        "to": "one12rzgrlwrquf97kc8ttx9udcsj4mw0d9an4c7a9",
        "amount": "100",
        "from-shard": 0,
        "to-shard": 0,
        "hash": "0xd928fb584c6d6dad223e11259d0210b35993d3c13df69205f593bb8b28c0bfea",
        "nonce": "0x9",
        "signed-raw-tx": "0xf86e09843b9aca0082520880809450c481fdc307125f5b075acc5e37109576e7b4bd89056bc75e2d631000008027a0b854f01c18054ca8e5472a3e8c7e318c0f2926a9294dda5172441655d65078dda01b630aaa67b709d30f0b975c760b5b5abc675f306d0e2345025fc9bea9c3a4bd"
    }
]

def is_cross_shard_era():
    """
    Returns if the network is in cross shard tx era...
    """
    global _is_cross_shard_era
    if _is_cross_shard_era:
        return True
    time.sleep(random.uniform(0.5, 1.5))  # Random to stop burst spam of RPC calls.
    if all(blockchain.get_current_epoch(e) >= 1 for e in endpoints):
        _is_cross_shard_era = True
        return True
    return False


def cross_shard(fn):
    """
    Decorator for tests that requires a cross shard transaction
    """

    @functools.wraps(fn)
    def wrap(*args, **kwargs):
        while not is_cross_shard_era():
            pass
        return fn(*args, **kwargs)

    return wrap


def is_staking_era():
    """
    Returns if the network is in staking era...
    """
    global _is_staking_era
    if _is_staking_era:
        return True
    time.sleep(random.uniform(0.5, 1.5))  # Random to stop burst spam of RPC calls.
    threshold_epoch = blockchain.get_prestaking_epoch(endpoints[beacon_shard_id])
    if all(blockchain.get_current_epoch(e) >= threshold_epoch for e in endpoints):
        _is_staking_era = True
    return False


def staking(fn):
    """
    Decorator for tests that requires staking epoch
    """

    @functools.wraps(fn)
    def wrap(*args, **kwargs):
        while not is_staking_era():
            pass
        return fn(*args, **kwargs)

    return wrap


def send_transaction(tx_data, confirm_submission=False):
    """
    Send the given transaction (`tx_data`), and check that it got submitted
    to tx pool if `confirm_submission` is enabled.

    Node that tx_data follow the format of one of the entries in `initial_funding`
    """
    assert isinstance(tx_data, dict), f"Sanity check: expected tx_data to be of type dict not {type(tx_data)}"
    for el in ["from", "from-shard", "signed-raw-tx", "hash"]:
        assert el in tx_data.keys(), f"Expected {el} as a key in {json.dumps(tx_data, indent=2)}"

    # Validate tx sender
    assert_valid_test_from_address(tx_data["from"], tx_data["from-shard"], is_staking=False)

    # Send tx
    response = base_request('hmy_sendRawTransaction', params=[tx_data["signed-raw-tx"]],
                            endpoint=endpoints[tx_data["from-shard"]])
    if confirm_submission:
        tx_hash = check_and_unpack_rpc_response(response, expect_error=False)
        assert tx_hash == tx_data["hash"], f"Expected submitted transaction to get tx hash of {tx_data['hash']}, " \
                                           f"got {tx_hash}"
    else:
        assert is_valid_json_rpc(response), f"Invalid JSON response: {response}"


def send_staking_transaction(tx_data, confirm_submission=False):
    """
    Send the given staking transaction (`tx_data`), and check that it got submitted
    to tx pool if `confirm_submission` is enabled.

    Node that tx_data follow the format of one of the entries in `initial_funding`
    """
    assert isinstance(tx_data, dict), f"Sanity check: expected tx_data to be of type dict not {type(tx_data)}"
    for el in ["signed-raw-tx", "hash"]:
        assert el in tx_data.keys(), f"Expected {el} as a key in {json.dumps(tx_data, indent=2)}"

    # Send tx
    response = base_request('hmy_sendRawStakingTransaction', params=[tx_data["signed-raw-tx"]],
                            endpoint=endpoints[0])
    if confirm_submission:
        tx_hash = check_and_unpack_rpc_response(response, expect_error=False)
        assert tx_hash == tx_data["hash"], f"Expected submitted staking transaction to get tx hash " \
                                           f"of {tx_data['hash']}, got {tx_hash}"
    else:
        assert is_valid_json_rpc(response), f"Invalid JSON response: {response}"


def send_and_confirm_transaction(tx_data, timeout=tx_timeout):
    """
    Send and confirm the given transaction (`tx_data`) within the given `timeout`.

    Node that tx_data follow the format of one of the entries in `initial_funding`.

    Note that errored tx submission will not return an error early, instead, failed transactions will be
    caught by timeout. This is done because it is possible to submit the same transaction multiple times,
    thus causing the RPC to return an error, causing unwanted errors in tests that are ran in parallel.
    """
    assert isinstance(tx_data, dict), f"Sanity check: expected tx_data to be of type dict not {type(tx_data)}"
    for el in ["from-shard", "hash"]:
        assert el in tx_data.keys(), f"Expected {el} as a key in {json.dumps(tx_data, indent=2)}"

    send_transaction(tx_data, confirm_submission=False)
    # Do not check for errors since resending initial txs is fine & failed txs will be caught in confirm timeout.

    # Confirm tx within timeout window
    start_time = time.time()
    while time.time() - start_time <= timeout:
        tx_response = get_transaction(tx_data["hash"], tx_data["from-shard"])
        if tx_response is not None:
            return tx_response
        time.sleep(random.uniform(0.2, 0.5))  # Random to stop burst spam of RPC calls.
    raise AssertionError("Could not confirm transactions on-chain.")


def send_and_confirm_staking_transaction(tx_data, timeout=tx_timeout * 2):
    """
    Send and confirm the given staking transaction (`tx_data`) within the given `timeout`.

    Node that tx_data follow the format of one of the entries in `initial_funding`.

    Note that errored tx submission will not return an error early, instead, failed transactions will be
    caught by timeout. This is done because it is possible to submit the same transaction multiple times,
    thus causing the RPC to return an error, causing unwanted errors in tests that are ran in parallel.
    """
    assert isinstance(tx_data, dict), f"Sanity check: expected tx_data to be of type dict not {type(tx_data)}"
    for el in ["hash"]:
        assert el in tx_data.keys(), f"Expected {el} as a key in {json.dumps(tx_data, indent=2)}"

    send_staking_transaction(tx_data, confirm_submission=False)
    # Do not check for errors since resending initial txs is fine & failed txs will be caught in confirm timeout.

    # Confirm tx within timeout window
    start_time = time.time()
    while time.time() - start_time <= timeout:
        tx_response = get_staking_transaction(tx_data["hash"])
        if tx_response is not None:
            return tx_response
        time.sleep(random.uniform(0.2, 0.5))  # Random to stop burst spam of RPC calls.
    raise AssertionError("Could not confirm staking transaction on-chain.")


def get_transaction(tx_hash, shard):
    """
    Fetch the transaction for the given hash on the given shard.
    It also checks that the RPC response is valid.
    """
    assert isinstance(tx_hash, str), f"Sanity check: expect tx hash to be of type str not {type(tx_hash)}"
    assert isinstance(shard, int), f"Sanity check: expect shard to be of type int not {type(shard)}"
    raw_response = base_request('hmy_getTransactionByHash', params=[tx_hash], endpoint=endpoints[shard])
    return check_and_unpack_rpc_response(raw_response, expect_error=False)


def get_staking_transaction(tx_hash):
    """
    Fetch the staking transaction for the given hash on the given shard.
    It also checks that the RPC response is valid.
    """
    assert isinstance(tx_hash, str), f"Sanity check: expect tx hash to be of type str not {type(tx_hash)}"
    raw_response = base_request('hmy_getStakingTransactionByHash', params=[tx_hash], endpoint=endpoints[0])
    return check_and_unpack_rpc_response(raw_response, expect_error=False)


def assert_valid_test_from_address(address, shard, is_staking=False):
    """
    Asserts that the given address is a valid 'from' address for a test transaction.

    Note that this considers the invariant for transactions.
    """
    assert isinstance(address, str), f"Sanity check: Expect address {address} as a string."
    assert isinstance(shard, int), f"Sanity check: Expect shard {shard} as am int."
    assert isinstance(is_staking, bool), f"Sanity check: Expect is_staking {is_staking} as a bool."
    assert account.is_valid_address(address), f"{address} is an invalid ONE address"
    if not account.get_balance(address, endpoint=endpoints[shard]) >= 1e18:
        raise AssertionError(f"Account {address} does not have at least 1 ONE on shard {shard}")
    if not is_staking and account.get_transaction_count(address, endpoint=endpoints[shard]) != 0:
        raise AssertionError(f"Account {address} has already sent a transaction, breaking the txs invariant")
