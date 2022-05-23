//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./Token.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Exchange is Ownable {
    address public feeAccount;

    uint256 public feePercent;

    mapping(address => uint256) public balances;

    constructor(address _feeAccount, uint256 _feePercent) {
        feeAccount = _feeAccount;
        feePercent = _feePercent;
    }

    function depositEther() public {}

    function withdrawEther() public {}

    function depositToken(address _token, uint256 _amount) public {
        Token(_token).transferFrom(msg.sender, address(this), _amount);
    }

    function withdrawToken() public {}

    function checkBalance() public {}

    function makeOrder() public {}

    function cancelOrder() public {}

    function fillOrder() public {}

    function chargeFee() public {}
}
