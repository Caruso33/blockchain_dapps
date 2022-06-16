// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "hardhat/console.sol";

error NFTMarket__OnlyContractOwner();
error NFTMarket__PriceOneWeiLeast();
error NFTMarket__ValueNotEqualListingPrice();
error NFTMarket__OnlyTokenOwner();
error NFTMarket__OnlyTokenSeller();
error NFTMarket__OnlyTokenSellerOrOwner();
error NFTMarket__ValueNotEqualTokenPrice();

contract NFTMarket is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    Counters.Counter private _itemsSold;

    address payable owner;

    uint256 listingPrice = 0.001 ether; // matic!

    mapping(uint256 => MarketItem) private idToMarketItem;

    struct MarketItem {
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
        bool burned;
        address[] prevOwners;
    }

    event MarketItemCreated(
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        uint256 timestamp
    );
    event MarketItemSold(
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        uint256 timestamp
    );
    event MarketItemBurned(
        uint256 indexed tokenId,
        address seller,
        uint256 price,
        uint256 timestamp
    );

    modifier onlyOwner() {
        if (msg.sender != owner) revert NFTMarket__OnlyContractOwner();
        _;
    }

    constructor() ERC721("Metaverse Tokens", "METAT") {
        owner = payable(msg.sender);
    }

    /* Mints a token and lists it in the marketplace */
    function createToken(string memory tokenURI, uint256 price)
        public
        payable
        returns (uint256)
    {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        createMarketItem(newTokenId, price);
        return newTokenId;
    }

    function createMarketItem(uint256 tokenId, uint256 price) private {
        if (price <= 0) revert NFTMarket__PriceOneWeiLeast();
        if (msg.value != listingPrice)
            revert NFTMarket__ValueNotEqualListingPrice();

        address[] memory prevOwners = new address[](1);
        prevOwners[0] = msg.sender;
        idToMarketItem[tokenId] = MarketItem(
            tokenId,
            payable(msg.sender),
            payable(address(this)),
            price,
            false,
            false,
            prevOwners
        );

        _transfer(msg.sender, address(this), tokenId);
        emit MarketItemCreated(
            tokenId,
            msg.sender,
            address(this),
            price,
            block.timestamp
        );
    }

    /* allows someone to resell a token they have purchased */
    function resellToken(uint256 tokenId, uint256 price) public payable {
        if (idToMarketItem[tokenId].owner != msg.sender)
            revert NFTMarket__OnlyTokenOwner();
        if (msg.value != listingPrice)
            revert NFTMarket__ValueNotEqualListingPrice();

        idToMarketItem[tokenId].sold = false;
        idToMarketItem[tokenId].price = price;
        idToMarketItem[tokenId].seller = payable(msg.sender);
        idToMarketItem[tokenId].owner = payable(address(this));
        _itemsSold.decrement();

        _transfer(msg.sender, address(this), tokenId);
    }

    /* Creates the sale of a marketplace item */
    /* Transfers ownership of the item, as well as funds between parties */
    function createMarketSale(uint256 tokenId) public payable {
        uint256 price = idToMarketItem[tokenId].price;
        address seller = idToMarketItem[tokenId].seller;
        if (msg.value != price) revert NFTMarket__ValueNotEqualTokenPrice();

        idToMarketItem[tokenId].owner = payable(msg.sender);
        idToMarketItem[tokenId].sold = true;
        idToMarketItem[tokenId].seller = payable(address(0));
        idToMarketItem[tokenId].prevOwners.push(msg.sender);
        _itemsSold.increment();
        _transfer(address(this), msg.sender, tokenId);
        payable(owner).transfer(listingPrice);
        payable(seller).transfer(msg.value);

        emit MarketItemSold(
            tokenId,
            seller,
            msg.sender,
            price,
            block.timestamp
        );
    }

    /* Revokes selling rights of a marketplace item */
    function revokeMarketItem(uint256 tokenId) public {
        if (idToMarketItem[tokenId].seller != msg.sender)
            revert NFTMarket__OnlyTokenSeller();

        idToMarketItem[tokenId].owner = payable(msg.sender);
        idToMarketItem[tokenId].seller = payable(address(0));
        idToMarketItem[tokenId].sold = true;
        _itemsSold.increment();

        _transfer(address(this), msg.sender, tokenId);
    }

    /* Burns a token and removes it from marketplace */
    function burnToken(uint256 tokenId) public {
        if (
            idToMarketItem[tokenId].owner != msg.sender &&
            idToMarketItem[tokenId].seller != msg.sender
        ) revert NFTMarket__OnlyTokenSellerOrOwner();

        _burn(tokenId);
        idToMarketItem[tokenId].owner = payable(address(0));
        idToMarketItem[tokenId].seller = payable(address(0));
        idToMarketItem[tokenId].burned = true;
        if (idToMarketItem[tokenId].sold) {
            _itemsSold.decrement();
        }

        emit MarketItemBurned(
            tokenId,
            msg.sender,
            idToMarketItem[tokenId].price,
            block.timestamp
        );
    }

    /* Updates the listing price of the contract */
    function updateListingPrice(uint256 _listingPrice) public onlyOwner {
        listingPrice = _listingPrice;
    }

    /* Returns all unsold market items */
    function fetchMarketItems() public view returns (MarketItem[] memory) {
        uint256 itemCount = _tokenIds.current();
        uint256 unsoldItemCount = _tokenIds.current() - _itemsSold.current();
        uint256 currentIndex = 0;

        MarketItem[] memory items = new MarketItem[](unsoldItemCount);
        for (uint256 i = 0; i < itemCount; i++) {
            if (idToMarketItem[i + 1].owner == address(this)) {
                uint256 currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    /* Returns the marketitem with the given id */
    function fetchMarketItem(uint256 tokenId)
        public
        view
        returns (MarketItem memory)
    {
        MarketItem memory marketItem = idToMarketItem[tokenId];
        return marketItem;
    }

    /* Returns all sold market items */
    function fetchSoldMarketItems() public view returns (MarketItem[] memory) {
        uint256 itemCount = _tokenIds.current();
        uint256 soldItemCount = _itemsSold.current();
        uint256 currentIndex = 0;

        MarketItem[] memory items = new MarketItem[](soldItemCount);
        for (uint256 i = 0; i < itemCount; i++) {
            if (idToMarketItem[i + 1].sold) {
                uint256 currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    /* Returns only items that a user has purchased */
    function fetchMyNFTs() public view returns (MarketItem[] memory) {
        uint256 totalItemCount = _tokenIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].owner == msg.sender) {
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].owner == msg.sender) {
                uint256 currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    /* Returns only items a user has listed */
    function fetchNFTsCreated() public view returns (MarketItem[] memory) {
        uint256 totalItemCount = _tokenIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (
                idToMarketItem[i + 1].prevOwners[0] == msg.sender &&
                !idToMarketItem[i + 1].burned
            ) {
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (
                idToMarketItem[i + 1].prevOwners[0] == msg.sender &&
                !idToMarketItem[i + 1].burned
            ) {
                uint256 currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    /* Returns only items a user is selling */
    function fetchNFTsSelling() public view returns (MarketItem[] memory) {
        uint256 totalItemCount = _tokenIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].seller == msg.sender) {
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].seller == msg.sender) {
                uint256 currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    /* Returns the listing price of the contract */
    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }
}
