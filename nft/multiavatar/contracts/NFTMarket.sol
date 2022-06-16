// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "hardhat/console.sol";

interface NFTMarket is IERC721 {
    struct MarketItem {
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
        address[] prevOwners;
    }

    event MarketItemCreated(
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool sold
    );

    /* Mints a token and lists it in the marketplace */
    function createToken(string memory tokenURI, uint256 price)
        external
        payable
        returns (uint256);

    /* allows someone to resell a token they have purchased */
    function resellToken(uint256 tokenId, uint256 price) external payable;

    /* Creates the sale of a marketplace item */
    /* Transfers ownership of the item, as well as funds between parties */
    function createMarketSale(uint256 tokenId) external payable;

    /* Revokes selling rights of a marketplace item */
    function revokeMarketItem(uint256 tokenId) external;

    /* Burns a token and removes it from marketplace */
    function burnToken(uint256 tokenId) external;

    /* Updates the listing price of the contract */
    function updateListingPrice(uint256 _listingPrice) external;

    // ERC721URIStorage extension function
    function tokenURI(uint256 tokenId) external view returns (string memory);

    /* Returns all unsold market items */
    function fetchMarketItems() external view returns (MarketItem[] memory);

    /* Returns all sold market items */
    function fetchSoldMarketItems() external view returns (MarketItem[] memory);

    /* Returns only items that a user has purchased */
    function fetchMyNFTs() external view returns (MarketItem[] memory);

    /* Returns only items a user has listed */
    function fetchNFTsCreated() external view returns (MarketItem[] memory);

    /* Returns only items a user is selling */
    function fetchNFTsSelling() external view returns (MarketItem[] memory);

    /* Returns the listing price of the contract */
    function getListingPrice() external view returns (uint256);
}
