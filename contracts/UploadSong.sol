// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract UploadSong {
    struct Song {
        string title;
        string ipfsHash;
        address uploader;
    }

    Song[] public songs;

    event SongUploaded(string title, string ipfsHash, address indexed uploader);

    function uploadSong(string memory _title, string memory _ipfsHash) public {
        songs.push(Song(_title, _ipfsHash, msg.sender));
        emit SongUploaded(_title, _ipfsHash, msg.sender);
    }

    function getSong(uint256 index) public view returns (string memory, string memory, address) {
        require(index < songs.length, "Invalid index");
        Song memory s = songs[index];
        return (s.title, s.ipfsHash, s.uploader);
    }

    function totalSongs() public view returns (uint256) {
        return songs.length;
    }
}
