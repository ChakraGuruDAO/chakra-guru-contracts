// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IVestingVault {
    event VaultEnabled(uint256 balance);
    event VaultTokenChanged(address token);
    event VaultVestingInfoChanged(uint256[] unlockingTimes, uint256[] percents, uint256 precision);
    event VaultUserChanged(address indexed user, uint256 amount);
    event VaultWithdraw(address indexed user, uint256 amount);

    function setVestingInfo(
        uint256[] memory unlockingTimes,
        uint256[] memory percents,
        uint256 precision
    ) external;

    function getVestingInfo()
        external
        view
        returns (
            uint256[] memory,
            uint256[] memory,
            uint256
        );

    function setZeroDate(uint256 zeroDate) external;

    function getZeroDate() external view returns (uint256);

    function setToken(address token) external;

    function getToken() external view returns (address);

    function addUser(address user, uint256 amount) external;

    function removeUser(address user) external;

    function getUsers() external view returns (address[] memory);

    function isVaultEnabled() external view returns (bool);

    function enableVault(address from) external;

    function withdrawMultiplePortions(uint256[] calldata portionIds) external;

    function getBalance() external view returns (uint256);

    function getBalance(address user) external view returns (uint256);
}
