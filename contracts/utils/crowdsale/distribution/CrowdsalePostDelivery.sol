// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Address.sol";

import "../../vesting/IVestingVault.sol";
import "../CrowdsaleBase.sol";

abstract contract CrowdsalePostDelivery is CrowdsaleBase {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;
    using Address for address;

    event CrowdsaleVestingVaultUpdated(address newVestingVault, address prevVestingVault);

    IVestingVault private _vestingVault;

    function getVestingVault() public view returns (IVestingVault) {
        return _vestingVault;
    }

    function _setVestingVault(address vestingVault) internal virtual {
        require(vestingVault != address(0), "address is empty");
        require(vestingVault.isContract(), "address is not contract");

        address prevVestingVault = address(_vestingVault);
        _vestingVault = IVestingVault(vestingVault);

        emit CrowdsaleVestingVaultUpdated(vestingVault, prevVestingVault);
    }

    function _processPurchase(address beneficiary, uint256 saleAmount) internal virtual override {
        _vestingVault.addBeneficiary(beneficiary, saleAmount);
    }

    function _getBeneficiaryAmount(address beneficiary) internal view virtual returns (uint256) {
        (uint256 amount, ) = _vestingVault.getBeneficiary(beneficiary);
        return amount;
    }
}
