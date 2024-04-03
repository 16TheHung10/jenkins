import React, { Fragment } from "react";
import "./listUploadedImage.style.scss";
import { Col, Row } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";
const ListUploadedImage = ({ listData, onRemoveImage }) => {
  return (
    <Fragment>
      {listData ? (
        <Row gutter={[16, 16]} id="list_uploaded_image">
          {listData.map((item, index) => {
            return (
              <Col span={8} key={`uploaded_image_${index}`}>
                <div className="relative">
                  <FontAwesomeIcon
                    icon={faTimes}
                    className="remove_icon"
                    onClick={() => {
                      onRemoveImage(index);
                    }}
                  />
                  <img src={item.url} alt={item.imgName} />
                </div>
              </Col>
            );
          })}
        </Row>
      ) : null}
    </Fragment>
  );
};

export default ListUploadedImage;
