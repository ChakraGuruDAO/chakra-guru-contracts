// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../utils/vesting/UserVestingVault.sol";

contract KarmaPrivateSaleVestingVault is UserVestingVault {
    constructor(address karmaToken) {
        setToken(karmaToken);
        setZeroDate(block.timestamp);
    }
}

// [0, 2592000, 5184000, 7776000, 10368000, 12960000, 15552000, 18144000, 20736000, 23328000, 25920000, 28512000, 31104000, 33696000, 36288000, 38880000]
// [1000, 0, 0, 0, 750, 750, 750, 750, 750, 750, 750, 750, 750, 750, 750, 750]
// 10000

// zero - 1656666000
