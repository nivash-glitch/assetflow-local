// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title RWA - Real World Asset Tokenization
 * @dev Smart contract for tokenizing real-world assets on a private blockchain
 */
contract RWA {
    struct Asset {
        uint256 id;
        string name;
        string assetType;
        uint256 value;
        address owner;
        uint256 timestamp;
        bool exists;
    }

    // Mapping from asset ID to Asset
    mapping(uint256 => Asset) private assets;
    
    // Counter for generating unique asset IDs
    uint256 private assetCounter;
    
    // Array to store all asset IDs for enumeration
    uint256[] private assetIds;

    // Events
    event AssetTokenized(
        uint256 indexed id,
        string name,
        string assetType,
        uint256 value,
        address indexed owner,
        uint256 timestamp
    );

    event AssetTransferred(
        uint256 indexed id,
        address indexed from,
        address indexed to,
        uint256 timestamp
    );

    /**
     * @dev Tokenize a new real-world asset
     * @param _name Name of the asset
     * @param _assetType Type of asset (e.g., "Real Estate", "Vehicle", "Art")
     * @param _value Value of the asset in wei
     * @return id The unique identifier of the tokenized asset
     */
    function tokenizeAsset(
        string memory _name,
        string memory _assetType,
        uint256 _value
    ) public returns (uint256) {
        require(bytes(_name).length > 0, "Asset name cannot be empty");
        require(bytes(_assetType).length > 0, "Asset type cannot be empty");
        require(_value > 0, "Asset value must be greater than 0");

        assetCounter++;
        uint256 newAssetId = assetCounter;

        assets[newAssetId] = Asset({
            id: newAssetId,
            name: _name,
            assetType: _assetType,
            value: _value,
            owner: msg.sender,
            timestamp: block.timestamp,
            exists: true
        });

        assetIds.push(newAssetId);

        emit AssetTokenized(
            newAssetId,
            _name,
            _assetType,
            _value,
            msg.sender,
            block.timestamp
        );

        return newAssetId;
    }

    /**
     * @dev Transfer ownership of an asset
     * @param _assetId ID of the asset to transfer
     * @param _newOwner Address of the new owner
     */
    function transferAsset(uint256 _assetId, address _newOwner) public {
        require(assets[_assetId].exists, "Asset does not exist");
        require(assets[_assetId].owner == msg.sender, "You are not the owner");
        require(_newOwner != address(0), "Invalid new owner address");
        require(_newOwner != msg.sender, "Cannot transfer to yourself");

        address previousOwner = assets[_assetId].owner;
        assets[_assetId].owner = _newOwner;

        emit AssetTransferred(_assetId, previousOwner, _newOwner, block.timestamp);
    }

    /**
     * @dev Get asset details by ID
     * @param _assetId ID of the asset
     * @return id Asset ID
     * @return name Asset name
     * @return assetType Asset type
     * @return value Asset value
     * @return owner Asset owner address
     * @return timestamp Creation timestamp
     */
    function getAsset(uint256 _assetId)
        public
        view
        returns (
            uint256 id,
            string memory name,
            string memory assetType,
            uint256 value,
            address owner,
            uint256 timestamp
        )
    {
        require(assets[_assetId].exists, "Asset does not exist");
        Asset memory asset = assets[_assetId];
        return (
            asset.id,
            asset.name,
            asset.assetType,
            asset.value,
            asset.owner,
            asset.timestamp
        );
    }

    /**
     * @dev Get all tokenized asset IDs
     * @return Array of asset IDs
     */
    function getAllAssetIds() public view returns (uint256[] memory) {
        return assetIds;
    }

    /**
     * @dev Get total number of tokenized assets
     * @return Total count of assets
     */
    function getTotalAssets() public view returns (uint256) {
        return assetIds.length;
    }

    /**
     * @dev Check if an asset exists
     * @param _assetId ID of the asset
     * @return bool True if asset exists
     */
    function assetExists(uint256 _assetId) public view returns (bool) {
        return assets[_assetId].exists;
    }
}
