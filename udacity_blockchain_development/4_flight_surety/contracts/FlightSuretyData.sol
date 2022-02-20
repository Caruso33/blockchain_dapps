pragma solidity ^0.4.25;

import "../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";

// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v2.0.1/contracts/math/SafeMath.sol";

contract FlightSuretyData {
    using SafeMath for uint256;

    /********************************************************************************************/
    /*                                       DATA VARIABLES                                     */
    /********************************************************************************************/

    address private contractOwner; // Account used to deploy contract
    bool private operational = true; // Blocks all state changes throughout the contract if false

    uint256 authorizedContractCount = 0; // Number of contracts authorized to operate the contract
    mapping(address => bool) private authorizedContracts;

    struct Airline {
        string name;
        address account;
        bool isRegistered;
        bool isActive;
        uint256 votes;
    }

    uint256 activeAirlineCount = 0;
    mapping(address => Airline) airlines;
    mapping(address => mapping(address => bool)) airlineRegistrationVotes;

    /********************************************************************************************/
    /*                                       EVENT DEFINITIONS                                  */
    /********************************************************************************************/

    event AirlineRegistered(address newAirline, string name);
    event AirlineRegistrationVoted(address newAirline, address voter);
    event AuthorizedAirline(address airline, string name);

    /**
     * @dev Constructor
     *      The deploying account becomes contractOwner
     */
    constructor() public {
        contractOwner = msg.sender;
    }

    /********************************************************************************************/
    /*                                       FUNCTION MODIFIERS                                 */
    /********************************************************************************************/

    // Modifiers help avoid duplication of code. They are typically used to validate something
    // before a function is allowed to be executed.

    /**
     * @dev Modifier that requires the "operational" boolean variable to be "true"
     *      This is used on all state changing functions to pause the contract in
     *      This is used on all state changing functions to pause the contract in
     *      This is used on all state changing functions to pause the contract in
     *      the event there is an issue that needs to be fixed
     */
    modifier requireIsOperational() {
        require(operational, "Contract is currently not operational");
        _; // All modifiers require an "_" which indicates where the function body will be added
    }

    /**
     * @dev Modifier that requires the "ContractOwner" account to be the function caller
     */
    modifier requireContractOwner() {
        require(msg.sender == contractOwner, "Caller is not contract owner");
        _;
    }

    // modifier requireAirlineAuthorized () {
    //     require(, "Airline is not authorized");
    //     _;
    // }

    /**
     * @dev Modifier that requires the sender account to be one of the authorized accounts
     */
    modifier isCallerAuthorized() {
        require(authorizedContracts[msg.sender], "Caller is not authorized");
        _;
    }

    /********************************************************************************************/
    /*                                       UTILITY FUNCTIONS                                  */
    /********************************************************************************************/

    /**
     * @dev Get operating status of contract
     *
     * @return A bool that is the current operating status
     */
    function isOperational() public view returns (bool) {
        return operational;
    }

    /**
     * @dev Sets contract operations on/off
     *
     * When operational mode is disabled, all write transactions except for this one will fail
     */
    function setOperatingStatus(bool mode) external requireContractOwner {
        operational = mode;
    }

    function isAirlineRegistered(address potentialAirlineAddress)
        external
        view
        returns (bool)
    {
        Airline memory airline = airlines[potentialAirlineAddress];
        return airline.isRegistered && airline.isActive;
    }

    function isAirlineActive(address potentialAirlineAddress)
        external
        view
        returns (bool)
    {
        Airline memory airline = airlines[potentialAirlineAddress];
        return airline.isRegistered && airline.isActive;
    }

    /********************************************************************************************/
    /*                                     CALLER ACCESS MANAGEMENT                             */
    /********************************************************************************************/

    function authorizeCaller(address contractAddress)
        external
        requireContractOwner
    {
        authorizedContracts[contractAddress] = true;
        if (!authorizedContracts[contractAddress]) {
            authorizedContractCount.add(1);
        }
    }

    function deauthorizeCaller(address contractAddress)
        external
        requireContractOwner
    {
        delete authorizedContracts[contractAddress];
    }

    function isAuthorizedCaller(address contractAddress)
        external
        view
        returns (bool)
    {
        return authorizedContracts[contractAddress];
    }

    /********************************************************************************************/
    /*                                     SMART CONTRACT FUNCTIONS                             */
    /********************************************************************************************/

    /**
     * @dev Add an airline to the registration queue
     *      Can only be called from FlightSuretyApp contract
     *
     */
    function registerAirline(string name, address newAirlineAccount)
        external
        requireIsOperational
        isCallerAuthorized
    {
        require(
            !airlines[newAirlineAccount].isRegistered,
            "Airline is already registered"
        );
        require(
            !airlineRegistrationVotes[newAirlineAccount][msg.sender],
            "Airline has already been voted for"
        );

        airlineRegistrationVotes[newAirlineAccount][msg.sender] = true;

        // airline is not yet instantiated
        if (airlines[newAirlineAccount].votes == 0) {
            // the first 3 airlines are registered automatically
            // after that, the voting mechanism decides which additional airline gets registered
            bool isRegistered = activeAirlineCount < 4 ? true : false;

            Airline memory newAirline = Airline({
                name: name,
                account: newAirlineAccount,
                isRegistered: isRegistered,
                isActive: false,
                votes: 0
            });

            airlines[newAirlineAccount] = newAirline;

            emit AirlineRegistered(newAirlineAccount, name);
        }

        airlines[newAirlineAccount].votes.add(1);
        emit AirlineRegistrationVoted(newAirlineAccount, msg.sender);
    }

    /**
     * @dev Buy insurance for a flight
     *
     */
    function buy() external payable {}

    /**
     *  @dev Credits payouts to insurees
     */
    function creditInsurees() external pure {}

    /**
     *  @dev Transfers eligible payout funds to insuree
     *
     */
    function pay() external pure {}

    /**
     * @dev Initial funding for the insurance. Unless there are too many delayed flights
     *      resulting in insurance payouts, the contract should be self-sustaining
     *
     */
    function fund() public payable {}

    function getFlightKey(
        address airline,
        string memory flight,
        uint256 timestamp
    ) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(airline, flight, timestamp));
    }

    /**
     * @dev Fallback function for funding smart contract.
     *
     */
    function() external payable {
        fund();
    }
}
