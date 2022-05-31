// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../utils/vesting/VestingVaultAccessControl.sol";

contract KarmaPrivateSaleVestingVault is VestingVaultAccessControl {
    constructor(address karmaToken) VestingVaultAccessControl(karmaToken) {
        // solhint-disable-previous-line no-empty-blocks
    }
}
