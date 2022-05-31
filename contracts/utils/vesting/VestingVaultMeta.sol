// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Address.sol";

abstract contract VestingVaultMeta {
    using SafeMath for uint256;
    using Address for address;

    event VaultStatusUpdated(Status newStatus, Status prevStatus);
    event VaultTokenChanged(address token);
    event VaultVestingInfoChanged(uint256[] unlockingTimes, uint256[] percents, uint256 precision);

    enum Status {
        CONFIG,
        BENEFICIARY,
        CLAIM
    }

    IERC20 private _token;
    Status private _status = Status.CONFIG;
    uint256 private _zeroDate;
    uint256 private _vestingPercentPrecision;
    uint256[] private _vestingPortionsUnlockTime;
    uint256[] private _vestingPercentPerPortion;

    function getStatus() public view virtual returns (Status) {
        return _status;
    }

    function getToken() public view virtual returns (IERC20) {
        return _token;
    }

    function getZeroDate() public view virtual returns (uint256) {
        return _zeroDate;
    }

    function getVestingInfo()
        public
        view
        virtual
        returns (
            uint256[] memory vestingPortionsUnlockTime,
            uint256[] memory vestingPercentPerPortion,
            uint256 vestingPercentPrecision
        )
    {
        return (_vestingPortionsUnlockTime, _vestingPercentPerPortion, _vestingPercentPrecision);
    }

    function _setToken(address token) internal virtual onlyIsStatus(Status.CONFIG) {
        require(token != address(0), "address is empty");
        require(token.isContract(), "address is not contract");

        _token = IERC20(token);
        emit VaultTokenChanged(token);
    }

    function _setVestingInfo(
        uint256[] memory vestingPortionsUnlockTime,
        uint256[] memory vestingPercentPerPortion,
        uint256 vestingPercentPrecision
    ) internal virtual onlyIsStatus(Status.CONFIG) {
        require(vestingPercentPrecision >= 1, "wrong precision");
        require(vestingPortionsUnlockTime.length == vestingPercentPerPortion.length, "wrong array length");

        uint256 sum;

        for (uint256 i = 0; i < vestingPortionsUnlockTime.length; i++) {
            if (i > 0) {
                require(vestingPortionsUnlockTime[i] > vestingPortionsUnlockTime[i - 1], "Unlock time must be greater than previous.");
            }
            sum = sum.add(vestingPercentPerPortion[i]);
        }

        require(sum == vestingPercentPrecision, "Percent distribution issue.");

        _vestingPortionsUnlockTime = vestingPortionsUnlockTime;
        _vestingPercentPerPortion = vestingPercentPerPortion;
        _vestingPercentPrecision = vestingPercentPrecision;
        emit VaultVestingInfoChanged(vestingPortionsUnlockTime, vestingPercentPerPortion, vestingPercentPrecision);
    }

    function _setZeroDate(uint256 zeroDate) internal virtual onlyIsStatus(Status.CONFIG) {
        require(zeroDate >= block.timestamp, "wrong zero date");
        _zeroDate = zeroDate;
    }

    function _changeStatus(Status newStatus) internal virtual {
        Status prevStatus = _status;
        require(uint8(newStatus) > uint8(prevStatus), "wrong status stage");

        _status = newStatus;
        if (_status == Status.BENEFICIARY) {
            _changeStatusToBeneficiary();
        } else if (_status == Status.CLAIM) {
            _changeStatusToClaim();
        }
        emit VaultStatusUpdated(newStatus, prevStatus);
    }

    function _changeStatusToBeneficiary() internal virtual {
        require(address(_token) != address(0), "address is empty");
        require(_vestingPercentPrecision >= 1, "precision is not set");
        require(_vestingPortionsUnlockTime.length > 0 && _vestingPercentPerPortion.length > 0, "vesting info is not set");
        require(_zeroDate > 0, "zero date is not set");
    }

    function _changeStatusToClaim() internal virtual {
        // solhint-disable-previous-line no-empty-blocks
    }

    modifier onlyIsStatus(Status status) virtual {
        require(_status == status, "wrong status");
        _;
    }
}
