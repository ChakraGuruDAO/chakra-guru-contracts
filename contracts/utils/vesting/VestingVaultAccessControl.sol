// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "./VestingVaultBase.sol";

contract VestingVaultAccessControl is VestingVaultBase, AccessControlEnumerable {
    bytes32 public constant CONFIG_ROLE = keccak256("CONFIG_ROLE");
    bytes32 public constant BENEFICIARY_MANAGE_ROLE = keccak256("BENEFICIARY_MANAGE_ROLE");

    constructor() VestingVaultBase() {
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _setupRole(CONFIG_ROLE, _msgSender());
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
