// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "./VestingVaultBase.sol";

contract VestingVaultAccessControl is VestingVaultBase, AccessControlEnumerable {
    bytes32 public constant CONFIG_ROLE = keccak256("CONFIG_ROLE");
    bytes32 public constant BENEFICIARY_MANAGE_ROLE = keccak256("BENEFICIARY_MANAGE_ROLE");

    constructor(address token) VestingVaultBase() {
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _setupRole(CONFIG_ROLE, _msgSender());

        // Meta information
        _setToken(token);
        _setZeroDate(block.timestamp);
    }

    function setZeroDate(uint256 zeroDate) external onlyRole(CONFIG_ROLE) {
        _setZeroDate(zeroDate);
    }

    function setVestingInfo(
        uint256[] memory vestingPortionsUnlockTime,
        uint256[] memory vestingPercentPerPortion,
        uint256 vestingPercentPrecision
    ) external onlyRole(CONFIG_ROLE) {
        _setVestingInfo(vestingPortionsUnlockTime, vestingPercentPerPortion, vestingPercentPrecision);
    }

    function changeStatus(Status newStatus) external onlyRole(CONFIG_ROLE) {
        _changeStatus(newStatus);
    }

    function addBeneficiary(address beneficiary, uint256 amount) external onlyRole(BENEFICIARY_MANAGE_ROLE) {
        _addBeneficiary(beneficiary, amount);
    }

    function removeBeneficiary(address beneficiary) external onlyRole(BENEFICIARY_MANAGE_ROLE) {
        _removeBeneficiary(beneficiary);
    }

    function claim(uint256[] calldata portionIds) external {
        _claimMultiPortions(portionIds);
    }
}
