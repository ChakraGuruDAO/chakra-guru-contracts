// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../CrowdsaleMeta.sol";

contract CrowdsaleMetaMock is CrowdsaleMeta {
    function setSaleToken(address saleToken) external {
        _setSaleToken(saleToken);
    }

    function setRaiseToken(address raiseToken) external {
        _setRaiseToken(raiseToken);
    }

    function setRate(uint256 rate) external {
        _setRate(rate);
    }
}
