//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./Token.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Exchange is Ownable {
    address public feeAccount;
    uint256 public feePercent;

    address constant ETHER = address(0);

    mapping(address => mapping(address => uint256)) public balances;

    uint256 public orderCount;
    mapping(uint256 => Order) public orders;

    struct Order {
        uint256 id;
        address user;
        address tokenGet;
        uint256 amountGet;
        address tokenGive;
        uint256 amountGive;
        uint256 timestmap;
    }

    // Events
    event DepositEvent(
        address token,
        address user,
        uint256 amount,
        uint256 balance
    );
    event WithdrawalEvent(
        address token,
        address user,
        uint256 amount,
        uint256 balance
    );
    event MakeOrderEvent(
        uint256 id,
        address user,
        address tokenGet,
        uint256 amountGet,
        address tokenGive,
        uint256 amountGive,
        uint256 timestmap
    );

    // methods
    constructor(address _feeAccount, uint256 _feePercent) {
        feeAccount = _feeAccount;
        feePercent = _feePercent;
    }

    function depositEther() public payable {
        require(msg.value > 0, "Amount must be greater than 0");
        balances[ETHER][msg.sender] += msg.value;
        emit DepositEvent(
            ETHER,
            msg.sender,
            msg.value,
            balances[ETHER][msg.sender]
        );
    }

    function withdrawEther(uint256 _amount) public {
        require(_amount > 0, "Amount must be greater than 0");
        require(
            _amount <= balances[ETHER][msg.sender],
            "Amount must be less than or equal to ether balance"
        );
        balances[ETHER][msg.sender] -= _amount;
        payable(msg.sender).transfer(_amount);
        emit WithdrawalEvent(
            ETHER,
            msg.sender,
            _amount,
            balances[ETHER][msg.sender]
        );
    }

    function depositToken(address _token, uint256 _amount) public {
        require(
            _token != ETHER,
            "No ether should be sent with this transaction"
        );
        require(_amount > 0, "Amount must be greater than 0");
        require(
            Token(_token).transferFrom(msg.sender, address(this), _amount),
            "Depositing of token failed"
        );
        balances[_token][msg.sender] += _amount;
        emit DepositEvent(
            _token,
            msg.sender,
            _amount,
            balances[_token][msg.sender]
        );
    }

    function withdrawToken(address _token, uint256 _amount) public {
        require(_amount > 0, "Amount must be greater than 0");
        require(
            _token != ETHER,
            "No ether should withdrawn with this transaction"
        );
        require(
            _amount <= balances[_token][msg.sender],
            "Amount must be less than or equal to token balance"
        );
        balances[_token][msg.sender] -= _amount;
        require(
            Token(_token).transfer(msg.sender, _amount),
            "Withdrawing of token failed"
        );

        emit WithdrawalEvent(
            _token,
            msg.sender,
            _amount,
            balances[_token][msg.sender]
        );
    }

    function balanceOf(address _token, address _user)
        public
        view
        returns (uint256 balance)
    {
        return balances[_token][_user];
    }

    function makeOrder(
        address _tokenGet,
        uint256 _amountGet,
        address _tokenGive,
        uint256 _amountGive
    ) public {
        orderCount += 1;
        Order memory order = Order(
            orderCount,
            msg.sender,
            _tokenGet,
            _amountGet,
            _tokenGive,
            _amountGive,
            block.timestamp
        );
        orders[orderCount] = order;
        emit MakeOrderEvent(
            orderCount,
            msg.sender,
            _tokenGet,
            _amountGet,
            _tokenGive,
            _amountGive,
            block.timestamp
        );
    }

    function cancelOrder() public {}

    function fillOrder() public {}

    function chargeFee() public {}

    fallback() external {
        revert();
    }
}
