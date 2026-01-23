import React from 'react';

const Spinner: React.FC = () => (
  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24}}>
    <div style={{width: 36, height: 36, border: '4px solid #ccc', borderTop: '4px solid #007bff', borderRadius: '50%', animation: 'spin 1s linear infinite'}} />
    <style>{`@keyframes spin { from { transform: rotate(0deg);} to { transform: rotate(360deg);} }`}</style>
  </div>
);

export default Spinner;
