// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";

error Raffle__NotEnoughEthEntered();
error Raffle__TransferFailed();
error Raffle__RaffleNotOpen();
error Raffle__UpkeepNotNeeded(uint256, uint256, uint256);

/* 
    @title A sample Raffle Contract
    @author Tobias Leinss
    @notice This contract is for creating an untamperable decentralized lottery.
    @dev This implements Chainlink's VRFConsumerBaseV2 and Keepers.
 */
contract Raffle is VRFConsumerBaseV2 {
    /* Imports */
    using Counters for Counters.Counter;

    /* Types */
    enum RaffleState {
        OPEN,
        CALCULATING
    }

    /* State variables */
    Counters.Counter private s_currentRaffleId;
    RaffleState private s_raffleState = RaffleState.OPEN;

    uint256 private immutable i_entranceFee;
    uint256 private immutable i_interval;

    address payable[] private s_players;
    address payable private s_recentWinner;
    uint256 private s_lastTimestamp;

    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    bytes32 private immutable i_gasLane;
    uint64 private immutable i_subscriptionId;
    uint32 private immutable i_callbackGasLimit;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 3;

    /* Events */
    event Raffle__PlayerEntered(address indexed player, uint256 amount);
    event Raffle__RaffleWinnerRequested(uint256 requestId);
    event Raffle__WinnerPicked(uint256 raffleId, address indexed player, uint256 amount);

    /* Functions */
    constructor(
        uint256 _entranceFee,
        uint256 _interval,
        address vrfCoordinatorV2,
        bytes32 _gasLane,
        uint64 _subscriptionId,
        uint32 _callbackGasLimit
    ) VRFConsumerBaseV2(vrfCoordinatorV2) {
        i_entranceFee = _entranceFee;
        i_interval = _interval;
        s_lastTimestamp = block.timestamp;

        s_currentRaffleId.increment();

        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_gasLane = _gasLane;
        i_subscriptionId = _subscriptionId;
        i_callbackGasLimit = _callbackGasLimit;
    }

    function enterRaffle() public payable {
        if (msg.value < i_entranceFee) {
            revert Raffle__NotEnoughEthEntered();
        }
        if (s_raffleState != RaffleState.OPEN) {
            revert Raffle__RaffleNotOpen();
        }

        s_players.push(payable(msg.sender));

        emit Raffle__PlayerEntered(msg.sender, msg.value);
    }

    function performUpkeep(
        bytes calldata /* performData */
    ) external {
        (bool upkeepNeeded, ) = checkUpkeep("");
        if (!upkeepNeeded) {
            revert Raffle__UpkeepNotNeeded(
                address(this).balance,
                s_players.length,
                uint256(s_raffleState)
            );
        }

        s_raffleState = RaffleState.CALCULATING;

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

        s_lastTimestamp = block.timestamp;
        s_raffleState = RaffleState.OPEN;
        s_players = new address payable[](0);

        uint256 raffleId = s_currentRaffleId.current();
        emit Raffle__WinnerPicked(raffleId, recentWinner, raffleBalance);
    }

    function checkUpkeep(
        bytes memory /* checkData */
    )
        public
        view
        returns (
            // override
            bool upkeepNeeded,
            bytes memory /* performData */
        )
    {
        bool isOpen = s_raffleState == RaffleState.OPEN;
        bool timePassed = (block.timestamp - s_lastTimestamp) > i_interval;
        bool hasPlayers = s_players.length > 0;
        bool hasBalance = address(this).balance > 0;

        upkeepNeeded = isOpen && timePassed && hasPlayers && hasBalance;
    }

    /* View functions */
    function getCurrentRaffleId() public view returns (uint256) {
        return s_currentRaffleId.current();
    }

    function getRaffleState() public view returns (uint256) {
        return uint256(s_raffleState);
    }

    function getEntranceFee() public view returns (uint256) {
        return i_entranceFee;
    }

    function getInterval() public view returns (uint256) {
        return i_interval;
    }

    function getPlayers() public view returns (address payable[] memory) {
        return s_players;
    }

    function getPlayer(uint256 playerId) public view returns (address payable) {
        return s_players[playerId];
    }

    function getNumberOfPlayers() public view returns (uint256) {
        return s_players.length;
    }

    function getRecentWinner() public view returns (address payable) {
        return s_recentWinner;
    }

    function getLatestTimestamp() public view returns (uint256) {
        return s_lastTimestamp;
    }

    function getRequestConfirmations() public pure returns (uint16) {
        return REQUEST_CONFIRMATIONS;
    }
}
