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

    function _setVestingInfo(
        uint256[] memory vestingPortionsUnlockTime,
        uint256[] memory vestingPercentPerPortion,
        uint256 vestingPercentPrecision
    ) internal virtual override onlyRole(CONFIG_ROLE) {
        super._setVestingInfo(vestingPortionsUnlockTime, vestingPercentPerPortion, vestingPercentPrecision);
    }

    function _setZeroDate(uint256 zeroDate) internal virtual override onlyRole(CONFIG_ROLE) {
        super._setZeroDate(zeroDate);
    }

    function _setToken(address token) internal virtual override onlyRole(CONFIG_ROLE) {
        super._setToken(token);
    }

    function _changeStatus(Status newStatus) internal virtual override onlyRole(CONFIG_ROLE) {
        super._changeStatus(newStatus);
    }

    function _addBeneficiary(address beneficiary, uint256 amount) internal virtual override onlyRole(BENEFICIARY_MANAGE_ROLE) {
        super._addBeneficiary(beneficiary, amount);
    }

    function _removeBeneficiary(address beneficiary) internal virtual override onlyRole(BENEFICIARY_MANAGE_ROLE) {
        super._removeBeneficiary(beneficiary);
    }
}
