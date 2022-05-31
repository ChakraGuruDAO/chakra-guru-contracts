// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../../validation/CrowdsaleLimitter.sol";

contract CrowdsaleLimitterMock is CrowdsaleLimitter {
    function setMinSaleLimit(uint256 minSaleLimit) external {
        _setMinSaleLimit(minSaleLimit);
    }

    function setMaxSaleLimit(uint256 maxSaleLimit) external {
        _setMaxSaleLimit(maxSaleLimit);
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
