// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "hardhat/console.sol";
import "./ExampleExternalContract.sol";

contract Staker {
    ExampleExternalContract public exampleExternalContract;

    uint256 public constant threshold = 1 ether;
    uint256 public deadline = block.timestamp + 72 hours;// 30 seconds;

    uint256 private accountBalance = 0;
    mapping(address => uint256) public balances;

    // MODIFIERS
    modifier onlyIfEnoughBalance() {
        require(accountBalance >= threshold, "Not enough balance");
        _;
    }

    modifier onlyDeadlinePassed() {
        require(
            block.timestamp > deadline,
            "Deadline not passed, try again later"
        );
        _;
    }

    modifier notCompleted() {
        require(
            !exampleExternalContract.completed(),
            "Challenge already completed"
        );
        _;
    }

    // EVENTS
    event Stake(address indexed staker, uint256 amount);

    // MAIN FUNCTIONALITY STARTS HERE
    constructor(address exampleExternalContractAddress) {
        exampleExternalContract = ExampleExternalContract(
            exampleExternalContractAddress
        );
    }

    // Collect funds in a payable `stake()` function and track individual `balances` with a mapping:
    //  ( make sure to add a `Stake(address,uint256)` event and emit it for the frontend <List/> display )
    function stake() public payable notCompleted {
        accountBalance += msg.value;

        balances[msg.sender] += msg.value;

        emit Stake(msg.sender, msg.value);
    }

    // After some `deadline` allow anyone to call an `execute()` function
    //  It should either call `exampleExternalContract.complete{value: address(this).balance}()` to send all the value
    function execute() public onlyDeadlinePassed onlyIfEnoughBalance {
        exampleExternalContract.complete{value: accountBalance}();
    }

    // if the `threshold` was not met, allow everyone to call a `withdraw()` function
    // Add a `withdraw()` function to let users withdraw their balance
    function withdraw() public onlyDeadlinePassed {
        uint256 senderStake = balances[msg.sender];

        if (senderStake > 0) {
            balances[msg.sender] = 0;
            accountBalance -= senderStake;

            payable(msg.sender).transfer(senderStake);
        }
    }

    // Add a `timeLeft()` view function that returns the time left before the deadline for the frontend
    function timeLeft() public view returns (uint256) {
        if (block.timestamp >= deadline) {
            return 0;
        }

        return deadline - block.timestamp;
    }

    // Add the `receive()` special function that receives eth and calls stake()
    receive() external payable {
        stake();
    }
}
