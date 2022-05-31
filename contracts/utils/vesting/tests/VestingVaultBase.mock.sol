// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../VestingVaultBase.sol";

contract VestingVaultBaseMock is VestingVaultBase {
    bool public changeStatusToBeneficiaryCalled = false;
    bool public changeStatusToClaimCalled = false;

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

    function changeStatus(Status newStatus) external {
        _changeStatus(newStatus);
    }

    function addBeneficiary(address beneficiary, uint256 amount) external {
        _addBeneficiary(beneficiary, amount);
    }

    function removeBeneficiary(address beneficiary) external {
        _removeBeneficiary(beneficiary);
    }

    function claimMultiPortions(uint256[] calldata portionIds) external {
        _claimMultiPortions(portionIds);
    }

    function _changeStatusToBeneficiary() internal virtual override {
        super._changeStatusToBeneficiary();
        changeStatusToBeneficiaryCalled = true;
    }

    function _changeStatusToClaim() internal virtual override {
        super._changeStatusToClaim();
        changeStatusToClaimCalled = true;
    }
}
