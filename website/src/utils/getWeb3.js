import { useState } from 'react';
import { Web3Storage } from 'web3.storage'


function getAccessToken () {
    return process.env.REACT_APP_WEB3_STORAGE
  }

  const token = getAccessToken();
  const client = new Web3Storage( { token } )

  async function storeFile ( file ) {
    const filesArray = [];
    filesArray.push( file );
    const cid = await client.put(filesArray);
    return cid;
  }

async function getFile( cid ) {
    const res = await client.get(cid)
    const files = await res.files()
    return files[0];
}

function convertToImage(file) {
    return URL.createObjectURL(file);
}

async function storeUri(name, description, imageCid) { 
    const obj = { name, description, imageCid }; 
    const blob = new Blob([JSON.stringify(obj)], { type: "application/json" }); 
    const cid = await storeFile(new File([blob], "collectionData.json"))
    return cid;

  }

  async function getUri(cid) {
    const file = await getFile(cid);
    const stringed = await file.text();
    return JSON.parse(stringed);
  }

  function getImageUrl(url) {
    url = url.replace("ipfs://", "");
    const splitted = url.split('/');
    return `https://${splitted[0]}.ipfs.dweb.link/${splitted[1]}`
  }

export {
    storeFile, 
    getFile,
    convertToImage,
    storeUri,
    getUri,
    getImageUrl,
}