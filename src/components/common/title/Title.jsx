import React from 'react';

const Title = ({ children, className, ...props }) => {
  return (
    <h3 className={`name-target m-0  ${className}`} {...props}>
      {children}
    </h3>
  );
};

export default Title;
