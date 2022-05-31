// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../../validation/CrowdsaleTime.sol";

contract CrowdsaleTimeMock is CrowdsaleTime {
    function setOpeningTime(uint256 openingTime) external {
        _setOpeningTime(openingTime);
    }

    function setClosingTime(uint256 closingTime) external {
        _setClosingTime(closingTime);
    }

    function isOpenByTime() external view returns (bool) {
        return _isOpenByTime();
    }

    function isFinishedByTime() external view returns (bool) {
        return _isFinishedByTime();
    }
}
