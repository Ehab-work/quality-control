import React from 'react';

const Unauthorized = () => {
  return (
    <div style={{ color: 'red', textAlign: 'center', marginTop: '100px' }}>
      <h2>Access Denied</h2>
      <p>You are not authorized to view this page.</p>
    </div>
  );
};

export default Unauthorized;
