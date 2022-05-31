// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../VestingVaultAccessControl.sol";

contract VestingVaultAccessControlMock is VestingVaultAccessControl {
    function setInfo(
        address token,
        uint256 zeroDate,
        uint256[] memory vestingPortionsUnlockTime,
        uint256[] memory vestingPercentPerPortion,
        uint256 vestingPercentPrecision
    ) external {
        _setToken(token);
        _setZeroDate(zeroDate);
        _setVestingInfo(vestingPortionsUnlockTime, vestingPercentPerPortion, vestingPercentPrecision);
    }

    function changeStatus(Status newStatus) external onlyRole(CONFIG_ROLE) {
        _changeStatus(newStatus);
    }
}
