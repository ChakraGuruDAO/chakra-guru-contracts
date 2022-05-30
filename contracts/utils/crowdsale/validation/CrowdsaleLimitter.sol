// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "../CrowdsaleBase.sol";

abstract contract CrowdsaleLimitter is CrowdsaleBase {
    using SafeMath for uint256;

    mapping(address => uint256) private _contributions;
    uint256 private _minSaleLimit;
    uint256 private _maxSaleLimit;

    function getContribution(address beneficiary) public view returns (uint256) {
        return _contributions[beneficiary];
    }

    function getSaleLimit() public view returns (uint256 minSaleLimit, uint256 maxSaleLimit) {
        return (_minSaleLimit, _maxSaleLimit);
    }

    function _getBalanceOf(address beneficiary) internal view returns (uint256) {
        return _contributions[beneficiary];
    }

    function _setMinSaleLimit(uint256 minSaleLimit) internal virtual {
        require(minSaleLimit > 0, "min sale limit is wrong");
        _minSaleLimit = minSaleLimit;
    }

    function _setMaxSaleLimit(uint256 maxSaleLimit) internal virtual {
        require(maxSaleLimit > _minSaleLimit, "max sale limit is wrong");
        _maxSaleLimit = maxSaleLimit;
    }

    function _preValidatePurchase(
        address beneficiary,
        uint256 saleAmount,
        uint256 raiseAmount
    ) internal view virtual override {
        super._preValidatePurchase(beneficiary, saleAmount, raiseAmount);

        uint256 newBalance = _contributions[beneficiary].add(saleAmount);
        require(newBalance >= _minSaleLimit && newBalance <= _maxSaleLimit, "beneficiary's limit exceeded");
    }

    function _updatePurchasingState(
        address purchaser,
        address beneficiary,
        uint256 saleAmount,
        uint256 raiseAmount
    ) internal virtual override {
        super._updatePurchasingState(purchaser, beneficiary, saleAmount, raiseAmount);
        _contributions[beneficiary] = _contributions[beneficiary].add(saleAmount);
    }
}
