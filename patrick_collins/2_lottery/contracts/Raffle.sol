// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";

error Raffle__NotEnoughEthEntered();
error Raffle__TransferFailed();

contract Raffle is VRFConsumerBaseV2 {
    using Counters for Counters.Counter;

    Counters.Counter s_currentRaffleId;

    uint256 private immutable i_entranceFee;
    address payable[] private s_players;
    address payable private s_recentWinner;

    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    bytes32 private immutable i_gasLane;
    uint64 private immutable i_subscriptionId;
    uint32 private immutable i_callbackGasLimit;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 3;

    event Raffle__PlayerEntered(address indexed player, uint256 amount);
    event Raffle__RaffleWinnerRequested(uint256 requestId);
    event Raffle__WinnerPicked(uint256 raffleId, address indexed player, uint256 amount);

    constructor(
        address vrfCoordinatorV2,
        uint256 _entranceFee,
        bytes32 _gasLane,
        uint64 _subscriptionId,
        uint32 _callbackGasLimit
    ) VRFConsumerBaseV2(vrfCoordinatorV2) {
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_gasLane = _gasLane;
        i_subscriptionId = _subscriptionId;
        i_callbackGasLimit = _callbackGasLimit;

        i_entranceFee = _entranceFee;

        s_currentRaffleId.increment();
    }

    function enterRaffle() public payable {
        if (msg.value < i_entranceFee) {
            revert Raffle__NotEnoughEthEntered();
        }

        s_players.push(payable(msg.sender));

        emit Raffle__PlayerEntered(msg.sender, msg.value);
    }

    function requestRandomWinner() external {
        uint256 requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane,
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUM_WORDS
        );

        emit Raffle__RaffleWinnerRequested(requestId);
    }

    function fulfillRandomWords(
        uint256, /* requestId */
        uint256[] memory randomWords
    ) internal override {
        uint256 winnerIndex = randomWords[0] % s_players.length;
        address payable recentWinner = s_players[winnerIndex];
        s_recentWinner = recentWinner;

        uint256 raffleBalance = address(this).balance;
        (bool success, ) = recentWinner.call{value: raffleBalance}("");

        if (!success) {
            revert Raffle__TransferFailed();
        }

        uint256 raffleId = s_currentRaffleId.current();

        emit Raffle__WinnerPicked(raffleId, recentWinner, raffleBalance);
    }

    function getEntranceFee() public view returns (uint256) {
        return i_entranceFee;
    }

    function getPlayers() public view returns (address payable[] memory) {
        return s_players;
    }

    function getRecentWinner() public view returns (address payable) {
        return s_recentWinner;
    }
}
