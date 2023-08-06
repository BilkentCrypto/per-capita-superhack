import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import NftCard from '../components/NftCard';
import { getNftList } from '../utils/web3/carbonMarket';

function INO() {
  const [query] = useSearchParams();
  const [selectedProvider, setSelectedProvider] = useState(query.get('provider') || '');
  const [nftIDs, setNftIDs] = useState([]);

  console.log(nftIDs);

  const providers = [
    {
      id: 'A',
      name: 'Joined INO',
    },
    {
      id: 'G',
      name: 'Gaming',
    },
    {
      id: 'M',
      name: 'Membership',
    },
  ];

  const listedNfts = [
    {
      id: 1,
      provider: 'A',
      price: 3000,
    },
    {
      id: 2,
      provider: 'G',
      price: 1400,
    },
    {
      id: 3,
      provider: 'M',
      price: 2000,
    },
  ];

  const asyncGet = async () => {
    const nfts = await getNftList();
    let modifiedNfts = [];
    for (let i = 4; i < nfts.length; i++) {
      modifiedNfts.push({
        id: i,
        provider: 'G',
        price: nfts[i].price,
      });
    }
    return modifiedNfts.concat(listedNfts);
  };

  useEffect(() => {
    asyncGet().then((i) => {
      setNftIDs(i);
    });
  }, []);

  return (
    <section className="w-full bg-bg-[#02050E] pt-24 md:pt-32 md:min-h-screen relative flex flex-col">
      <div className="container w-full flex bg-red">
        <div className="w-full flex flex-wrap">
          <div className="w-full">
            <div  className="px-2 py-5 mb-10 items-center">
              <div className=" overflow-y-auto rounded-full shadow-zinc-500 shadow-2xl">
                <ul className="space-y-2">
                 
                  <li className="flex justify-between bg-white rounded-full">
                    <Link
                      to="/INO"
                      className={`px-4 py-2 rounded-lg font-medium ${selectedProvider === '' ? 'bg-gray-200 rounded-3xl ' : ''}`}
                      onClick={() => setSelectedProvider('')}
                    >
                      Current INO
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
              {nftIDs
                .filter((nft) => {
                  return selectedProvider === '' ? 'all' : nft.provider === selectedProvider;
                })
                .map((listedNft) => {
                  return <NftCard id={listedNft.id} price={listedNft.price} key={listedNft.id} />;
                })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default INO;
