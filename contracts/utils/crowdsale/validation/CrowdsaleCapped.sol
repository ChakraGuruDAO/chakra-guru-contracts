// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "../CrowdsaleBase.sol";

abstract contract CrowdsaleCapped is CrowdsaleBase {
    using SafeMath for uint256;

    uint256 internal _minSaleCap;
    uint256 internal _maxSaleCap;

    function getSaleCap() public view virtual returns (uint256 minSaleCap, uint256 maxSaleCap) {
        return (_minSaleCap, _maxSaleCap);
    }

    function capReached() public view returns (bool minSaleCapReached, bool maxSaleCapReached) {
        uint256 saleTokenBalance = getSaleTokenBalance();
        (uint256 minSaleCap, uint256 maxSaleCap) = getSaleCap();
        return (saleTokenBalance >= minSaleCap, saleTokenBalance >= maxSaleCap);
    }

    function _preValidatePurchase(
        address beneficiary,
        uint256 saleAmount,
        uint256 raiseAmount
    ) internal view virtual override {
        super._preValidatePurchase(beneficiary, saleAmount, raiseAmount);

        uint256 saleTokenBalance = getSaleTokenBalance();
        require(saleTokenBalance.add(saleAmount) <= _maxSaleCap, "cap exceeded");
    }
}
