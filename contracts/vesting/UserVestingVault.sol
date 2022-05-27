// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Address.sol";

import "./VestingVault.sol";

abstract contract UserVestingVault is VestingVault {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;
    using Address for address;

    // function _getTotalSumInVault() internal virtual override returns (uint256) {
    //     bool[] memory _empty = new bool[](vestingPortionsUnlockTime.length);

    //     for (uint256 i = 0; i < allUsers.length; i++) {
    //         if (allUsers[i] != address(0)) {
    //             vestingUsersMap[allUsers[i]].isPortionWithdraw = _empty;
    //         }
    //     }

    //     uint256 sumBalance = getBalance();
    //     return sumBalance;
    // }

    function addUser(address user, uint256 amount) public virtual override onlyVaultDisabled onlyOwner {
        if (_addUser(user) > 0) {
            VestingUser memory vestingUser = VestingUser({balance: amount, isPortionWithdraw: new bool[](0)});
            vestingUsersMap[user] = vestingUser;

            emit VaultUserChanged(user, vestingUsersMap[user].balance);
        }
    }

    function removeUser(address user) public virtual override onlyVaultDisabled onlyOwner {
        _removeUser(user);
        delete vestingUsersMap[user];
        emit VaultUserChanged(user, 0);
    }

    function getUsers() public view virtual override returns (address[] memory) {
        return addresses;
    }

    function getBalance() public view virtual override returns (uint256) {
        uint256 sum;
        for (uint256 i = 0; i < addresses.length; i++) {
            if (addresses[i] != address(0)) {
                sum = sum.add(vestingUsersMap[addresses[i]].balance);
            }
        }
        return sum;
    }

    function getBalance(address user) public view virtual override returns (uint256) {
        return vestingUsersMap[user].balance;
    }

    address[] private addresses = [address(0)];
    mapping(address => uint256) private addressToIndex;

    // Добавляет новый объект
    // Возвращает индекс объекта
    // 0 - если не было добавлено
    function _addUser(address user) private returns (uint256) {
        if (user == address(0)) return 0;

        uint256 index = _indexOfUser(user);
        if (index == 0) {
            addressToIndex[user] = addresses.length;
            addresses.push(user);
            return addressToIndex[user];
        }
        return index;
    }

    function _removeUser(address user) private {
        uint256 index = _indexOfUser(user);
        if (index > 0) {
            delete addresses[index];
            addressToIndex[user] = 0;
        }
    }

    // Возвращает 0, если объект не найден
    function _indexOfUser(address user) private view returns (uint256) {
        if (user != address(0) && addressToIndex[user] > 0) return addressToIndex[user];
        return 0;
    }
}
