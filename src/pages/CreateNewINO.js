import { useState } from 'react';

const CreateNewNIO = () => {
  const [ex, setEx] = useState('');

  const exChange = (e) => {
    setEx(e.target.value);
  };

  return (
    <section className=" flex w- items-center justify-center">
      <div className=" mt-20  items-center overflow-hidden shadow-2xl border-2 border-gray-100 rounded-xl mb-5">
        <div className="p-10">
          <div className="border-b w-full">
            <h1 className="text-xl font-bold text-center pb-2">Create New INO</h1>
          </div>
          <p className="pt-3">Name of the Project</p>
          <input
            type="text"
            className="block p-2 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Project's Name"
            required
            onChange={(e) => exChange(e)}
          />
          <p className="pt-3">Description</p>
          <input
            type="text"
            className="block p-2 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Describe the project"
            required
            onChange={(e) => exChange(e)}
          />
          <p className="pt-3">NFT Contract Address</p>
          <input
            type="text"
            className="block p-2 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Contract Address"
            required
            onChange={(e) => exChange(e)}
          />
          <p className="pt-2 font">NFT Price</p>

          <input
            type="text"
            className="block p-2 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Price"
            required
            onChange={(e) => exChange(e)}
          />
          <button
            onClick={null}
            className="text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg align-center w-full mt-5"
          >
            Create
          </button>
        </div>
      </div>
    </section>
  );
};

export default CreateNewNIO;

