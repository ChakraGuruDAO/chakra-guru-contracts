// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../utils/vesting/VestingVaultAccessControl.sol";

contract KarmaPrivateSaleVestingVault is VestingVaultAccessControl {
    constructor(
        address karmaToken,
        uint256[] memory vestingPortionsUnlockTime,
        uint256[] memory vestingPercentPerPortion,
        uint256 vestingPercentPrecision
    ) VestingVaultAccessControl() {
        _setToken(karmaToken);
        _setZeroDate(block.timestamp);
        _setVestingInfo(vestingPortionsUnlockTime, vestingPercentPerPortion, vestingPercentPrecision);
    }

    function setZeroDate(uint256 zeroDate) external onlyRole(CONFIG_ROLE) {
        _setZeroDate(zeroDate);
    }

    function changeStatus(Status newStatus) external onlyRole(CONFIG_ROLE) {
        _changeStatus(newStatus);
    }
}
