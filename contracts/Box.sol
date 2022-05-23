// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";

contract Box is Ownable {
    uint256 private value;

    event ValueChanged(uint256 _value);

    function getValue() external view returns (uint256) {
        return value;
    }

    function setValue(uint256 _value) external onlyOwner {
        value = _value;
        emit ValueChanged(_value);
    }
}
