#!/usr/bin/env bash
yarn install
yarn localnet:build
yarn localnet:start
yarn deploy:watch