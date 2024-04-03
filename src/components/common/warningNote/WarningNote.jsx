import { Popover } from 'antd';
import React from 'react';
import Icons from 'images/icons';

const WarningNote = ({ children }) => {
  return (
    <Popover content={children}>
      <Icons.Warning className="breath-animation" style={{ color: 'red', fontSize: 30, cursor: 'pointer' }} />
    </Popover>
  );
};

export default WarningNote;
