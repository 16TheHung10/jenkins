import React from 'react';
import './style.scss';
const SectionWithTitle = ({ title, children, ...props }) => {
  return (
    <div id="section_with_title" {...props}>
      <div className="title">{title}</div>
      {children}
    </div>
  );
};

export default SectionWithTitle;

