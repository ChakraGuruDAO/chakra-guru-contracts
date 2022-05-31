// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../../../vesting/VestingVaultAccessControl.sol";
import "../../distribution/CrowdsalePostDelivery.sol";

contract CrowdsalePostDeliveryMock is CrowdsalePostDelivery {
    function setVestingVault(address vestingVault) external {
        _setVestingVault(vestingVault);
    }

    function getBeneficiaryAmount(address beneficiary) external view returns (uint256) {
        return _getBeneficiaryAmount(beneficiary);
    }

    function setRaiseWallet(address raiseWallet) public {
        _setRaiseWallet(raiseWallet);
    }

    function setSaleToken(address saleToken) external {
        _setSaleToken(saleToken);
    }

    function setRaiseToken(address raiseToken) external {
        _setRaiseToken(raiseToken);
    }

    function setRate(uint256 rate) external {
        _setRate(rate);
    }
}

contract CrowdsalePostDeliveryVestingVaultMock is VestingVaultAccessControl {
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

    function addBeneficiary(address beneficiary, uint256 amount) external virtual {
        _addBeneficiary(beneficiary, amount);
    }

    function removeBeneficiary(address beneficiary) external virtual {
        _removeBeneficiary(beneficiary);
    }

    function claim(uint256[] calldata portionIds) external {
        _claimMultiPortions(portionIds);
    }

    function changeStatus(Status newStatus) external {
        _changeStatus(newStatus);
    }
}
