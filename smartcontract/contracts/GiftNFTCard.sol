// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";

/// @custom:security-contact pepsighan@sharadchand.com
contract GiftNFTCard is
    Initializable,
    ERC721Upgradeable,
    ERC721EnumerableUpgradeable,
    ERC721BurnableUpgradeable,
    OwnableUpgradeable
{
    using CountersUpgradeable for CountersUpgradeable.Counter;

    /// GiftCard contains all the metadata stored within an NFT.
    struct GiftCard {
        /// The ID of the NFT token.
        uint256 tokenId;
        /// The amount that is wrapped within this gift card.
        uint256 amount;
        /// The gift card image data URL.
        string imageDataUrl;
        /// Message on the gift card.
        string message;
        /// The one who sent this gift card.
        string signedBy;
        /// The original address who minted this token.
        address mintedBy;
        /// Whether the amount in the gift is unwrapped.
        bool isUnwrapped;
        /// Whether the associated NFT is burnt.
        bool isBurnt;
        /// Time at which this gift card was minted.
        uint256 timestamp;
        /// Whether this gift card actually exists.
        bool isInitialized;
    }

    CountersUpgradeable.Counter private _tokenIdCounter;
    string private _contractBaseURI;

    /// The map of all the gift cards attached to the NFT.
    mapping(uint256 => GiftCard) private _giftMap;

    /// List of gifts sent by an address.
    mapping(address => uint256[]) private _sentGifts;

    /// Total fees accumulated during the course of minting and unwrapping of gifts.
    uint256 private _totalFees;

    /// Total amount of fees that are withdrawn to the admin account as earnings.
    uint256 private _totalFeesWithdrawn;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    function initialize(string memory uri) public initializer {
        __ERC721_init("Gift NFT Card", "GNFTCARD");
        __ERC721Enumerable_init();
        __Ownable_init();
        __ERC721Burnable_init();
        _contractBaseURI = uri;
    }

    function _baseURI() internal view override returns (string memory) {
        return _contractBaseURI;
    }

    /// Mint new gift card NFT.
    function safeMint(
        address to,
        string memory imageDataUrl,
        string memory message,
        string memory signedBy
    ) public payable {
        // TODO: Require a minimum value of gift card amount.
        require(
            msg.value > 0,
            "GiftNFTCard: gift card needs to have some amount"
        );

        // Take a cut from the minting.
        uint256 mintFees = _calculateMintFees(msg.value);
        _totalFees += mintFees;
        uint256 giftValue = msg.value - mintFees;

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);

        // Store the metadata of the NFT in the map.
        _giftMap[tokenId] = GiftCard({
            tokenId: tokenId,
            amount: giftValue,
            imageDataUrl: imageDataUrl,
            message: message,
            signedBy: signedBy,
            mintedBy: msg.sender,
            isUnwrapped: false,
            isBurnt: false,
            timestamp: block.timestamp,
            isInitialized: true
        });
        _sentGifts[msg.sender].push(tokenId);
    }

    /// Calculates the minting fees. This is what we earn for the service we provide.
    function _calculateMintFees(uint256 value) private pure returns (uint256) {
        // TODO: Put an upper limit to the mint fees.
        // Mint fees are 1% of the total value.
        return value / 100;
    }

    /// Gets the gift card by the token id.
    function _getGiftCard(uint256 tokenId)
        private
        view
        returns (GiftCard memory)
    {
        GiftCard memory card = _giftMap[tokenId];
        require(card.isInitialized == true, "GiftNFTCard: gift card not found");
        return card;
    }

    /// Gets the gift card by the token id for an admin.
    function getGiftCardByAdmin(uint256 tokenId)
        public
        view
        onlyOwner
        returns (GiftCard memory)
    {
        return _getGiftCard(tokenId);
    }

    /// Get gift card of the owner using index.
    function getGiftCardByIndex(uint256 index)
        public
        view
        returns (GiftCard memory)
    {
        uint256 tokenId = ERC721EnumerableUpgradeable.tokenOfOwnerByIndex(
            msg.sender,
            index
        );
        return _getGiftCard(tokenId);
    }

    /// Get the length of sent gifts of the sender.
    function lengthOfSentGiftCards() public view returns (uint256) {
        return _sentGifts[msg.sender].length;
    }

    /// Get gift card sent by the sender using index.
    function getSentGiftCardByIndex(uint256 index)
        public
        view
        returns (GiftCard memory)
    {
        uint256[] memory tokenIds = _sentGifts[msg.sender];
        require(tokenIds.length > index, "GiftNFTCard: gift card not found");
        uint256 tokenId = tokenIds[index];
        return _getGiftCard(tokenId);
    }

    /// Unwraps the gift and sends the amount stored in the gift card to the owner.
    function _unwrapGiftCardAndDisburse(GiftCard memory gift, address owner)
        private
    {
        require(
            gift.isUnwrapped == false,
            "GiftNFTCard: cannot unwrap already unwrapped gift card"
        );

        address payable sender = payable(owner);
        // Send the gift amount to the caller.
        (bool sent, ) = sender.call{value: gift.amount}("");
        require(sent, "GiftNFTCard: failed to unwrap gift card");

        // The gift is unwrapped now. Do not allow the same gift to redeem the amount again.
        _giftMap[gift.tokenId].isUnwrapped = true;
    }

    /// Unwraps the amount stored in the gift card and withdraws it in the owner's wallet.
    function unwrapGiftCard(uint256 tokenId) public {
        require(
            ERC721Upgradeable.ownerOf(tokenId) == msg.sender,
            "GiftNFTCard: caller is not owner"
        );
        GiftCard memory gift = _getGiftCard(tokenId);
        _unwrapGiftCardAndDisburse(gift, msg.sender);
    }

    /// Unwraps the gift card for the user using the admin account so that the unwrapper does not have to
    /// directly pay gas prices.
    function unwrapGiftCardByAdmin(
        uint256 tokenId,
        address owner,
        bytes memory signature
    ) public onlyOwner {
        // Read and store the gas limit immediately as `msg.gas` is the remaining gas left. It being the first
        // statement should mean the gas limit value is ~accurate.
        uint256 gasLimit = gasleft();
        uint gasPrice = tx.gasprice;

        /// Only the signed message of the owner will be able to unwrap the gift.
        bytes32 msgHash = _prefixed(
            keccak256(abi.encodePacked(tokenId, owner))
        );
        address giftCardOwner = _recoverGiftCardOwner(msgHash, signature);

        require(
            ERC721Upgradeable.ownerOf(tokenId) == giftCardOwner,
            "GiftNFTCard: caller is not owner"
        );
        require(owner == giftCardOwner, "GiftNFTCard: caller is not owner");
        GiftCard memory gift = _getGiftCard(tokenId);

        // Deduct the unwrap fees from the gift amount.
        uint256 unwrapFees = _calculateGaslessTxFees(gasLimit, gasPrice);
        _totalFees += unwrapFees;
        gift.amount -= unwrapFees;

        _unwrapGiftCardAndDisburse(gift, giftCardOwner);
    }

    /// Calculates the fees to do transactions for "free" without the user needing to have $METIS tokens in
    /// their wallet. The transaction costs are recovered from the gift card value itself.
    function _calculateGaslessTxFees(uint256 gasLimit, uint gasPrice)
        private
        pure
        returns (uint256)
    {
        // This is the maximum possible transaction value. The actual cost may be less but knowing that is
        // error prone.
        return gasLimit * gasPrice;
    }

    /// Burns the gift card for good.
    function burnGiftCard(uint256 tokenId) public {
        require(
            ERC721Upgradeable.ownerOf(tokenId) == msg.sender,
            "GiftNFTCard: caller is not owner"
        );
        GiftCard memory gift = _getGiftCard(tokenId);
        require(
            gift.isUnwrapped == true,
            "GiftNFTCard: cannot burn a gift that is not unwrapped"
        );

        ERC721BurnableUpgradeable.burn(tokenId);
        _giftMap[tokenId].isBurnt = true;
    }

    /// Gets the total fees earned till now.
    function getTotalFees() public view onlyOwner returns (uint256) {
        return _totalFees;
    }

    /// Gets the total fees earned that is withdrawn till now.
    function getTotalFeesWithdrawn() public view onlyOwner returns (uint256) {
        return _totalFeesWithdrawn;
    }

    /// Withdraw all the fees that are not yet withdrawn.
    function withdrawFees() public onlyOwner {
        uint256 unwithdrawnFees = _totalFees - _totalFeesWithdrawn;
        require(unwithdrawnFees > 0, "GiftNFTCard: no fees to withdraw yet");

        (bool sent, ) = payable(msg.sender).call{value: unwithdrawnFees}("");
        require(sent, "GiftNFTCard: failed to withdraw fees");

        // Reset the withdrawn amount to full.
        _totalFeesWithdrawn = _totalFees;
    }

    /// Recover the owner of the gift card from the signature.
    function _recoverGiftCardOwner(bytes32 msgHash, bytes memory signature)
        private
        pure
        returns (address)
    {
        require(signature.length == 65);

        bytes32 r;
        bytes32 s;
        uint8 v;
        assembly {
            // First 32 bytes, after the length prefix.
            r := mload(add(signature, 32))
            // Second 32 bytes.
            s := mload(add(signature, 64))
            // Final byte (first byte of the next 32 bytes).
            v := byte(0, mload(add(signature, 96)))
        }

        return ecrecover(msgHash, v, r, s);
    }

    // Builds a prefixed hash to mimic the behavior of eth_sign.
    function _prefixed(bytes32 hash) private pure returns (bytes32) {
        return
            keccak256(
                abi.encodePacked("\x19Ethereum Signed Message:\n32", hash)
            );
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721Upgradeable, ERC721EnumerableUpgradeable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721Upgradeable, ERC721EnumerableUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
