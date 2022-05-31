// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../utils/vesting/VestingVaultAccessControl.sol";
import "../utils/vesting/VestingVaultBase.sol";
import "../utils/vesting/IVestingVault.sol";

contract KarmaPrivateSaleVestingVault is VestingVaultAccessControl, IVestingVault {
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

    function getBeneficiary(address beneficiary) public view override(VestingVaultBase, IVestingVault) returns (uint256 amount, bool[] memory isPortionWithdraw) {
        return super.getBeneficiary(beneficiary);
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
