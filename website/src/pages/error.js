import React from 'react';
import ErrorMessage from '../components/ErrorMessage';

const Error = ({ code }) => {
  return <ErrorMessage code={code} />;
};

export default Error;
