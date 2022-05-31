// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "../CrowdsaleBase.sol";

abstract contract CrowdsaleTime is CrowdsaleBase {
    using SafeMath for uint256;

    uint256 private _openingTime;
    uint256 private _closingTime;

    function getOpeningTime() public view returns (uint256) {
        return _openingTime;
    }

    function getClosingTime() public view returns (uint256) {
        return _closingTime;
    }

    function _setOpeningTime(uint256 openingTime) internal virtual {
        require(openingTime > block.timestamp, "opening time is wrong");
        _openingTime = openingTime;
    }

    function _setClosingTime(uint256 closingTime) internal virtual {
        require(_openingTime != 0, "opening time is not set");
        require(closingTime > block.timestamp && closingTime > _openingTime, "closing time is wrong");
        _closingTime = closingTime;
    }

    function _isOpenByTime() internal view virtual returns (bool) {
        return block.timestamp >= _openingTime && block.timestamp < _closingTime;
    }

    function _isFinishedByTime() internal view virtual returns (bool) {
        return block.timestamp >= _closingTime;
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
