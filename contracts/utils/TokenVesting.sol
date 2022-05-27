// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TokenVesting is Ownable {
    using ECDSA for bytes32;
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    IERC20 public saleToken;
    IERC20 public fromSaleToken;
    uint256 salePrice;

    uint256 saleStartTime;
    uint256 saleEndTime;

    uint256 softCapSaleToken;
    uint256 hardCapSaleToken;

    function initialize(address _saleToken, address _fromSaleToken) external {
        saleToken = IERC20(_saleToken);
        fromSaleToken = IERC20(_fromSaleToken);
    }
}
