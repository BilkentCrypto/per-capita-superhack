
const generateOpenseaUrl = (collectionAddress, nftId) => {
    return `https://testnets.opensea.io/assets/zora-sepolia/${collectionAddress}/${nftId}`
}

const generateOpenseaCollectionUrl = (collectionAddress) => {
    return `https://testnets.opensea.io/assets/zora-sepolia/${collectionAddress}`
}

const generateOpenseaAccountUrl = (address) => {
    return `https://testnets.opensea.io/${address}`
}

export {generateOpenseaUrl, generateOpenseaCollectionUrl, generateOpenseaAccountUrl}