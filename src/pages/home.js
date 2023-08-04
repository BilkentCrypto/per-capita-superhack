function Home() {
  return (
    <>
      <section className="w-full pt-24 md:pt-0 md:h-screen relative flex flex-col justify-center items-center">
        <div className="container flex py-24 md:flex-row flex-col items-center">
          <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6 mb-10 md:mb-0">
            <img
              className="object-cover object-center rounded"
              alt="hero"
              src="images/ReCarbon.png"
            />
          </div>
          <div className="lg:flex-grow md:w-1/2 lg:pl-18 xl:pl-24 md:pl-16 flex flex-col md:items-start md:text-left items-center text-center">
            <h1 className="title-font text-4xl sm:text-5xl md:text-5xl lg:text-6xl mb-4 font-medium text-gray-900">
            Project_Name
            </h1>
            <p className="mb-8 leading-relaxed">
Short description            </p>
            <ul class="text-gray">
              <li className="mb-4 w-fill flex">
              <svg xmlns="http://www.w3.org/2000/svg" class="flex-none w-6 h-full" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
</svg>
 <span class="ml-2">Pitch</span>
                </li>
              <li className="mb-4 w-fill flex">
              <svg xmlns="http://www.w3.org/2000/svg" class="flex-none w-6 h-full" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
</svg>
<span class="ml-2">Pitch</span>
                </li>
                <li className="mb-4 w-fill flex">
                <svg xmlns="http://www.w3.org/2000/svg" class="flex-none w-6 h-full" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
</svg>

<span class="ml-2">Pitch</span>
                </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
