import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Col, Popover, Row, Upload } from 'antd';
import Image from 'components/common/Image/Image';
import React from 'react';
import './PromotionUploadImage.scss';

const PromotionUploadImage = ({
  onChange,
  onRemove,
  imageList,
  ratio,
  onRemoveOrigin,
  disabledDelete,
  title,
  ...props
}) => {
  const handleRemove = (file) => {
    if (onRemoveOrigin) {
      onRemoveOrigin(file);
    }
    if (onRemove) {
      const index = imageList.findIndex((el) => el.name === file.name);
      if (index !== -1) {
        onRemove(index);
      }
    }
  };
  return (
    <div id="PromotionUploadImage" className=" w-full " {...props}>
      <div className="flex items-center gap-10 w-full">
        <Upload
          action=""
          onChange={(info) => onChange(info, '16/9')}
          onRemove={handleRemove}
          listType="picture"
          fileList={imageList}
          hide
          maxCount={1}
          showUploadList={false}
          className=" flex w-full"
          style={{ display: 'block' }}
        >
          <div className="flex items-center w-full">
            <Button className=" w-full h-full">
              {title || (
                <div className="flex items-center">
                  <span className="">Upload image</span> <span className="ml-10 cl-red"></span>
                  <Popover
                    title={<p className="required">Chú ý</p>}
                    content={
                      <>
                        {ratio ? (
                          <p className="m-0 mt-10 font-10">Tỉ lệ ảnh phải là {ratio}</p>
                        ) : (
                          <p className="m-0 mt-10 font-10">
                            Tỉ lệ ảnh phải là <span className="font-bold">16/9</span>
                          </p>
                        )}
                        <p className="font-10 m-0">
                          Dung lượng ảnh phải nhỏ hơn <span className="font-bold">200KB</span>
                        </p>
                        <p className="font-10 m-0">Không thế xoá ảnh của item nếu ảnh đã được upload</p>
                        <p className="font-10 ">Mỗi item chỉ được upload 1 hình duy nhất ( có thể thay đổi )</p>
                      </>
                    }
                  >
                    <FontAwesomeIcon
                      className="ml-10"
                      style={{
                        fontSize: '25px',
                        color: '#959595',
                        opacity: 0.2,
                        cursor: 'help',
                      }}
                      icon={faQuestionCircle}
                    />
                  </Popover>
                </div>
              )}
            </Button>
          </div>
        </Upload>
      </div>
      {imageList?.length > 0 ? (
        <>
          {imageList.map((image, index) => {
            return (
              <div key={`${image.url}-${index}`} className="w-full mt-10 list_image_uploaded">
                <Row gutter={16} className="h-full">
                  <Col span={8} className="h-full">
                    <Image src={image.url} style={{ height: '100%', aspectRatio: '16/9' }} />
                  </Col>
                  {/* <Col span={16} className="h-full">
                    <p>{image.name}</p>
                  </Col> */}
                </Row>
                {disabledDelete ? null : (
                  <div
                    onClick={() => onRemove(index)}
                    className="delete cursor-pointer"
                    style={{ position: 'absolute', right: '10px', top: '5px' }}
                  >
                    X
                  </div>
                )}
              </div>
            );
          })}
        </>
      ) : null}
    </div>
  );
};

export default PromotionUploadImage;
