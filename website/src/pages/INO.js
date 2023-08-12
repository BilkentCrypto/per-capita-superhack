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
  const { address } = useAccount();

  const providers = [
    {
      id: 'myIno',
      name: 'My INOs',
    },
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
    const finalData = newData.map((value, index) => {
      value.id = index;
      return value;
    })
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
      { start: 0, perPage: 50, direction: 'increment' },
    ),
  })

  const isParticipated = [];
  data?.pages.forEach((value) => {
    value.forEach((data) => {
      if (data.status)
        isParticipated.push(data?.result?.[0])
    })
  })

  console.log("particapant", isParticipated);

  let filteredMarketplaces;

  if (selectedProvider === 'myCollections')
    filteredMarketplaces = marketplaces.filter((value) => {
      return isParticipated[value.id];
    });
  else if (selectedProvider === 'executable')
    filteredMarketplaces = marketplaces.filter((value) => {
      return value.giveawayTime < moment().unix() && !value.isDistributed
    });
  else if (selectedProvider === 'past')
    filteredMarketplaces = marketplaces.filter((value) => {
      return value.giveawayTime < moment().unix() && value.isDistributed
    }); else
    filteredMarketplaces = marketplaces.filter((value) => {
      return value.giveawayTime > moment().unix()
    });



  const marketplaceCards = filteredMarketplaces.map((value, index) => {
    if (value.marketType == 0) return null;
    return <Card key={value.id} imageUri={value.imageUri} name={value.name} contractAddress={value.contractAddress} price={formatEther(value.price)} time= {`05 : 12 : 07 : 45`} id={value.id} participant= {`1238 Unique Participants`}/>
  });


  return (
    <section className="w-full h-full bg-black pt-24 md:pt-32 md:min-h-screen relative flex flex-col">
      <div className="container w-full flex bg-red">
        <div className="w-full flex flex-wrap">
          <div className="w-full">
           
            <div className="mb-10 mt-16 flex justify-start">
              <div className="rounded-lg shadow-zinc-700 shadow-2xl">
                <ul className="space-y-1">
                  <Link
                    to="/INO"
                    className={`px-4 py-2 w-[116px] h-14 rounded-lg mr-5  font-medium mb-5 ${selectedProvider === '' ? 'bg-[#7316ff] text-white rounded-3xl ' : 'border border-[#7316ff] text-white rounded-3xl'}`}
                    onClick={() => setSelectedProvider('')}
                  >
                    Active INOs
                  </Link>
                  {providers.map((provider, index) => (
                    <Link
                      key={provider.id}
                      to={`/INO?provider=${provider.id}`}
                      className={`px-4 py-2 w-[116px] h-14 mr-5 rounded-lg font-medium mb-5 ${selectedProvider === provider.id ? 'bg-[#7316ff] text-white rounded-3xl ' : 'border border-[#7316ff] text-white rounded-3xl'}`}
                      onClick={() => setSelectedProvider(provider.id)}
                    >
                      {provider.name}
                    </Link>
                  ))}
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
