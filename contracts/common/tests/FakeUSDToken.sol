// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @custom:security-contact berish.ceo@gmail.com
contract FakeUSDToken is ERC20 {
    constructor() ERC20("FAKE USD", "FUSD") {
        _mint(msg.sender, 1000000 * 10**decimals());
    }
}
