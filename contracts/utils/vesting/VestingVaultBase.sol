// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

import "./VestingVaultMeta.sol";

abstract contract VestingVaultBase is VestingVaultMeta, Context {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;
    using EnumerableSet for EnumerableSet.AddressSet;

    event VaultBeneficiaryUpdated(address indexed beneficiary, uint256 amount);
    event VaultWithdraw(address indexed beneficiary, uint256 amount);

    struct BeneficiaryInfo {
        uint256 amount;
        bool[] isPortionWithdraw;
    }

    mapping(address => BeneficiaryInfo) internal _beneficiaryInfoMap;
    EnumerableSet.AddressSet internal _beneficiaries;

    function getBeneficiary(address beneficiary) public view virtual returns (uint256 amount, bool[] memory isPortionWithdraw) {
        BeneficiaryInfo memory beneficiaryInfo = _beneficiaryInfoMap[beneficiary];
        return (beneficiaryInfo.amount, beneficiaryInfo.isPortionWithdraw);
    }

    function getAllBeneficiaries() public view virtual returns (address[] memory) {
        return _beneficiaries.values();
    }

    function getAllBalance() public view virtual returns (uint256) {
        uint256 sum = 0;
        address[] memory beneficiaries = _beneficiaries.values();
        for (uint256 i = 0; i < beneficiaries.length; i++) {
            BeneficiaryInfo memory beneficiaryInfo = _beneficiaryInfoMap[beneficiaries[i]];
            sum = sum.add(beneficiaryInfo.amount);
        }
        return sum;
    }

    function _addBeneficiary(address beneficiary, uint256 amount) internal virtual onlyIsStatus(Status.BENEFICIARY) {
        require(beneficiary != address(0), "empty address");
        require(amount > 0, "empty amount");

        _beneficiaries.add(beneficiary);

        (uint256[] memory vestingPortionsUnlockTime, , ) = getVestingInfo();
        bool[] memory _empty = new bool[](vestingPortionsUnlockTime.length);
        _beneficiaryInfoMap[beneficiary].amount = _beneficiaryInfoMap[beneficiary].amount.add(amount);
        _beneficiaryInfoMap[beneficiary].isPortionWithdraw = _empty;
        emit VaultBeneficiaryUpdated(beneficiary, _beneficiaryInfoMap[beneficiary].amount);
    }

    function _removeBeneficiary(address beneficiary) internal virtual onlyIsStatus(Status.BENEFICIARY) {
        require(_beneficiaries.contains(beneficiary), "beneficiary not found");

        _beneficiaries.remove(beneficiary);
        delete _beneficiaryInfoMap[beneficiary];
        emit VaultBeneficiaryUpdated(beneficiary, 0);
    }

    function _claimMultiPortions(uint256[] calldata portionIds) internal virtual onlyIsStatus(Status.CLAIM) {
        (uint256[] memory vestingPortionsUnlockTime, uint256[] memory vestingPercentPerPortion, uint256 vestingPercentPrecision) = getVestingInfo();
        uint256 zeroDate = getZeroDate();
        IERC20 token = getToken();

        uint256 totalToWithdraw = 0;

        address userAddress = _msgSender();
        BeneficiaryInfo storage beneficiaryInfo = _beneficiaryInfoMap[userAddress];

        for (uint256 i = 0; i < portionIds.length; i++) {
            uint256 portionId = portionIds[i];
            require(portionId < vestingPercentPerPortion.length, "portionId is wrong");

            if (!beneficiaryInfo.isPortionWithdraw[portionId] && zeroDate.add(vestingPortionsUnlockTime[portionId]) <= block.timestamp) {
                beneficiaryInfo.isPortionWithdraw[portionId] = true;

                uint256 amountWithdrawing = beneficiaryInfo.amount.mul(vestingPercentPerPortion[portionId]).div(vestingPercentPrecision);
                totalToWithdraw = totalToWithdraw.add(amountWithdrawing);
            }
        }

        if (totalToWithdraw > 0) {
            token.safeTransfer(userAddress, totalToWithdraw);
            emit VaultWithdraw(userAddress, totalToWithdraw);
        }
    }

    function _changeStatusToClaim() internal virtual override {
        super._changeStatusToClaim();

        IERC20 token = getToken();
        uint256 allBalance = getAllBalance();
        require(token.balanceOf(address(this)) >= allBalance, "balance is not equals");
    }
}
