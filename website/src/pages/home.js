import Hero from '../components/Hero';
import About from '../components/About';

function Home() {
  return (
    <div className='bg-black w-full flex flex-col'>
      <Hero />
      <div>
        <About />
      </div>
    </div>
  );
}

export default Home;
