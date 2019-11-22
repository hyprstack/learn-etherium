pragma solidity ^0.5.12;

contract SpmintToken {
    // Constructor
    // Set the total number of tokens
    // Read the total number of tokens
    uint256 public totalSupply; // declare a variable

    string public name = 'Spmint Token'; // add token name
    string public symbol = 'Spnt'; // add symbol
    string public standard = 'Spmint Token v1.0'; // add standard

    mapping(address => uint256) public balanceOf; // mapping is an associative array - key:value store
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);

    // is run at compile time - arguments are passed in at the migration definition
    constructor(uint256 _initialSupply) public {
        balanceOf[msg.sender] = _initialSupply; // allocate the initial supply
        totalSupply = _initialSupply; // state variable - accessable to the entire contract
    }

    function transfer(address _to, uint256 _value) public returns (bool success) {
        // Trigger exception if account doesn't have enough
        require(balanceOf[msg.sender] >= _value); // require - if this evaluates to true then continue execution, otherwise throw an exception

        // Transfer the balance
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;

        // Trigger transfer event
        emit Transfer(msg.sender, _to, _value);

        // Return a boolean
        return true;
    }

    // Delegated Transfers
    // Allow our account to approve a transfer
    function approve(address _spender, uint256 _value) public returns (bool success) {
        // set allowance
        allowance[msg.sender][_spender] = _value;

        // trigger approve event
        emit Approval(msg.sender, _spender, _value);

        return true;
    }

    // Handle the delegated transfer - seal a transfer from one account to another without the sender initiating the action
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        // require _from has enough tokens
        require(_value <= balanceOf[_from]);
        // require allowance is big enough
        require(_value <= allowance[_from][msg.sender]);
        // call the transfer event
        emit Transfer(_from, _to, _value);
        // change the balance
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        // update the allowance
        allowance[_from][msg.sender] -= _value;
        // return a boolean
        return true;
    }
}
