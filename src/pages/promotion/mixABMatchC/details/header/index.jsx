import { Switch } from 'antd';
import Block from 'components/common/block/Block';
import WarningNote from 'components/common/warningNote/WarningNote';
import CONSTANT from 'constant';
import moment from 'moment';
import React from 'react';

const PromotionMixABMatchCDetailsHeader = ({ promotionCode, isUpdate, updatedBy, data, StatusComp, Title }) => {
  return (
    <Block id="header">
      <div className="flex items-center justify-content-between">
        <div className="">
          {/* {promotionCode ? <StatusComp /> : null} */}
          <Title />
          {data?.updatedDate && (
            <p className="hint m-0">
              Latest update:{moment(data?.updatedDate).format(CONSTANT.FORMAT_DATE_IN_USE_FULL)} by{' '}
              <span className="font-bold color-primary">{data?.updatedBy}</span>
            </p>
          )}
        </div>
        <WarningNote xl={8}>
          <div className="cl-red bg-note">
            <strong>Lưu ý chức năng:</strong>
            <br />
            - Tên của khuyến mãi phải rõ ràng, chi tiết, thể hiện được mục đích của khuyến mãi.
            <br />
            - Chương trình khuyến mãi sẽ được cập nhật qua ngày.
            <br />
            - Thời gian áp dụng phải sau ngày hiện tại.
            <br />- Dept. of I&T note: cập nhật thông tin đã đăng ký với cơ quan, tổ chức nhà nước.
          </div>
        </WarningNote>
      </div>
    </Block>
  );
};

export default PromotionMixABMatchCDetailsHeader;
