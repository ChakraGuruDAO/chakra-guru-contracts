// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IVestingVault {
    function getBeneficiary(address beneficiary) external view returns (uint256 amount, bool[] memory isPortionWithdraw);

    function addBeneficiary(address beneficiary, uint256 amount) external;

    function removeBeneficiary(address beneficiary) external;

    function claim(uint256[] calldata portionIds) external;
}
