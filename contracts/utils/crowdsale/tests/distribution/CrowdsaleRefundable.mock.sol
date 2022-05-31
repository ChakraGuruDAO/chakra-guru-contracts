// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../../distribution/CrowdsaleRefundable.sol";

abstract contract CrowdsaleRefundableMock is CrowdsaleRefundable {
    bool private __hasFinished = false;
    bool private __goalReached = false;

    function canRefundable() external view returns (bool) {
        return _canRefundable();
    }

    function _hasFinished() internal view override returns (bool) {
        return __hasFinished;
    }

    function _goalReached() internal view override returns (bool) {
        return __goalReached;
    }

    function withdrawFunds() external nonReentrant {
        _withdrawFunds();
    }

    function setFinished(bool hasFinished) external {
        __hasFinished = hasFinished;
    }

    function setGoalReached(bool goalReached) external {
        __goalReached = goalReached;
    }
}
