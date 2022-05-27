// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Crowdsale is VestingVault {
    IERC20 public saleToken;
    IERC20 public fromToken;

    uint256 startTime;
    uint256 endTime;
    VestingVault vault;

    constructor(uint256 _amount) {
        vault = new VestingVault(_amount);
    }

    modifier onlyAdmin() {
        _;
    }

    modifier onlyBuyer() {
        _;
    }

    modifier onlyIfSaleStarted() {
        _;
    }

    function setSaleParams(
        address _saleTokenAddress,
        address _fromTokenAddress,
        uint256 _startTime,
        uint256 _endTime
    ) public {
        saleToken = IERC20(_saleTokenAddress);
        fromToken = IERC20(_fromTokenAddress);
        startTime = _startTime;
        endTime = _endTime;
    }

    function participate(uint256 _amount) public {
        require(saleToken.allowance(msg.sender, address(this)) > 0, "not approved tokens");
        require(saleToken.balanceOf(msg.sender) > 0, "not enought balance");
        bool success = saleToken.transferFrom(msg.sender, address(this), _amount);
        require(success, "transaction failed");

        if (raised >= vault.amount) {
            // SUCCESS
            // vault.addUsers(users);
        }
    }

    function updateTokenPrice(uint256 _price) external onlyAdmin {}

    function claimRewards() public {}

    function getNumberOfRegisteredUsers() external view returns (uint256) {}

    /// Function to get all info about vesting.
    function getVestingInfo() external view returns (uint256[] memory, uint256[] memory) {}

    // Function to act as a fallback and handle receiving AVAX.
    receive() external payable {}
}
