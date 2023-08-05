function Home() {
  return (
    <>
      <section className="w-full pt-24 md:pt-0 md:h-screen bg-white relative flex flex-col justify-center items-center">
        <div className="container flex py-24 md:flex-row flex-col items-center">
          <div className="lg:max-w-lg mt-5 lg:w-5/12 md:w-1/2 w-5/6 mb-10 ml-0 md:ml-auto mr-0 md:mr-4">
            <img
              className="object-cover object-center rounded w-full h-auto"
              alt="hero"
              src="images/image.png"
            />
          </div>
          <div className="lg:flex-grow md:w-1/2 lg:pl-18 xl:pl-24 md:pl-16 flex flex-col md:items-start md:text-left items-center text-center ml-5">
            <h1 className="title-font text-4xl sm:text-5xl md:text-5xl lg:text-6xl mb-4 font-medium text-gray-900">
              NFT
            </h1>
            <p className="mb-8 leading-relaxed">
              Short description
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;



