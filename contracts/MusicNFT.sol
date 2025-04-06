// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MusicNFT is ERC721URIStorage, Ownable {
    uint256 private _tokenIds;
    uint256 public mintPrice = 0.01 ether;
    mapping(uint256 => string) private _tokenURIs;

    event MusicNFTMinted(uint256 tokenId, address owner, string tokenURI);

    constructor() ERC721("Music NFT", "MNFT") Ownable(msg.sender) {}

    function mintMusic(string memory tokenURI) public payable returns (uint256) {
        require(msg.value >= mintPrice, "Insufficient payment");
        
        _tokenIds++;
        uint256 newTokenId = _tokenIds;
        
        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        
        emit MusicNFTMinted(newTokenId, msg.sender, tokenURI);
        
        return newTokenId;
    }

    function setMintPrice(uint256 newPrice) public onlyOwner {
        mintPrice = newPrice;
    }

    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        payable(owner()).transfer(balance);
    }

    function getMintPrice() public view returns (uint256) {
        return mintPrice;
    }
} 