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

contract KarmaPrivateCrowdsale is Ownable, CrowdsaleBase, CrowdsaleTime, CrowdsaleCapped, CrowdsaleLimitter, CrowdsalePostDelivery {
    constructor(
        address saleToken,
        address raiseToken,
        uint256 rate,
        address raiseWallet
    ) {
        // Meta
        _saleToken = IERC20(saleToken);
        _raiseToken = IERC20(raiseToken);
        _rate = rate;

        // Base
        _raiseWallet = raiseWallet;

        // Capped
        _minSaleCap = 2000000;
        _maxSaleCap = 4000000;

        // Time
        _openingTime = 1654074000;
        _closingTime = 1656579600;
    }

    function isOpen() public view returns (bool) {
        (, bool maxSaleCapReached) = capReached();
        return _isOpenByTime() && !maxSaleCapReached;
    }

    function isFinished() public view returns (bool) {
        (, bool maxSaleCapReached) = capReached();
        return _hasClosedByTime() || maxSaleCapReached;
    }

    function _preValidatePurchase(
        address beneficiary,
        uint256 saleAmount,
        uint256 raiseAmount
    ) internal view override(CrowdsaleBase, CrowdsaleCapped, CrowdsaleLimitter, CrowdsaleTime) {
        super._preValidatePurchase(beneficiary, saleAmount, raiseAmount);
    }

    function _processPurchase(address beneficiary, uint256 saleAmount) internal override(CrowdsaleBase, CrowdsalePostDelivery) {
        super._processPurchase(beneficiary, saleAmount);
    }

    function _updatePurchasingState(
        address beneficiary,
        uint256 saleAmount,
        uint256 raiseAmount
    ) internal override(CrowdsaleBase, CrowdsaleLimitter) {
        super._updatePurchasingState(beneficiary, saleAmount, raiseAmount);
    }
}
