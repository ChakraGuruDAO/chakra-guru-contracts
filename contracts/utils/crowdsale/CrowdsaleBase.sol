// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Address.sol";

import "./CrowdsaleMeta.sol";

abstract contract CrowdsaleBase is CrowdsaleMeta, Context, ReentrancyGuard {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;
    using Address for address;

    address internal _raiseWallet;
    uint256 internal _raisedBalance;

    event TokensPurchased(address indexed purchaser, address indexed beneficiary, uint256 saleAmount, uint256 raiseAmount);

    // Возвращает проданный/привлеченный баланс
    function getRaiseTokenBalance() public view virtual returns (uint256) {
        return _raisedBalance;
    }

    function getSaleTokenBalance() public view virtual returns (uint256) {
        return _raisedBalance.mul(getRate());
    }

    function buyTokens(address beneficiary, uint256 raiseAmount) public nonReentrant {
        // calculate token amount to be created
        uint256 saleAmount = getCalculateSaleToken(raiseAmount);

        _preValidatePurchase(beneficiary, saleAmount, raiseAmount);

        // update state
        _raisedBalance = _raisedBalance.add(raiseAmount);

        _processPurchase(beneficiary, saleAmount);
        emit TokensPurchased(_msgSender(), beneficiary, saleAmount, raiseAmount);

        _updatePurchasingState(beneficiary, saleAmount, raiseAmount);

        _forwardFunds(raiseAmount);
        _postValidatePurchase(beneficiary, saleAmount, raiseAmount);
    }

    // Делает предварительные проверки. Стоит наследоваться с использованием super
    function _preValidatePurchase(
        address beneficiary,
        uint256 saleAmount,
        uint256 raiseAmount
    ) internal view virtual {
        require(beneficiary != address(0), "Crowdsale: beneficiary is the zero address");
        require(saleAmount != 0, "Crowdsale: saleAmount is 0");
        require(raiseAmount != 0, "Crowdsale: raiseAmount is 0");
        this; // silence state mutability warning without generating bytecode - see https://github.com/ethereum/solidity/issues/2691
    }

    // Определяет как отправить токены пользователю
    function _processPurchase(address beneficiary, uint256 saleAmount) internal virtual {
        _saleToken.safeTransfer(beneficiary, saleAmount);
    }

    // Обновляет внешнее состояние, если необходимо
    function _updatePurchasingState(
        address beneficiary,
        uint256 saleAmount,
        uint256 raiseAmount
    ) internal virtual {
        // solhint-disable-previous-line no-empty-blocks
    }

    // Описывает способ отправки средств от пользователя в хранилище
    function _forwardFunds(uint256 raiseAmount) internal virtual {
        _raiseToken.safeTransferFrom(_msgSender(), _raiseWallet, raiseAmount);
    }

    // Пост-проверки. Можно проверить состояния и отменить сделку, если условия не подходят
    function _postValidatePurchase(
        address beneficiary,
        uint256 saleAmount,
        uint256 raiseAmount
    ) internal view virtual {
        // solhint-disable-previous-line no-empty-blocks
    }
}
