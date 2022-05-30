// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "@openzeppelin/contracts/utils/Address.sol";

abstract contract CrowdsaleMeta {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;
    using Address for address;

    event CrowdsaleSaleTokenUpdated(address saleToken);
    event CrowdsaleRaiseTokenUpdated(address raiseToken);
    event CrowdsaleRateUpdated(uint256 rate);

    IERC20 private _saleToken;
    IERC20 private _raiseToken;

    uint256 private _rate;

    function getSaleToken() public view virtual returns (IERC20) {
        return _saleToken;
    }

    function getRaiseToken() public view virtual returns (IERC20) {
        return _raiseToken;
    }

    function getRate() public view virtual returns (uint256) {
        return _rate;
    }

    function getSaleAmountFromRaiseAmount(uint256 raiseAmount) public view virtual returns (uint256) {
        return _rate.div(raiseAmount);
    }

    function getRaiseAmountFromSaleAmount(uint256 saleAmount) public view virtual returns (uint256) {
        return saleAmount.mul(getRate());
    }

    function _setSaleToken(address saleToken) internal virtual {
        require(saleToken != address(0), "saleToken address is empty");
        require(saleToken.isContract(), "saleToken address is not contract");

        _saleToken = IERC20(saleToken);
        emit CrowdsaleSaleTokenUpdated(saleToken);
    }

    function _setRaiseToken(address raiseToken) internal virtual {
        require(raiseToken != address(0), "saleToken address is empty");
        require(raiseToken.isContract(), "saleToken address is not contract");

        _raiseToken = IERC20(raiseToken);
        emit CrowdsaleRaiseTokenUpdated(raiseToken);
    }

    function _setRate(uint256 rate) internal virtual {
        require(rate > 0, "rate is wrong");

        rate = _rate;
        emit CrowdsaleRateUpdated(rate);
    }
}
