// SPDX-License-Identifier: MIT

pragma solidity ^0.8.8;
// ERROR
error StrtM__titleExist();
error StrtM__spaceIsFull();
error StrtM__streamed();
error StrtM__bountyFinished();
error StrtM__totalStreamsEmpty();
error StrtM__EmptyInputs();
error StrtM__NotAuthorized();

contract StrtM {
    address immutable i_owner;
    mapping(address => uint256) private s_allocatedSpace;
    mapping(address => uint256) private s_UserStorageSpace;
    mapping(string => uint256) private s_totalamount;
    mapping(string => uint256) private s_tokenAmountPerMusic;
    mapping(string => uint256) private s_totalStreams;
    mapping(string => mapping(address => bool)) private s_streams;
    mapping(string => bool) private s_title;
    uint256 public s_allocatedSpaceFundz;

    // EVENTS
    event musicCreated(
        address indexed sender,
        uint256 totalamount,
        string indexed title
    );
    event bountyPaid(
        address indexed reciver,
        uint256 amount,
        string indexed title
    );
    event allocatedSpaceFundz(address indexed from, uint256 amount);

    constructor() {
        i_owner = msg.sender;
    }

    // msg.sender
    function createMusic(
        string memory title,
        uint256 totalStreams,
        uint256 storageSpace
    ) external payable {
        uint256 newStorage = s_UserStorageSpace[msg.sender] + storageSpace;
        if (
            newStorage > s_allocatedSpace[msg.sender] &&
            s_allocatedSpace[msg.sender] > 0
        ) {
            revert StrtM__spaceIsFull();
        }
        bytes memory stringarr = bytes(title);
        if (
            stringarr.length == 0 ||
            msg.value < 0 ||
            totalStreams < 0 ||
            storageSpace < 0
        ) {
            revert StrtM__EmptyInputs();
        }
        if (s_title[title]) {
            revert StrtM__titleExist();
        }
        // initailize
        if (s_allocatedSpace[msg.sender] <= 0) {
            s_allocatedSpace[msg.sender] = 20;
        }
        //
        s_UserStorageSpace[msg.sender] = storageSpace;
        s_totalamount[title] = msg.value;
        s_totalStreams[title] = totalStreams;
        s_title[title] = true;
        s_UserStorageSpace[msg.sender] = newStorage;
        s_tokenAmountPerMusic[title] = msg.value / totalStreams;
        emit musicCreated(msg.sender, msg.value, title);
    }

    function claimBounty(string memory title) external {
        if (s_streams[title][msg.sender]) {
            revert StrtM__streamed();
        }
        if (s_totalamount[title] <= 0 || s_totalStreams[title] <= 0) {
            //check if amount still exists, then it is still avaliable
            revert StrtM__bountyFinished();
        }
        uint256 perAmount = s_tokenAmountPerMusic[title];
        s_streams[title][msg.sender] = true;
        s_totalamount[title] -= perAmount;
        s_totalStreams[title] -= 1;
        (bool success, ) = payable(msg.sender).call{value: perAmount}("");
        require(success, "Sending Failed");
        emit bountyPaid(msg.sender, perAmount, title);
    }

    function increaseSpace() external payable {
        uint256 amount = (msg.value / 1000000000000000000) * 20;
        s_allocatedSpace[msg.sender] += amount;
        s_allocatedSpaceFundz += amount;
        emit allocatedSpaceFundz(msg.sender, msg.value);
    }

    function withdraw() external payable {
        if (msg.sender != i_owner) {
            revert StrtM__NotAuthorized();
        }
        uint256 amount = s_allocatedSpaceFundz;
        s_allocatedSpaceFundz = 0;
        (bool success, ) = payable(i_owner).call{value: amount}("");
        require(success, "Sending Failed");
        emit allocatedSpaceFundz(i_owner, amount);
    }

    /*@GET */
    function getAllocatedSpace() public view returns (uint256) {
        return s_allocatedSpace[msg.sender];
    }

    function getTotalamount(string memory title) public view returns (uint256) {
        return s_totalamount[title];
    }

    function getAmountPerMusic(
        string memory title
    ) public view returns (uint256) {
        return s_tokenAmountPerMusic[title];
    }

    function getTotalStreams(
        string memory title
    ) public view returns (uint256) {
        return s_totalStreams[title];
    }

    function getAllocatedSpaceFundz() public view returns (uint256) {
        return s_allocatedSpaceFundz;
    }

    function checkifStreamed(string memory title) public view returns (bool) {
        return s_streams[title][msg.sender];
    }

    function getOwner() public view returns (address) {
        return i_owner;
    }
}

// event transferred to contract successfully --music
// event transferred to user successfully  --streamed
// upgrade allocated space
// withdraw s_allocatedSpaceFundz
// so meaning we have to use the address from web3, since it is indexing only address
