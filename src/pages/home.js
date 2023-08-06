import Typed from 'react-typed';

function Home() {
  return (
    <>
      <section className="w-full pt-24 md:pt-0 md:h-screen bg-[#02050E] relative flex flex-col justify-center items-center">
        <div className="container flex flex-col md:flex-row items-center">
          <div className="lg:max-w-lg lg:w-4/12 md:w-1/2 w-5/6 mb-6 md:mt-10">
            <img
              className="object-cover md:ml-10 object-center rounded w-full h-auto"
              alt="hero"
              src="images/image.png"
            />
          </div>
          <div className="lg:flex-grow md:w-1/2 lg:pl-18 xl:pl-24 mt-5 md:pl-16 flex flex-col md:items-start md:text-left items-center text-center md:ml-10">
            <h1 className="title-font text-4xl sm:text-4xl md:text-4xl lg:text-4xl mb-4 font-medium text-white">
               NFT and token distribution that is  <Typed 
                className='py-3 max-w[200px] text-4xl md:text-4xl bg-clip-text font-extrabold text-transparent bg-gradient-to-r from-[#7316ff] to-[#f813e1]'
                  strings={['fair.', 'decentralized.', 'fast.']}
                  typeSpeed={120}
                  backSpeed={140}
                  loop
                />
            </h1>
           
            <p className="mb-8 font-semibold text-gray-300 leading-relaxed">
              You can efficiently distribute NFTs and tokens per person in a way that is resistant to Sybil attacks.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
