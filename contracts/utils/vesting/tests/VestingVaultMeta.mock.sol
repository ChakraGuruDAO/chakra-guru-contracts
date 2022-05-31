// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../VestingVaultMeta.sol";

contract VestingVaultMetaMock is VestingVaultMeta {
    bool public changeStatusToBeneficiaryCalled = false;
    bool public changeStatusToClaimCalled = false;

    function setToken(address token) external {
        _setToken(token);
    }

    function setZeroDate(uint256 zeroDate) external {
        _setZeroDate(zeroDate);
    }

    function setVestingInfo(
        uint256[] memory vestingPortionsUnlockTime,
        uint256[] memory vestingPercentPerPortion,
        uint256 vestingPercentPrecision
    ) external {
        _setVestingInfo(vestingPortionsUnlockTime, vestingPercentPerPortion, vestingPercentPrecision);
    }

    function changeStatus(Status newStatus) external {
        _changeStatus(newStatus);
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
