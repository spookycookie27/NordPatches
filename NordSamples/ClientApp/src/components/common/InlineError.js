import * as React from 'react';

const InlineError = ({ field, errors }) => {
  if (!errors) {
    return null;
  }

  if (!errors[field]) {
    return null;
  }

  return (
    <div className='errors-container'>
      <ul style={{ listStyle: 'none', paddingLeft: '10px' }}>
        {errors[field].map((error, i) => (
          <li key={`e_${i}`}>{error}</li>
        ))}
      </ul>
    </div>
  );
};

export default InlineError;
