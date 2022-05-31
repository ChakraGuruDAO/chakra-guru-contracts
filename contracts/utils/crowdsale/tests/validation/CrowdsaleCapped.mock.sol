// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../../validation/CrowdsaleCapped.sol";

contract CrowdsaleCappedMock is CrowdsaleCapped {
    function setMinSaleCap(uint256 minSaleCap) external {
        _setMinSaleCap(minSaleCap);
    }

    function setMaxSaleCap(uint256 maxSaleCap) external {
        _setMaxSaleCap(maxSaleCap);
    }

    function setRaiseWallet(address raiseWallet) public {
        _setRaiseWallet(raiseWallet);
    }

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
