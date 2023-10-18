#!/bin/bash
source .env
forge create --rpc-url https://rpc.ankr.com/eth_goerli --private-key $PRIVATE_KEY  src/MessageBoard.sol:MessageBoard --etherscan-api-key $API_KEY_ETHERSCAN --verify