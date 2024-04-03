import { Button, Col, Row, Upload } from 'antd';
import Image from 'components/common/Image/Image';
import FieldList from 'components/common/fieldList/FieldList';
import React from 'react';

const StepOneCampaignInfo = ({ formProps, imageProps }) => {
  const {
    handleRemoveImage: handleRemoveImageEdit,
    handleUploadSingleImage: handleUploadSingleImageEdit,
    handleSetListImage: handleSetListImageEdit,
    listImageUploaded: listImageUploadedEdit,
  } = imageProps;
  const { formInputsWithSpan, onSubmitHandler, reset, getValues, setValue } = formProps;
  return (
    <div className="section-block mt-10">
      <Row gutter={[16, 0]} className="items-center">
        <FieldList fields={formInputsWithSpan} />
        <Col span={24}>
          <Upload
            action=""
            onChange={async (info) => {
              const res = await handleUploadSingleImageEdit(info);
            }}
            listType="picture"
            fileList={listImageUploadedEdit}
            hide
            maxCount={1}
            showUploadList={false}
            className=" flex w-full"
            style={{ display: 'block' }}
          >
            <div className="flex items-center w-full">
              <Button className=" w-full h-full">Upload image</Button>
            </div>
          </Upload>
          <div className="mt-10">
            {listImageUploadedEdit?.map((image, index) => {
              return <Image style={{ height: '100px' }} src={image.url.includes('gs25') ? image.url + `?random=${Date.now()}` : image.url} alt={image.url} key={image.url} />;
            })}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default StepOneCampaignInfo;

