// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

library SetArray {
    struct Set {
        uint256[] values;
        mapping(uint256 => bool) isIn;
        mapping(uint256 => uint256) indexes;
    }

    function addItem(Set storage set, uint256 item) internal {
        if (!hasItem(set, item)) {
            set.indexes[item] = set.values.length;
            set.values.push(item);
            set.isIn[item] = true;
        }
    }

    function hasItem(Set storage set, uint256 item) internal view returns (bool) {
        return set.isIn[item];
    }

    function indexOfItem(Set storage set, uint256 item) internal view returns (uint256) {
        return set.indexes[item];
    }

    function removeItem(Set storage set, uint256 item) internal {
        if (hasItem(set, item)) {
            uint256 index = indexOfItem(set, item);

            for (uint256 i = index; i < set.values.length - 1; i++) {
                set.values[i] = set.values[i + 1];
            }
            set.values.pop();

            set.isIn[item] = false;
            set.indexes[item] = 0;
        }
    }
}
