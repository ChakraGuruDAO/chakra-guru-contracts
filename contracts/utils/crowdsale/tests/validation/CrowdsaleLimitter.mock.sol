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
}
