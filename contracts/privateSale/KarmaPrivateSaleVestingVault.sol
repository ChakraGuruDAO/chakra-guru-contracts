// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../utils/vesting/VestingVaultAccessControl.sol";
import "../utils/vesting/VestingVaultBase.sol";

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

    function setZeroDate(uint256 zeroDate) external {
        _setZeroDate(zeroDate);
    }

    function addBeneficiary(address beneficiary, uint256 amount) external {
        _addBeneficiary(beneficiary, amount);
    }

    function removeBeneficiary(address beneficiary) external {
        _removeBeneficiary(beneficiary);
    }

    function claim(uint256[] calldata portionIds) external {
        _claimMultiPortions(portionIds);
    }

    function changeStatus(Status newStatus) external {
        _changeStatus(newStatus);
    }
}
