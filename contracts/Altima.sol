// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Altima is ERC721, Ownable, ReentrancyGuard {
    using Strings for uint256;
    using Counters for Counters.Counter;

    Counters.Counter private supply;

    bool public mintIsActive = false;
    string public baseURI = "";
    string public baseExtension = "";
  
    uint256 public constant ALTIMA_MAX = 1000;
    uint256 public constant ALTIMA_FREE_COUNT = 100;
    uint256 public constant BOOSTER_PACK_QTY = 5;
    uint256 public mintPrice = 0.1 ether;


    constructor() ERC721("Altima", "ALTIMA") {}

    function totalSupply() public view returns (uint256) {
        return supply.current();
    }

    function flipMintState() public onlyOwner {
        mintIsActive = !mintIsActive;
    }

    function earlyMint() public nonReentrant {
        require(mintIsActive, "Minting Altima is not available yet." );
		require(supply.current() <= ALTIMA_MAX, "Max supply exceeded!");
        _mintBoosterPack(msg.sender);
    }

    function mint() public payable nonReentrant {
        require(mintIsActive, "Minting Altima is not available yet." );
		require((supply.current() >= ALTIMA_FREE_COUNT) && (supply.current() < ALTIMA_MAX), "invalid buy");
		require(msg.value >= mintPrice, "ALTIMA: Amount of MATIC sent is incorrect.");
		_mintBoosterPack(msg.sender);
    }
    
  
    function walletOfOwner(address _owner) public view returns (uint256[] memory) {
        uint256 ownerTokenCount = balanceOf(_owner);
        uint256[] memory ownedTokenIds = new uint256[](ownerTokenCount);
        uint256 currentTokenId = 1;
        uint256 ownedTokenIndex = 0;
        while (ownedTokenIndex < ownerTokenCount && currentTokenId <= ALTIMA_MAX) {
            address currentTokenOwner = ownerOf(currentTokenId);
    
            if (currentTokenOwner == _owner) {
                ownedTokenIds[ownedTokenIndex] = currentTokenId;
                ownedTokenIndex++;
            }
            currentTokenId++;
        }
        return ownedTokenIds;
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

    function withdraw() public onlyOwner {
      (bool os, ) = payable(owner()).call{value: address(this).balance}("");
      require(os);
    }
    
    function _mintBoosterPack(address _receiver) internal {
        for (uint256 i = 0; i < BOOSTER_PACK_QTY; i++) {
            supply.increment();
            _safeMint(_receiver, supply.current());
        }
    }
    
}
