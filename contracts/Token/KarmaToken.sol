// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract KARMAToken is ERC20, ERC20Burnable {
    constructor(uint256 supply) ERC20("KARMA Token", "KARMA") {
        _mint(msg.sender, supply * 10**decimals());
    }
}
