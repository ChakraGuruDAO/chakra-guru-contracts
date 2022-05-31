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
}
