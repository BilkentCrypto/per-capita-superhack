import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { readContract, writeContract, watchContractEvent } from '@wagmi/core';
import contractAddresses from '../utils/addresses.json';
import mainContractAbi from '../utils/MainAbi.json';
import { formatEther, parseGwei } from 'viem';
import { formatUnits } from 'viem';
import { BeParticipantTest } from './BeParticipantTest';
import Card from '../components/Card';
import moment from 'moment';
import { useContractInfiniteReads, paginatedIndexesConfig, useAccount } from 'wagmi';



function INO() {
  const [query] = useSearchParams();
  const [selectedProvider, setSelectedProvider] = useState(query.get('provider') || '');
  const [marketplaces, setMarketplaces] = useState([]);
 const {address} = useAccount();

  const providers = [
    {
      id: 'myCollections',
      name: 'Joined INOs',
    },
    {
      id: 'executable',
      name: 'Executable INOs',
    },
    {
      id: 'past',
      name: 'Past INOs',
    },
  ];


  const readMarketplaces = async () => {
    const newData = await readContract({
      address: contractAddresses.Main,
      abi: mainContractAbi,
      functionName: 'fetchAllMarketplaces',
      
    })
    const finalData = newData.map( (value, index) => {
      value.id = index;
      return value;
    } )
    setMarketplaces(finalData);
    console.log("marketplaces", finalData)
    //setTestData(newData);
  }
  useEffect(() => {
    readMarketplaces();
  
  }, []);
  
  console.log(marketplaces)
  //wagmi test

  const { data, fetchNextPage } = useContractInfiniteReads({
    cacheKey: 'participants',
    ...paginatedIndexesConfig(
      (index) => {
        return [
          {
            address: contractAddresses.Main,
            abi: mainContractAbi,
            functionName: 'participants',
            args: [index, address],
          },
        ]
      },
      { start: 0, perPage: 10, direction: 'increment' },
    ),
  })

  const isParticipated = [];
  data?.pages.forEach( (value) => {
    value.forEach( (data) => {
      if(data.status) 
        isParticipated.push(data?.result?.[0])
    } )
  } )

console.log("particapant", isParticipated);

let filteredMarketplaces;

if(selectedProvider === 'myCollections')
  filteredMarketplaces = marketplaces.filter( (value) => {
    return isParticipated[value.id];
  } );
   else if(selectedProvider === 'executable')
  filteredMarketplaces = marketplaces.filter( (value) => {
    return value.giveawayTime < moment().unix() && !value.isDistributed
  } );
  else if(selectedProvider === 'past')
  filteredMarketplaces = marketplaces.filter( (value) => {
    return value.giveawayTime < moment().unix() && value.isDistributed
  } ); else 
  filteredMarketplaces = marketplaces.filter( (value) => {
   return value.giveawayTime > moment().unix()
  } );



  const marketplaceCards = filteredMarketplaces.map((value, index) => {
    if (value.marketType == 0) return null;
    return <Card imageUri={value.imageUri} name={value.name} contractAddress={ value.contractAddress} price={formatEther(value.price)} id={value.id} />
  });


  return (
    <section className="w-full bg-bg-[#02050E] pt-24 md:pt-32 md:min-h-screen relative flex flex-col">
      <div className="container w-full flex bg-red">
        <div className="w-full flex flex-wrap">
          <div className="w-full">
            <BeParticipantTest />
            <div className="px-2 py-5 mb-10 items-center">
              <div className=" overflow-y-auto rounded-full shadow-zinc-500 shadow-2xl">
                <ul className="space-y-2">

                  <li className="flex justify-between bg-white rounded-full">
                    <Link
                      to="/INO"
                      className={`px-4 py-2 rounded-lg font-medium ${selectedProvider === '' ? 'bg-gray-200 rounded-3xl ' : ''}`}
                      onClick={() => setSelectedProvider('')}
                    >
                      Active INOs
                    </Link>
                    {providers.map((provider) => (
                      <Link
                        key={provider.id}
                        to={`/INO?provider=${provider.id}`}
                        className={`px-4 py-2 font-medium rounded-lg ${selectedProvider === provider.id ? 'bg-gray-200 rounded-3xl' : ''}`}
                        onClick={() => setSelectedProvider(provider.id)}
                      >
                        {provider.name}
                      </Link>
                    ))}
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="w-full">
            <div className="grid mt-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {marketplaceCards}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default INO;
