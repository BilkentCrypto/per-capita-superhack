
const generateOpenseaUrl = (collectionAddress, nftId) => {
    return `https://testnets.opensea.io/assets/zora-testnet/${collectionAddress}/${nftId}`
}

const generateOpenseaCollectionUrl = (collectionAddress) => {
    return `https://testnets.opensea.io/assets/zora-testnet/${collectionAddress}`
}

export {generateOpenseaUrl, generateOpenseaCollectionUrl}