// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../../distribution/CrowdsalePostDelivery.sol";

contract CrowdsalePostDeliveryMock is CrowdsalePostDelivery {
    function setVestingVault(address vestingVault) external {
        _setVestingVault(vestingVault);
    }

    function getBeneficiaryAmount(address beneficiary) external view returns (uint256) {
        return _getBeneficiaryAmount(beneficiary);
    }
}
