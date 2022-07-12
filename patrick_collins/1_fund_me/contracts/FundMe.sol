// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./PriceConverter.sol";

error FundMe__SendMoreEth();
error FundMe__NotOwner();
error FundMe__CallFailed();

/**
 * @title A contract for crowdfunding
 * @author Tobias Leinss
 */
contract FundMe {
    using PriceConverter for uint256;

    mapping(address => uint256) private s_addressToAmountFunded;
    address[] private s_funders;

    address private immutable i_owner;
    uint256 public constant MINIMUM_USD = 0.5 * 10**18; // 0.5 USD

    event Funded(address indexed funder, uint256 amount);
    event Withdrawn(address indexed funder, uint256 amount);

    AggregatorV3Interface private s_priceFeed;

    constructor(address priceFeed_) {
        i_owner = msg.sender;
        s_priceFeed = AggregatorV3Interface(priceFeed_); // 0x8A753747A1Fa494EC906cE90E9f37563A8AF630e
    }

    // Explainer from: https://solidity-by-example.org/fallback/
    // Ether is sent to contract
    //      is msg.data empty?
    //          /   \
    //         yes  no
    //         /     \
    //    receive()?  fallback()
    //     /   \
    //   yes   no
    //  /        \
    //receive()  fallback()

    receive() external payable {
        fund();
    }

    fallback() external payable {
        fund();
    }

    function fund() public payable {
        if (msg.value.getConversionRate(s_priceFeed) < MINIMUM_USD)
            revert FundMe__SendMoreEth();
        // require(PriceConverter.getConversionRate(msg.value) >= MINIMUM_USD, "You need to spend more ETH!");
        s_addressToAmountFunded[msg.sender] += msg.value;
        s_funders.push(msg.sender);

        emit Funded(msg.sender, msg.value);
    }

    // function getVersion() public view returns (uint256) {
    //     return priceFeed.version();
    // }

    modifier onlyOwner() {
        if (msg.sender != i_owner) revert FundMe__NotOwner();
        _;
    }

    function withdraw() public payable onlyOwner {
        for (
            uint256 funderIndex = 0;
            funderIndex < s_funders.length;
            funderIndex++
        ) {
            address funder = s_funders[funderIndex];
            s_addressToAmountFunded[funder] = 0;
        }
        s_funders = new address[](0);

        // 3 options:
        // transfer
        // payable(msg.sender).transfer(address(this).balance);
        // send
        // bool sendSuccess = payable(msg.sender).send(address(this).balance);
        // require(sendSuccess, "Send failed");
        // call
        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        if (!callSuccess) revert FundMe__CallFailed();

        emit Withdrawn(msg.sender, address(this).balance);
    }

    function getOwner() external view returns (address) {
        return i_owner;
    }

    function getFunders() external view returns (address[] memory) {
        return s_funders;
    }

    function getFunder(uint256 index) external view returns (address) {
        return s_funders[index];
    }

    function getAddressToAmountFunded(address funder)
        external
        view
        returns (uint256)
    {
        return s_addressToAmountFunded[funder];
    }

    function getPriceFeed() external view returns (AggregatorV3Interface) {
        return s_priceFeed;
    }
}
