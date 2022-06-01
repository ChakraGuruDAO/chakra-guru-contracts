// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";

import "../utils/crowdsale/CrowdsaleBase.sol";
import "../utils/crowdsale/validation/CrowdsaleTime.sol";
import "../utils/crowdsale/validation/CrowdsaleLimitter.sol";
import "../utils/crowdsale/validation/CrowdsaleCapped.sol";
import "../utils/crowdsale/distribution/CrowdsalePostDelivery.sol";
import "../utils/crowdsale/distribution/CrowdsaleRefundable.sol";

contract KarmaPrivateCrowdsale is Ownable, CrowdsaleBase, CrowdsaleTime, CrowdsaleCapped, CrowdsaleLimitter, CrowdsalePostDelivery, CrowdsaleRefundable {
    constructor(
        address saleToken,
        address raiseToken,
        address raiseWallet
    ) {
        _setSaleToken(saleToken);
        _setRaiseToken(raiseToken);
        _setRaiseWallet(raiseWallet);
    }

    function setRate(uint256 rate) public onlyOwner {
        _setRate(rate);
    }

    function setSaleCap(uint256 minSaleCap, uint256 maxSaleCap) public onlyOwner {
        _setMinSaleCap(minSaleCap);
        _setMaxSaleCap(maxSaleCap);
    }

    function setSaleLimit(uint256 minSaleLimit, uint256 maxSaleLimit) public onlyOwner {
        _setMinSaleLimit(minSaleLimit);
        _setMaxSaleLimit(maxSaleLimit);
    }

    function setTime(uint256 openingTime, uint256 closingTime) public onlyOwner {
        _setOpeningTime(openingTime);
        _setClosingTime(closingTime);
    }

    function setVestingVault(address vestingVault) public onlyOwner {
        _setVestingVault(vestingVault);
    }

    function withdrawFundsWhenCapNotReached() public {
        _withdrawFunds();
    }

    function isOpen() public view returns (bool) {
        (, bool maxSaleCapReached) = capReached();
        return _isOpenByTime() && !maxSaleCapReached;
    }

    function isFinished() public view returns (bool) {
        (, bool maxSaleCapReached) = capReached();
        return _isFinishedByTime() || maxSaleCapReached;
    }

    function canRefundable() public view returns (bool) {
        return _canRefundable();
    }

    function balanceOf(address beneficiary) public view returns (uint256) {
        return _getBeneficiaryAmount(beneficiary);
    }

    function _preValidatePurchase(
        address beneficiary,
        uint256 saleAmount,
        uint256 raiseAmount
    ) internal view override(CrowdsaleTime, CrowdsaleLimitter, CrowdsaleCapped, CrowdsaleBase) {
        super._preValidatePurchase(beneficiary, saleAmount, raiseAmount);
    }

    function _processPurchase(address beneficiary, uint256 saleAmount) internal override(CrowdsalePostDelivery, CrowdsaleBase) {
        super._processPurchase(beneficiary, saleAmount);
    }

    function _updatePurchasingState(
        address purchaser,
        address beneficiary,
        uint256 saleAmount,
        uint256 raiseAmount
    ) internal override(CrowdsaleRefundable, CrowdsaleLimitter, CrowdsaleBase) {
        super._updatePurchasingState(purchaser, beneficiary, saleAmount, raiseAmount);
    }

    function _hasFinished() internal view override returns (bool) {
        return isFinished();
    }

    function _goalReached() internal view override returns (bool) {
        (bool minSaleCapReached, ) = capReached();
        return minSaleCapReached;
    }
}
