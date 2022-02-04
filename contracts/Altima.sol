// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";


contract Altima is ERC721, ERC721Enumerable, ReentrancyGuard, Ownable {
    using Strings for uint256;
    using Counters for Counters.Counter;
    
    uint256 public constant ALTIMA_MAX = 50000;
    uint256 public constant ALTIMA_FREE_COUNT = 5000;
    uint256 public constant BOOSTER_PACK_QTY = 5;
    uint256 public mintPrice = 0.1 ether;

    Counters.Counter private _tokenIdCounter;

    bool public mintIsActive = false;
    string public baseURI = ""; //Todo: add base URI for images
    string public baseExtension = "";

    constructor() ERC721("Altima", "ALT") {
		_tokenIdCounter.increment();
        for(uint i = 0; i < BOOSTER_PACK_QTY * 40; i++) {
			_safeMint(msg.sender, _tokenIdCounter.current());
			_tokenIdCounter.increment();
		}
    }

    function setBaseURI(string memory _newBaseURI) public onlyOwner {
      baseURI = _newBaseURI;
    }
  
    function setBaseExtension(string memory _newBaseExtension) public onlyOwner {
      baseExtension = _newBaseExtension;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId),"ERC721Metadata: URI query for nonexistent token");
        return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, tokenId.toString(), baseExtension)) : "";
    }
    
    function flipMintState() public onlyOwner {
        mintIsActive = !mintIsActive;
    }

    function earlyMint() public nonReentrant {
        require(mintIsActive, "Minting Altima is not available yet." );
		require(_tokenIdCounter.current() < ALTIMA_FREE_COUNT, "invalid claim");
		
		for(uint i = 0; i < BOOSTER_PACK_QTY; i++) {
			_safeMint(msg.sender, _tokenIdCounter.current());
			_tokenIdCounter.increment();
		}
    }

    function mint() public payable nonReentrant {
        require(mintIsActive, "Minting Altima is not available yet." );
		require((_tokenIdCounter.current() >= ALTIMA_FREE_COUNT) && (_tokenIdCounter.current() < ALTIMA_MAX), "invalid buy");
		require(msg.value >= mintPrice, "ALT: Amount of MATIC sent is incorrect.");
		
		for(uint i = 0; i < BOOSTER_PACK_QTY; i++) {
			_safeMint(msg.sender, _tokenIdCounter.current());
			_tokenIdCounter.increment();
		}
    }
    
    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
    
    function withdraw(address destination) public onlyOwner returns(bool){
        uint balance = address(this).balance;
        (bool success, ) = destination.call{value:balance}("");
        return success;
    }
}
