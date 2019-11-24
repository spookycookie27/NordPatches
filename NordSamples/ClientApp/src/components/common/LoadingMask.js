import React from 'react';
import './LoadingMask.css';

export default () => (
  <div className="LoadingMask">
    <div className="spinner">
      <div className="outer-ring" />
      <div className="inner-ring" />
    </div>
  </div>
);