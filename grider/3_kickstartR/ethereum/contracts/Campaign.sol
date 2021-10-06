// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract CampaignFactory {
    Campaign[] public deployedCampaigns;

    function createCampaign(uint256 minimum) public {
        Campaign newCampaign = new Campaign(minimum, msg.sender);
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (Campaign[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint256 value;
        address payable recipient;
        bool complete;
        uint256 approvalsCount;
        mapping(address => bool) approvals;
    }
    
    mapping(uint256 => Request) public requests;
    uint256 public requestsCount;

    address public manager;
    uint256 public minimumContribution;

    mapping(address => bool) approvers;
    uint256 public approversCount;

    modifier restricted() {
        require(msg.sender == manager, "Sender must be the owner!");
        _;
    }

    constructor(uint256 minimum, address creator) {
        manager = creator;
        minimumContribution = minimum;
    }

    function contribute() public payable {
        require(
            msg.value >= minimumContribution,
            "Value must be at least the minimum contribution!"
        );

        if (!approvers[msg.sender]) {
            approvers[msg.sender] = true;
            approversCount++;
        }
    }

    function createRequest(
        string memory description,
        uint256 value,
        address payable recipient
    ) public restricted {
        Request storage r = requests[requestsCount++];
        r.description = description;
        r.value = value;
        r.recipient = recipient;
        r.complete = false;
        r.approvalsCount = 0;
    }

    function approveRequest(uint256 index) public {
        Request storage request = requests[index];

        require(
            approvers[msg.sender],
            "Sender is no approver, contribute first!"
        );
        require(!request.approvals[msg.sender], "Sender has already approved!");

        request.approvals[msg.sender] = true;
        request.approvalsCount++;
    }

    function finalizeRequest(uint256 index) public restricted {
        Request storage request = requests[index];

        require(
            address(this).balance >= request.value,
            "Insufficient funds for request!"
        );

        require(
            request.approvalsCount > (approversCount / 2),
            "Not enough approvals!"
        );
        require(!request.complete, "Request already completed!");

        request.recipient.transfer(request.value);
        request.complete = true;
    }

    function getSummary()
        public
        view
        returns (
            uint256,
            uint256,
            uint256,
            uint256,
            address
        )
    {
        return (
            minimumContribution,
            address(this).balance,
            requestsCount,
            approversCount,
            manager
        );
    }
}
