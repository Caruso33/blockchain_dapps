pragma solidity ^0.4.25;
// pragma experimental ABIEncoderV2;

import "../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";

// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v2.0.1/contracts/math/SafeMath.sol";

contract FlightSuretyData {
    using SafeMath for uint256;

    /********************************************************************************************/
    /*                                       DATA VARIABLES                                     */
    /********************************************************************************************/

    struct Airline {
        string name;
        address account;
        // registered through voting (automatically if less than 4 airlines) and up to provide funding
        bool isRegistered;
        // funded and active
        bool isActive;
        // if more than 3 airlines exist, they have to vote in order to let other airlines join the contract
        uint256 votes;
        uint256 insuranceBalance;
    }

    struct Insuree {
        address account;
        uint256 insuranceAmount;
        bool isCredited;
    }

    struct Flight {
        string name;
        uint8 statusCode;
        uint256 registeredTimestamp;
        uint256 freezeTimestamp;
        uint256 lastUpdatedTimestamp;
        address airline;
        uint256 insurancePrice;
        address[] insureeAddresses;
        mapping(address => Insuree) insurees;
    }

    // general vars
    bool private operational = true; // Blocks all state changes throughout the contract if false
    address private contractOwner; // Account used to deploy contract

    uint256 authorizedContractCount = 0; // Number of contracts authorized to operate the contract
    mapping(address => bool) private authorizedContracts; // allowed to call the data contract

    uint256 initialAirlineFunding = 1 ether; // what airlines have to bring in initially
    uint256 registeredAirlineCount = 0; // Number of airlines registered
    uint256 activeAirlineCount = 0; // Number of airlines registered and active
    mapping(address => Airline) airlines;
    mapping(address => mapping(address => bool)) airlineRegistrationVotes;

    mapping(bytes32 => uint256) registeredPayouts;

    uint256 flightCount = 0; // Number of flights
    mapping(bytes32 => Flight) flights;

    /********************************************************************************************/
    /*                                       EVENT DEFINITIONS                                  */
    /********************************************************************************************/

    event AirlineCreated(address airlineAddress, string airlineName);
    event AirlineRegistered(
        address airlineAddress,
        string airlineName,
        uint256 registeredAirlineCount
    );
    event AirlineRegistrationVoted(
        address airlineAddress,
        string airlineName,
        address voter
    );
    event AirlineFunded(address airlineAddress, string airlineName);

    event FlightRegistered(
        address airlineAddress,
        string airlineName,
        string flightName,
        uint256 timestamp,
        uint256 insurancePrice
    );
    event FlightFrozen(
        address airlineAddress,
        string airlineName,
        string flightName,
        uint256 timestamp
    );
    event FlightInsuranceBought(
        address airlineAddress,
        string airlineName,
        string flightName,
        uint256 timestamp,
        address insureeAddress,
        uint256 insurancePrice
    );
    event CreditInsuree(
        address airlineAddress,
        string airlineName,
        string flightName,
        address insureeAddress,
        uint256 insuranceAmount
    );
    event PayoutInsurance(
        string flightName,
        address insureeAddress,
        uint256 payoutAmount
    );

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

    modifier requireAirlineExist(address airlineAddress) {
        require(
            airlines[airlineAddress].account != address(0),
            "Airline does not exists"
        );
        _;
    }

    modifier requireAirlineRegistered(address airlineAddress) {
        require(
            airlines[airlineAddress].isRegistered,
            "Airline is not registered"
        );
        _;
    }

    modifier requireAirlineAuthorized() {
        require(
            airlines[msg.sender].isActive,
            "Airline is not authorized, i.e. active through funding"
        );
        _;
    }

    /**
     * @dev Modifier that requires the sender account to be one of the authorized accounts
     */
    modifier requireCallerAuthorized() {
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

    function isAirlineRegistered(address airlineAddress)
        external
        view
        returns (bool)
    {
        Airline storage airline = airlines[airlineAddress];
        return airline.isRegistered;
    }

    function isAirlineActive(address airlineAddress)
        external
        view
        returns (bool)
    {
        Airline storage airline = airlines[airlineAddress];
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
            authorizedContractCount = authorizedContractCount.add(1);
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

    // getter functions
    function getInitialFunding() public view returns (uint256) {
        return initialAirlineFunding;
    }

    function getRegisteredAirlineCount() public view returns (uint256) {
        return registeredAirlineCount;
    }

    function getActiveAirlineCount() public view returns (uint256) {
        return activeAirlineCount;
    }

    function getAirline(address airlineAddress)
        public
        view
        returns (
            string,
            address,
            bool,
            bool,
            uint256,
            uint256
        )
    {
        Airline storage airline = airlines[airlineAddress];
        return (
            airline.name,
            airline.account,
            airline.isRegistered,
            airline.isActive,
            airline.votes,
            airline.insuranceBalance
        );
    }

    function getFlight(address airlineAddress, string flightName)
        public
        view
        returns (
            string,
            uint8,
            uint256,
            uint256,
            uint256,
            address,
            uint256,
            address[]
        )
    {
        bytes32 flightKey = getKey(airlineAddress, flightName, 0);
        Flight storage flight = flights[flightKey];
        return (
            flight.name,
            flight.statusCode,
            flight.registeredTimestamp,
            flight.freezeTimestamp,
            flight.lastUpdatedTimestamp,
            flight.airline,
            flight.insurancePrice,
            flight.insureeAddresses
        );
    }

    function getInsuree(
        address airlineAddress,
        string flightName,
        address insureeAddress
    )
        public
        view
        returns (
            address,
            uint256,
            bool
        )
    {
        bytes32 flightKey = getKey(airlineAddress, flightName, 0);
        Flight storage flight = flights[flightKey];

        Insuree storage insuree = flight.insurees[insureeAddress];

        return (insuree.account, insuree.insuranceAmount, insuree.isCredited);
    }

    /**
     * @dev Add an airline to the registration queue
     *      Can only be called from FlightSuretyApp contract
     *
     */
    function createAirline(string airlineName, address airlineAddress)
        external
        requireIsOperational
        requireCallerAuthorized
        returns (uint256)
    {
        require(
            airlines[airlineAddress].account == address(0),
            "Airline already exists"
        );

        // the first 3 airlines are registered automatically
        // after that, the voting mechanism decides which additional airline gets registered
        bool isRegistered = registeredAirlineCount < 3 ? true : false;

        Airline memory airline = Airline({
            name: airlineName,
            account: airlineAddress,
            isRegistered: isRegistered,
            isActive: false,
            votes: 0,
            insuranceBalance: 0
        });

        airlines[airlineAddress] = airline;

        emit AirlineCreated(airlineAddress, airlineName);

        if (isRegistered) {
            registeredAirlineCount = registeredAirlineCount.add(1);
            emit AirlineRegistered(
                airlineAddress,
                airlineName,
                registeredAirlineCount
            );
        }

        return registeredAirlineCount;
    }

    /**
     * @dev Initial funding for the insurance. Unless there are too many delayed flights
     *      resulting in insurance payouts, the contract should be self-sustaining
     *
     */
    function provideAirlinefunding(address airlineAddress)
        public
        payable
        requireIsOperational
        requireAirlineExist(airlineAddress)
        requireAirlineRegistered(airlineAddress)
        returns (uint256)
    {
        Airline storage airline = airlines[airlineAddress];

        if (!airline.isActive) {
            require(msg.value >= initialAirlineFunding, "Insufficient funding");

            airline.isActive = true;
            activeAirlineCount = activeAirlineCount.add(1);
            emit AirlineFunded(airlineAddress, airline.name);
        }

        airline.insuranceBalance = airline.insuranceBalance.add(msg.value);

        return airline.insuranceBalance;
    }

    function voteForAirline(address airlineAddress)
        external
        requireAirlineExist(airlineAddress)
        requireAirlineAuthorized
        returns (uint256)
    {
        Airline storage airline = airlines[airlineAddress];

        require(
            !airlineRegistrationVotes[airlineAddress][msg.sender],
            "Airline has already been voted for by sender"
        );

        airlineRegistrationVotes[airlineAddress][msg.sender] = true;

        airline.votes = airline.votes.add(1);

        emit AirlineRegistrationVoted(airlineAddress, airline.name, msg.sender);

        // register if at least half or more authorizedContracts voted for the airline
        if (airline.votes * 2 > activeAirlineCount) {
            airline.isRegistered = true;

            registeredAirlineCount = registeredAirlineCount.add(1);

            emit AirlineRegistered(
                airlineAddress,
                airline.name,
                registeredAirlineCount
            );
        }

        return airline.votes;
    }

    // function drainAirlineFunding(address airlineAddress) {
    //     Airline storage airline = airlines[airlineAddress];

    //     require(
    //         airline.insuranceBalance >= initialAirlineFunding,
    //         "Not enough insurance funds to drain account"
    //     );
    //     uint256 amount = airline;
    //     msg.sender.transfer(amount);
    // }

    /**
     * @dev Registers a new flight to buy insurance for
     *
     */
    function registerFlightForInsurance(
        address airlineAddress,
        string flightName,
        uint256 insurancePrice
    ) external requireIsOperational requireAirlineAuthorized {
        Airline storage airline = airlines[airlineAddress];
        require(airline.account != address(0), "Airline does not exist");
        require(
            airlineAddress == msg.sender,
            "Cannot register flight insurance for another airline"
        );

        uint256 timestamp = block.timestamp;
        bytes32 flightKey = getKey(airlineAddress, flightName, 0);
        address[] memory emptyArray;

        Flight memory flight = Flight({
            name: flightName,
            statusCode: 0,
            registeredTimestamp: timestamp,
            freezeTimestamp: 0,
            lastUpdatedTimestamp: timestamp,
            airline: airlineAddress,
            insurancePrice: insurancePrice,
            insureeAddresses: emptyArray
        });

        flights[flightKey] = flight;

        emit FlightRegistered(
            airlineAddress,
            airline.name,
            flightName,
            timestamp,
            insurancePrice
        );
    }

    function freezeFlight(address airlineAddress, string flightName)
        external
        requireIsOperational
        requireAirlineAuthorized
    {
        Airline storage airline = airlines[airlineAddress];
        require(
            airline.account == msg.sender,
            "Cannot freeze flight insurance for another airline"
        );

        bytes32 flightKey = getKey(airlineAddress, flightName, 0);

        Flight storage flight = flights[flightKey];

        require(flight.airline != address(0), "Flight does not exist");
        require(flight.freezeTimestamp == 0, "Flight is already frozen");

        uint256 freezeTimestamp = block.timestamp;

        flight.freezeTimestamp = freezeTimestamp;

        emit FlightFrozen(
            airlineAddress,
            airline.name,
            flightName,
            freezeTimestamp
        );
    }

    // /**
    //  * @dev Buy insurance for a flight
    //  *
    //  */
    function buyInsuranceForFlight(address airlineAddress, string flightName)
        external
        payable
        requireIsOperational
    {
        bytes32 flightKey = getKey(airlineAddress, flightName, 0);

        Flight storage flight = flights[flightKey];

        require(flight.airline != address(0), "Flight does not exist");

        require(
            flight.freezeTimestamp == 0,
            "Flight is frozen, it's too late to buy insurance for this flight"
        );

        require(
            flight.insurees[msg.sender].account == address(0),
            "You already bought insurance for this flight"
        );

        require(msg.value >= flight.insurancePrice, "Insufficient amount");

        Insuree memory insuree = Insuree({
            account: msg.sender,
            insuranceAmount: msg.value,
            isCredited: false
        });
        flight.insureeAddresses.push(msg.sender);
        flight.insurees[msg.sender] = insuree;

        if (msg.value > flight.insurancePrice) {
            uint256 overpayedAmount = msg.value.sub(flight.insurancePrice);
            msg.sender.transfer(overpayedAmount);
        }

        emit FlightInsuranceBought(
            airlineAddress,
            airlines[airlineAddress].name,
            flightName,
            block.timestamp,
            msg.sender,
            flight.insurancePrice
        );
    }

    // function creditInsurees(
    //     address airlineAddress,
    //     string flightName,
    //     uint256 timestamp
    // ) external requireIsOperational requireCallerAuthorized {
    //     bytes32 flightKey = getKey(airlineAddress, flightName, timestamp);
    //     Flight storage flight = flights[flightKey];

    // require(flight != 0, "Flight is not registered");
    // if (flight.insurees.length == 0) {
    //     return;
    // }

    // for (uint256 i = 0; i < flight.insureeAddresses.length; i++) {
    //     address insureeAddress = flight.insureeAddresses[i];
    //     Insuree storage insuree = flight.insurees[insureeAddress];

    //     if (!insuree.isCredited) {
    //         bytes32 policyKey = getPolicyKey(insuree.account, flightName);
    //         registeredPayouts[policyKey] = insuree.insuranceAmount;

    //         emit CreditInsuree(
    //             airlineAddress,
    //             airlines[airlineAddress].name,
    //             flightName,
    //             insuree.account,
    //             insuree.insuranceAmount
    //         );
    //     }
    // }
    // }

    /**
     *  @dev Transfers eligible payout funds to insuree
     *
     */
    // function payoutInsurance(string flightName, address insureeAddress)
    //     external
    //     payable
    // {
    //     bytes32 policyKey = getKey(insureeAddress, flightName, 0);
    //     uint256 payoutAmount = registeredPayouts[policyKey];

    //     if (payoutAmount > 0) {
    //         registeredPayouts[policyKey] = 0;
    //         insureeAddress.transfer(payoutAmount);

    //         emit PayoutInsurance(flightName, insureeAddress, payoutAmount);
    //     }
    // }

    function getKey(
        address keyAddress,
        string memory key,
        uint256 value
    ) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(keyAddress, key, value));
    }

    /**
     * @dev Fallback function for funding smart contract.
     *
     */
    // function() external payable {
    //     provideAirlinefunding();
    // }
}
