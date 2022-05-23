//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./Token.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Exchange is Ownable {
    address public feeAccount;

    uint256 public feePercent;

    mapping(address => mapping(address => uint256)) public tokenBalances;

    // Events

    event DepositEvent(
        address token,
        address user,
        uint256 amount,
        uint256 balance
    );

    constructor(address _feeAccount, uint256 _feePercent) {
        feeAccount = _feeAccount;
        feePercent = _feePercent;
    }

    function depositEther() public {}

    function withdrawEther() public {}

    function depositToken(address _token, uint256 _amount) public {
        require(_amount > 0, "Amount must be greater than 0");
        require(
            Token(_token).transferFrom(msg.sender, address(this), _amount),
            "Depositing of token failed"
        );
        tokenBalances[_token][msg.sender] += _amount;
        emit DepositEvent(
            _token,
            msg.sender,
            _amount,
            tokenBalances[_token][msg.sender]
        );
    }

    function withdrawToken() public {}

    function checkBalance() public {}

    function makeOrder() public {}

    function cancelOrder() public {}

    function fillOrder() public {}

    function chargeFee() public {}
}
