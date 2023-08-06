import Typed from 'react-typed';
import Card from './Card';

function Home() {
  return (
    <>
      <section className="w-full pt-24 md:pt-0 md:h-screen bg-[#02050E] relative flex flex-col md:flex-row justify-center items-center">
        <div className="container mt-10 md:w-1/2 lg:pl-18 xl:pl-24 mt-5 md:pl-16 flex flex-col md:items-start md:text-left items-center text-center md:ml-10">
          <h1 className="text-4xl mt-10 leading-[44px] md:text-4xl text-white md:leading-tight lg:text-6xl lg:leading-[1.2] font-bold md:tracking-[-2px]">
            NFT distribution that is{' '}
          </h1>
          <Typed
            className="py-3 max-w[200px] text-5xl md:text-4xl lg:text-[5.5rem] xl:text-[6.5rem] 2xl:text-7xl md:max-w-[400px] bg-clip-text font-extrabold  text-transparent bg-gradient-to-r from-[#7316ff] to-[#f813e1]"
            strings={['fair.', 'decentralized.', 'fast.']}
            typeSpeed={120}
            backSpeed={140}
            loop
          />

          <p className="pt-4 pb-8 md:pt-6 text-gray-400 md:pb-12 max-w-[480px] text-lg text-center lg:text-left">
            You can efficiently distribute NFTs per person in a way that is resistant to Sybil attacks.
          </p>

          <button className="bg-[#7316ff] mb-5 text-white text-base font-medium px-6 py-3 rounded-lg">
            Discover INO
          </button>
        </div>
        <div className="lg:max-w-lg lg:w-5/12 md:w-1/2 w-5/6 mb-6 md:mt-10 max-w-[400px]">
          <div style={{ width: '100%', maxWidth: '400px', height: '400px' }}>
            <Card imageUrl="./images/IMG.png" price="$99.99" nftName="Hamlet NFT" />
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;

