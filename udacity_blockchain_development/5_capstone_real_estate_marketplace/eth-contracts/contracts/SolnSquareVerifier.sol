pragma solidity >0.5.1;
pragma experimental ABIEncoderV2;

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
import "./verifier.sol";
import "./ERC721Mintable.sol";

contract ZokratesVerifier is Verifier {}

// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is ERC721Token {
    ZokratesVerifier public zokratesContract;

    // TODO define a solutions struct that can hold an index & an address
    struct Solution {
        uint256 tokenId;
        address owner;
    }

    // TODO define an array of the above struct
    Solution[] solutionArray;

    // TODO define a mapping to store unique solutions submitted
    mapping(uint256 => Solution) uniqueSolutions;

    // TODO Create an event to emit when a solution is added
    event SolutionAdded(uint256 indexed tokenId, address indexed owner);

    constructor(
        address verifierAddress,
        string memory name,
        string memory symbol
    ) public ERC721Token(name, symbol) {
        zokratesContract = ZokratesVerifier(verifierAddress);
    }

    // TODO Create a function to add the solutions to the array and emit the event
    function addSolution(uint256 _tokenId, address _owner) public {
        Solution memory solution = Solution(_tokenId, _owner);

        solutionArray.push(solution);

        uniqueSolutions[_tokenId] = solution;

        emit SolutionAdded(_tokenId, _owner);
    }

    // TODO Create a function to mint new NFT only after the solution has been verified
    //  - make sure the solution is unique (has not been used before)
    //  - make sure you handle metadata as well as tokenSupply
    function mint(
        address _to,
        uint256 _tokenId,
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[2] memory input
    ) public {
        require(
            uniqueSolutions[_tokenId].owner == address(0x0),
            "This solution has already been used"
        );

        require(
            zokratesContract.verifyTx(a, b, c, input),
            "Solution is incorrect"
        );

        super.mint(_to, _tokenId);
    }
}
