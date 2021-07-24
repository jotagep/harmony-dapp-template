#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Pytest config file. All functions here get ran before collecting all tests and executing them.
"""
import time

from pyhmy import (
    util,
)
from pyhmy.rpc.request import (
    base_request
)

from txs import (
    tx_timeout,
    endpoints,
    initial_funding,
    ganache_accounts_funding,
    get_transaction
)
from utils import (
    is_valid_json_rpc,
)

def send_transactions_and_confirm(txs):
    for tx in txs:
        print(f'Funding {tx["to"]} with {tx["amount"]}')
        response = base_request('hmy_sendRawTransaction', params=[tx["signed-raw-tx"]],
                                endpoint=endpoints[tx["from-shard"]])
        assert is_valid_json_rpc(response), f"Invalid JSON response: {response}"
        # Do not check for errors since resending initial txs is fine & failed txs will be caught in confirm timeout.

    assert is_valid_json_rpc(response), f"Invalid JSON response: {response}"
    # Confirm all txs within 2x timeout window (since all initial txs could be in 2 blocks).
    start_time = time.time()
    while time.time() - start_time <= 2.5 * tx_timeout:
        sent_txs = []
        for tx in initial_funding:
            tx_response = get_transaction(tx["hash"], tx["from-shard"])
            sent_txs.append(tx_response is not None)
        if all(sent_txs):
            return
    raise AssertionError("Could not confirm initial transactions on-chain.")

def initialize():
    """
    Initialize testing accounts for Ganache.
    Will block until transactions are confirmed on-chain.
    """
    assert util.is_active_shard(endpoints[0], delay_tolerance=20), "Shard 0 is not making progress..."
    #assert util.is_active_shard(endpoints[1], delay_tolerance=20), "Shard 1 is not making progress..."

    # Send all txs. Note that this is the only place to break the txs invariant.
    send_transactions_and_confirm(initial_funding)
    send_transactions_and_confirm(ganache_accounts_funding)

initialize()