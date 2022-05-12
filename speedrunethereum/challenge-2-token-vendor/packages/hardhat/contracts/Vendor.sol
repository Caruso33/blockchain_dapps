pragma solidity 0.8.4;
// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/access/Ownable.sol";
import "./YourToken.sol";
import "hardhat/console.sol";

contract Vendor is Ownable {
    uint256 public constant tokensPerEth = 100;

    event BuyTokens(address buyer, uint256 amountOfETH, uint256 amountOfTokens);

    YourToken public yourToken;

    constructor(address tokenAddress) {
        yourToken = YourToken(tokenAddress);
    }

    // ToDo: create a payable buyTokens() function:
    function buyTokens() public payable {
        uint256 howManyToken = (msg.value * tokensPerEth);

        yourToken.transfer(msg.sender, howManyToken);

        emit BuyTokens(msg.sender, msg.value, howManyToken);
    }

    // ToDo: create a withdraw() function that lets the owner withdraw ETH
    function withdraw() public {
        (bool success, ) = owner().call{value: address(this).balance}("");
        require(success, "Unable to withdraw");
    }

    // ToDo: create a sellTokens() function:
    function sellTokens(uint256 amount) public {
        yourToken.transferFrom(msg.sender, address(this), amount);

        (bool success, ) = payable(msg.sender).call{
            value: amount / tokensPerEth
        }("");
        require(success, "Could not send ether to sender");
    }
}
