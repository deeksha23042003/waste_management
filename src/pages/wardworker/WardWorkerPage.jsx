import React from 'react';
import WardWorkerHeader from './WardWorkerHeader';
const ComponentName = () => {
  return (
    <div>
      <WardWorkerHeader />
      <div style={{height:"89vh"}}></div> 
      {/* added dummy content so header stays up */}
    </div>
  );
};

export default ComponentName;
