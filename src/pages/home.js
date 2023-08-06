import Hero from '../components/Hero';
import About from '../components/About';

function Home() {
  return (
    <div className='bg-black w-full flex flex-col'>
      <Hero />
      <div className='flex-1 mt-8 md:mt-20'>
        <About />
      </div>
    </div>
  );
}

export default Home;
