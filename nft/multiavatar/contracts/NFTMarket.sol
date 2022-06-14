// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
// import "@openzeppelin/contracts/token/ERC721/extensions/IERC721URIStorage.sol";
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

    // getters from public vars
    function owner() external returns (address);

    function listingPrice() external returns (uint256);

    // ERC721URIStorage extension function
    function tokenURI(uint256 tokenId) external returns (string memory);

    // /* Updates the listing price of the contract */
    function updateListingPrice(uint256 _listingPrice) external;

    // /* Returns the listing price of the contract */
    function getListingPrice() external returns (uint256);

    // /* Mints a token and lists it in the marketplace */
    function createToken(string memory tokenURI, uint256 price)
        external
        payable
        returns (uint256);

    /* allows someone to resell a token they have purchased */
    function resellToken(uint256 tokenId, uint256 price) external payable;

    /* Creates the sale of a marketplace item */
    /* Transfers ownership of the item, as well as funds between parties */
    function createMarketSale(uint256 tokenId) external payable;

    // /* Returns all unsold market items */
    function fetchMarketItems() external returns (MarketItem[] memory);

    // /* Returns all sold market items */
    function fetchSoldMarketItems() external view returns (MarketItem[] memory);

    // /* Returns only items that a user has purchased */
    function fetchMyNFTs() external returns (MarketItem[] memory);

    // /* Returns only items a user has listed */
    function fetchNFTsCreated() external returns (MarketItem[] memory);

    // /* Returns only items a user is selling */
    function fetchNFTsSelling() external returns (MarketItem[] memory);
}
