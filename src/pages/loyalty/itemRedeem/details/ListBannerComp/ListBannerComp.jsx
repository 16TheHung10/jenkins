import Image from 'components/common/Image/Image';
import React from 'react';
import { StringHelper } from 'helpers';
const ListBannerComp = ({ image }) => {
  if (!image) return null;
  return (
    <div className="" style={{ height: '180px', borderRadius: '5px', overflow: 'hidden' }}>
      <div className="h-full upload_image_content">
        <Image src={StringHelper.isBase64(image) ? image : `${image}?random=${Date.now()}`} style={{ width: `100%`, height: '100%' }} />
      </div>
    </div>
  );
};

export default ListBannerComp;
