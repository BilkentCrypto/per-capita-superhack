import React from 'react';

const Footer = () => {
  return (
    <footer className="">
      <div className="bg-gray-100 py-2">
        <div className="container px-5 py-8 mx-auto flex items-center justify-between sm:flex-row flex-col">
          <a
            href="/#"
            className="flex title-font font-bold items-center md:justify-start justify-center text-gray-900"
          >
            <span className="ml-3 text-bold text-xl">PerCapita</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
