// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./ZoboToken.sol";

contract ZoboExchange {
    /*
    * Declaring state variables.
    * Track fee account
    */
    address public ownerFeeAccount;
    uint256 public pricePercent;
    uint256 public orderCount;

    // Constructor here
    constructor(address _ownerFeeAccount, uint256 _pricePercent) {
        ownerFeeAccount = _ownerFeeAccount;
        pricePercent = _pricePercent;
    }

    //  Struct for Struct for Order
    struct _Order {
        uint256 id;
        address user;
        address tokenGet;
        uint256 amountGet;
        address tokenGive;
        uint256 amountGive;
        uint256 timestamp;
    }
    
    mapping(address => mapping(address => uint256)) public tokens;
    mapping(uint256 => _Order) public orders;
    mapping(uint256 => bool) public cancelledOrder;
    mapping(uint256 => bool) public filledOrder;

    // Events
    event Deposit(address token, address user, uint256 amount, uint256 balance);
    event Withdraw(address token, address user, uint256 amount, uint256 balance);
    event Order(uint256 id, address user, address tokenGet, uint256 amountGet, address tokenGive, uint256 amountGive, uint256 timestamp);
    event Cancel(uint256 id, address user, address tokenGet, uint256 amountGet, address tokenGive, uint256 amountGive, uint256 timestamp);
    event Trade(uint256 id, address user, address tokenGet, uint256 amountGet, address tokenGive, uint256 amountGive, address creator, uint256 timestamp);

    // Modifier of existing Order
    modifier existingOrder(uint256 _id) {
        require(
            _id > 0 && _id <= orderCount, "Order does not exist"
        );
        _;
    }

    // Check Balances
    function balanceOf(address _token, address _user)
        public view returns (uint256) {
        return tokens[_token][_user];
    }

    // Deposit Tokens
    function depositToken(address _token, uint256 _amount) public {
        require(
            ZoboToken(_token).transferFrom(msg.sender, address(this), _amount), "Token deposit not allowed"
        );
        tokens[_token][msg.sender] += _amount;

        emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }

    // Withdraw Tokens
    function withdrawToken(address _token, uint256 _amount) public {
        require(
            tokens[_token][msg.sender] >= _amount, "Can't complete withdrawer"
        );

        ZoboToken(_token).transfer(msg.sender, _amount);
        tokens[_token][msg.sender] -= _amount;

        emit Withdraw(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }

    // Make Orders
    function makeOrder(address _tokenGet, uint256 _amountGet, address _tokenGive, uint256 _amountGive) public {
        require(
            balanceOf(_tokenGive, msg.sender) >= _amountGive, "Insufficient Token to make Order"
        );

        orderCount++;
        orders[orderCount] = _Order(orderCount, msg.sender, _tokenGet, _amountGet, _tokenGive, _amountGive, block.timestamp);

        emit Order(orderCount, msg.sender, _tokenGet, _amountGet, _tokenGive, _amountGive, block.timestamp);
    }

    // Cancel Order
    function cancelOrder(uint256 _id) public existingOrder(_id) {
        _Order storage _order = orders[_id];

        cancelledOrder[_id] = true;
        require(
            address(_order.user) == msg.sender, "Unauthorized cancellation"
        );
        require(_order.id == _id, "Order doesn't exist");

        emit Cancel(_id, msg.sender, _order.tokenGet, _order.amountGet, _order.tokenGive, _order.amountGive, block.timestamp);
    }

    // Fill Orders and Charge Fees
    function fillOrder(uint256 _id) public existingOrder(_id) {
        require(!filledOrder[_id], "Order can't be filled");
        require(!cancelledOrder[_id], "Order can't be cancelled");

        // Fetch order
        _Order storage _order = orders[_id];

        uint256 _feeAmount = (_order.amountGet * pricePercent) / 100;

        //fillOrder by msg.sender and order created by user
        tokens[_order.tokenGet][msg.sender] =
            tokens[_order.tokenGet][msg.sender] -
            (_order.amountGet + _feeAmount);
        tokens[_order.tokenGet][_order.user] += _order.amountGet;

        // Charge fees
        tokens[_order.tokenGet][ownerFeeAccount] += _feeAmount;
        tokens[_order.tokenGive][_order.user] -= _order.amountGive;
        tokens[_order.tokenGive][msg.sender] += _order.amountGive;

        emit Trade(_order.id, msg.sender, _order.tokenGet, _order.amountGet, _order.tokenGive, _order.amountGive, _order.user, block.timestamp);
        filledOrder[_order.id] = true;
    }
}
