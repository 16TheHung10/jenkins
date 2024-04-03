import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Icons from 'images/icons';
import React, { useState } from 'react';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';
import { Popover } from 'antd';
const useShowFilter = (IconComponent) => {
  const [isVisible, setIsVisible] = useState(false);
  const onToggle = () => {
    setIsVisible((prev) => !prev);
  };
  const TriggerComponent = () => {
    return (
      <Popover placement="top" content="Show filter">
        {IconComponent ? (
          <IconComponent onClick={onToggle} />
        ) : (
          <Icons.Filter
            onClick={onToggle}
            style={{ fontSize: '32px', cursor: 'pointer', color: 'gray' }}
            icon={faFilter}
          />
        )}
      </Popover>
    );
  };
  return { TriggerComponent, isVisible, onToggle };
};

export default useShowFilter;
