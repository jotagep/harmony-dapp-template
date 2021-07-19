#!/usr/bin/env bash
echo 'Localnet is loading...'
grep --max-count=12 'Funding' <(docker logs -f harmony-localnet)
grep -q 'Initialization of localnet completed' <(docker logs -f harmony-localnet)