// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "../../vesting/UserVestingVault.sol";
import "../CrowdsaleBase.sol";

abstract contract CrowdsalePostDelivery is CrowdsaleBase {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    UserVestingVault internal _vestingVault;

    function getVestingVault() public view returns (address) {
        return address(_vestingVault);
    }

    function _processPurchase(address beneficiary, uint256 saleAmount) internal virtual override {
        // _balances[beneficiary] = _balances[beneficiary].add(tokenAmount);
        // _deliverTokens(address(_vault), tokenAmount);
        uint256 newBalance = _vestingVault.getBalance(beneficiary).add(saleAmount);
        _vestingVault.addUser(beneficiary, newBalance);
    }
}
