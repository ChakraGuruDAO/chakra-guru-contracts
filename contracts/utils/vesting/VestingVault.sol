// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Address.sol";

import "./IVestingVault.sol";

abstract contract VestingVault is IVestingVault, Ownable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;
    using Address for address;

    struct VestingUser {
        uint256 balance;
        bool[] isPortionWithdraw;
    }
    IERC20 internal token;

    mapping(address => VestingUser) public vestingUsersMap;

    uint256 internal zeroDate;
    uint256[] internal vestingPortionsUnlockTime;
    uint256[] internal vestingPercentPerPortion;
    uint256 internal vestingPercentPrecision;

    bool internal isEnabled;

    function getVestingInfo()
        public
        view
        virtual
        override
        returns (
            uint256[] memory,
            uint256[] memory,
            uint256
        )
    {
        return (vestingPortionsUnlockTime, vestingPercentPerPortion, vestingPercentPrecision);
    }

    function getToken() public view virtual override returns (address) {
        return address(token);
    }

    function getZeroDate() public view virtual override returns (uint256) {
        return zeroDate;
    }

    function isVaultEnabled() public view virtual override returns (bool) {
        return isEnabled;
    }

    function getVestingUser(address _user) public view virtual returns (uint256 balance, bool[] memory isPortionWithdraw) {
        VestingUser memory vu = vestingUsersMap[_user];
        return (vu.balance, vu.isPortionWithdraw);
    }

    function _getTotalSumInVault() internal virtual returns (uint256);

    function setToken(address _token) public virtual override onlyVaultDisabled onlyOwner {
        require(_token != address(0), "address is empty");
        require(_token.isContract(), "address is not contract");

        token = IERC20(_token);
        emit VaultTokenChanged(_token);
    }

    function setZeroDate(uint256 _zeroDate) public virtual override onlyVaultDisabled onlyOwner {
        require(_zeroDate >= block.timestamp, "wrong zero date");
        zeroDate = _zeroDate;
    }

    function setVestingInfo(
        uint256[] memory unlockingTimes,
        uint256[] memory percents,
        uint256 precision
    ) public virtual override onlyVaultDisabled onlyOwner {
        require(precision >= 1, "wrong precision");
        require(unlockingTimes.length == percents.length, "wrong array length");

        uint256 sum;

        for (uint256 i = 0; i < unlockingTimes.length; i++) {
            if (i > 0) {
                require(unlockingTimes[i] > unlockingTimes[i - 1], "Unlock time must be greater than previous.");
            }
            sum = sum.add(percents[i]);
        }

        require(sum == precision, "Percent distribution issue.");

        vestingPortionsUnlockTime = unlockingTimes;
        vestingPercentPerPortion = percents;
        vestingPercentPrecision = precision;
        emit VaultVestingInfoChanged(unlockingTimes, percents, precision);
    }

    function enableVault(address from) public virtual override onlyVaultDisabled onlyOwner {
        require(isEnabled == false, "Vault is enabled");
        require(vestingPortionsUnlockTime.length > 0 && vestingPercentPerPortion.length > 0);

        uint256 amount = _getTotalSumInVault();

        isEnabled = true;
        token.safeTransferFrom(from, address(this), amount);
        emit VaultEnabled(amount);
    }

    function withdrawMultiplePortions(uint256[] calldata portionIds) public virtual override onlyVaultEnabled {
        uint256 totalToWithdraw = 0;

        address userAddress = _msgSender();
        // Retrieve participation from storage
        VestingUser storage user = vestingUsersMap[userAddress];

        for (uint256 i = 0; i < portionIds.length; i++) {
            uint256 portionId = portionIds[i];
            require(portionId < vestingPercentPerPortion.length, "portionId is wrong");

            if (!user.isPortionWithdraw[portionId] && zeroDate.add(vestingPortionsUnlockTime[portionId]) <= block.timestamp) {
                user.isPortionWithdraw[portionId] = true;

                uint256 amountWithdrawing = user.balance.mul(vestingPercentPerPortion[portionId]).div(vestingPercentPrecision);
                totalToWithdraw = totalToWithdraw.add(amountWithdrawing);
            }
        }

        if (totalToWithdraw > 0) {
            token.safeTransfer(userAddress, totalToWithdraw);
            emit VaultWithdraw(userAddress, totalToWithdraw);
        }
    }

    modifier onlyVaultEnabled() {
        require(isVaultEnabled() == true, "vault is disabled");
        _;
    }

    modifier onlyVaultDisabled() {
        require(isVaultEnabled() == false, "vault is enabled");
        _;
    }
}
