
const generateOpenseaUrl = (collectionAddress, nftId) => {
    return `https://testnets.opensea.io/assets/optimism-goerli/${collectionAddress}/${nftId}`
}

export {generateOpenseaUrl}