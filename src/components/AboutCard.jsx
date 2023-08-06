import React from 'react';

const AboutCard = ({ logo, title, subTitle }) => {
    return (
        <div className="w-96 h-96 bg-gray-700 rounded-3xl p-6 flex flex-col items-center justify-center mx-10">
          {logo && (
            <img
              src={logo}
              alt="Logo"
              className="w-20 h-20 object-contain mb-3"
            />
          )}
          <h2 className="text-white text-xl font-semibold mb-3">{title}</h2>
          <p className="text-gray-300 text-base text-center">{subTitle}</p>
        </div>
      );
    };

export default AboutCard;
