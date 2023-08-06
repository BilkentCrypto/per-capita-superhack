import Hero from '../components/Hero';
import About from '../components/About';

function Home() {
  return (
    <div className='bg-black w-full'>
      <Hero />
      <div className='mt-20'>
        <About />
      </div>
    </div>
  );
}

export default Home;