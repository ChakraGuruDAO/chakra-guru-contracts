// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../CrowdsaleBase.sol";

contract CrowdsaleBaseMock is CrowdsaleBase {
    function getRaiseWallet() external view returns (address) {
        return _getRaiseWallet();
    }

    function setRaiseWallet(address raiseWallet) public {
        _setRaiseWallet(raiseWallet);
    }

    function setSaleToken(address saleToken) external {
        _setSaleToken(saleToken);
    }

    function setRaiseToken(address raiseToken) external {
        _setRaiseToken(raiseToken);
    }

    function setRate(uint256 rate) external {
        _setRate(rate);
    }

    // Делает предварительные проверки. Стоит наследоваться с использованием super
    function preValidatePurchase(
        address beneficiary,
        uint256 saleAmount,
        uint256 raiseAmount
    ) external view {
        _preValidatePurchase(beneficiary, saleAmount, raiseAmount);
    }

    // Определяет как отправить токены пользователю
    function processPurchase(address beneficiary, uint256 saleAmount) internal virtual {
        _processPurchase(beneficiary, saleAmount);
    }

    // Описывает способ отправки средств от пользователя в хранилище
    function forwardFunds(address purchaser, uint256 raiseAmount) external {
        _forwardFunds(purchaser, raiseAmount);
    }
}
