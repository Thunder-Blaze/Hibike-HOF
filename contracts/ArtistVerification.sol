// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ArtistVerification is ERC721URIStorage, Ownable(msg.sender) {
    uint256 private _tokenIds;
    mapping(address => bool) public verifiedArtists;

    constructor() ERC721("VerifiedArtist", "VART") {}

    function mintArtistNFT(address artist, string memory tokenURI) public onlyOwner returns (uint256) {
        require(!verifiedArtists[artist], "Artist is already verified");

        _tokenIds++;
        uint256 newItemId = _tokenIds;
        _mint(artist, newItemId);
        _setTokenURI(newItemId, tokenURI);
        verifiedArtists[artist] = true;

        return newItemId;
    }

    function isVerified(address artist) public view returns (bool) {
        return verifiedArtists[artist];
    }
}