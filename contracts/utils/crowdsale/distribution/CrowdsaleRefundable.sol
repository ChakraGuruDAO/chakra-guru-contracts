// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "../CrowdsaleBase.sol";

abstract contract CrowdsaleRefundable is Context, ReentrancyGuard, CrowdsaleBase {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    mapping(address => uint256) private _purchasers;

    function _canRefundable() internal view returns (bool) {
        return _hasFinished() && !_goalReached();
    }

    function _hasFinished() internal view virtual returns (bool);

    function _goalReached() internal view virtual returns (bool);

    function _withdrawFunds() internal virtual nonReentrant {
        require(_canRefundable(), "can not refundable");

        address purchaser = _msgSender();
        IERC20 raiseToken = getRaiseToken();
        address raiseWallet = _getRaiseWallet();

        uint256 amount = _purchasers[purchaser];
        require(amount > 0, "not amount refundable");

        _purchasers[purchaser] = 0;
        raiseToken.safeTransferFrom(raiseWallet, purchaser, amount);
    }

    function _updatePurchasingState(
        address purchaser,
        address beneficiary,
        uint256 saleAmount,
        uint256 raiseAmount
    ) internal virtual override {
        super._updatePurchasingState(purchaser, beneficiary, saleAmount, raiseAmount);
        _purchasers[purchaser] = _purchasers[purchaser].add(raiseAmount);
    }
}
