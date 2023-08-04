import React from 'react';

const Footer = () => {
  return (
    <footer className="mt-10">
      <div className="bg-gray-100 py-5">
        <div className="container px-5 py-6 mx-auto flex items-center justify-between sm:flex-row flex-col">
          <a
            href="/#"
            className="flex title-font font-medium items-center md:justify-start justify-center text-gray-900"
          >
            <span className="ml-3 text-xl">Project_Name</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
