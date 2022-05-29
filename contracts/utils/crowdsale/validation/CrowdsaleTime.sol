// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "../CrowdsaleBase.sol";

abstract contract CrowdsaleTime is CrowdsaleBase {
    using SafeMath for uint256;

    uint256 internal _openingTime;
    uint256 internal _closingTime;

    function getOpeningTime() public view returns (uint256) {
        return _openingTime;
    }

    function getClosingTime() public view returns (uint256) {
        return _closingTime;
    }

    function _isOpenByTime() internal view virtual returns (bool) {
        return block.timestamp >= _openingTime && block.timestamp <= _closingTime;
    }

    function _hasClosedByTime() internal view virtual returns (bool) {
        return block.timestamp > _closingTime;
    }

    function _preValidatePurchase(
        address beneficiary,
        uint256 saleAmount,
        uint256 raiseAmount
    ) internal view virtual override {
        super._preValidatePurchase(beneficiary, saleAmount, raiseAmount);
        require(_isOpenByTime(), "crowdsale is closed");
    }
}
