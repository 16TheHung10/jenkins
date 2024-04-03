import React, { useEffect } from 'react';
import './style.scss';
import { Radio } from 'antd';
const FooterActionsImage = ({ checked, ...props }) => {
  console.log({ checked });
  useEffect(() => {
    if (checked) {
    }
  }, [checked]);
  return (
    <div id="FooterActionsImage">
      <Radio name="isThumbnail" onClick checked={checked} {...props}>
        Set Thumbnail
      </Radio>
    </div>
  );
};

export default FooterActionsImage;
