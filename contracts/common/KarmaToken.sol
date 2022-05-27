// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @custom:security-contact berish.ceo@gmail.com
contract KarmaToken is ERC20 {
    constructor() ERC20("Chakra Guru DAO - KARMA Token", "KARMA") {
        _mint(msg.sender, 1000000000 * 10**decimals());
    }
}
