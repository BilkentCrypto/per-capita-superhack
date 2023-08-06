import { useParams } from 'react-router-dom';
import Card from '../components/card';

const Detail = () => {
  const { id } = useParams();

  const data = {
    id: id,
    name: 'name',
    provider: 'A',
    description: 'description',
    remaining_time: 'Remaining time',
    price: 'price',
    image: '/nft.jpeg',
  };

  async function joinCall() {
    console.log(data);
  }

  return (
    <section className="w-full min-h-screen flex justify-center items-center">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className=" p-4 flex items-center justify-center w-full md:w-1/2"> {/* Change to w-full md:w-1/2 */}
            {/* Left Card */}
            <div className="w-48 md:w-56 mt-8 p-2 bg-white shadow-md rounded-lg mx-auto">
              <img
                src="https://picsum.photos/200/200" // Reduced image size to 200x200
                alt={data.name}
                className="w-full h-48 md:h-56 object-cover rounded-t-lg"
              />
            </div>
          </div>
          <div className=" p-4 flex items-center justify-center w-full md:w-1/2"> {/* Change to w-full md:w-1/2 */}
            {/* Right Card */}
            <div className="w-full p-4 bg-white shadow-md rounded-lg">
              <h1 className="text-xl font-bold text-center mb-4">Collection #{data.id}</h1>
              <ul className="space-y-2">
                <li className="flex justify-between py-2">
                  <span className="font-bold">Name:</span>
                  <span>{data.name}</span>
                </li>
                <li className="flex justify-between py-2">
                  <span className="font-bold">Description:</span>
                  <span>{data.description}</span>
                </li>
                <li className="flex justify-between py-2">
                  <span className="font-bold">Remaining Time:</span>
                  <span>{data.remaining_time}</span>
                </li>
                <li className="flex justify-between py-2">
                  <span className="font-bold">Provider:</span>
                  <span>{data.provider}</span>
                </li>
              </ul>
              <div className="flex items-center justify-center mt-5">
                <button
                  onClick={joinCall}
                  className="flex items-center text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded-3xl text-lg align-center"
                >
                  <span className="mr-2 font-semibold">Join</span>
                  <span className="bg-white flex items-center rounded-3xl px-2 py-1">
                    <span className="text-black font-semibold">20$</span>
                  </span>
                </button>
              </div>
            
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
};

export default Detail;
