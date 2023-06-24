import React from 'react';
import './loading.scss';

const Loading = () => {
  return (
    <div className="loading-spiner">
      <div className="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
    </div>
  );
};

export default Loading;