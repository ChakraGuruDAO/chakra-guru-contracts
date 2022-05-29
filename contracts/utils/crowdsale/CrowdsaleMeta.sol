// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

abstract contract CrowdsaleMeta {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    IERC20 internal _saleToken;
    IERC20 internal _raiseToken;

    uint256 internal _rate;

    function getSaleToken() public view virtual returns (address) {
        return address(_saleToken);
    }

    function getRaiseToken() public view virtual returns (address) {
        return address(_raiseToken);
    }

    function getRate() public view virtual returns (uint256) {
        return _rate;
    }

    function getCalculateSaleToken(uint256 raiseAmount) public view virtual returns (uint256) {
        return _rate.div(raiseAmount);
    }

    function getCalculateRaiseToken(uint256 saleAmount) public view virtual returns (uint256) {
        return saleAmount.mul(getRate());
    }
}
