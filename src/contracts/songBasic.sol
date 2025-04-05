// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract SongRegistryLite {
    struct Song {
        string ipfsCID;      // Folder CID
        address uploader;
        uint256 likes;
    }

    Song[] public songs;
    mapping(uint256 => mapping(address => bool)) public hasLiked;

    event SongUploaded(uint256 indexed songId, address indexed uploader, string ipfsCID);
    event SongLiked(uint256 indexed songId, address indexed liker);

    function uploadSong(string memory _cid) public {
        songs.push(Song({
            ipfsCID: _cid,
            uploader: msg.sender,
            likes: 0
        }));

        emit SongUploaded(songs.length - 1, msg.sender, _cid);
    }

    function likeSong(uint256 _songId) public {
        require(_songId < songs.length, "Invalid song ID");
        require(!hasLiked[_songId][msg.sender], "Already liked");

        hasLiked[_songId][msg.sender] = true;
        songs[_songId].likes += 1;

        emit SongLiked(_songId, msg.sender);
    }

    function getSong(uint256 _id) public view returns (Song memory) {
        require(_id < songs.length, "Invalid song ID");
        return songs[_id];
    }

    function getAllSongs() public view returns (Song[] memory) {
        return songs;
    }

    function getSongCount() public view returns (uint256) {
        return songs.length;
    }
}
