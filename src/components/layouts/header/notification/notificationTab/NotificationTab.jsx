import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { Empty } from 'antd';
import Image from 'components/common/Image/Image';
import GrabImage from 'images/grab_logo.png';
import GS25Image from 'images/gs25_logo_circle.jpeg';
import ShopeeImage from 'images/shopee_food_logo.png';
import moment from 'moment';

const NotificationTab = ({ data, type }) => {
  const { oldData, newData, notiNumber } = data;

  return (
    <div id="list_item_container">
      {(!newData || newData.length === 0) && oldData?.length === 0 ? (
        <Empty />
      ) : (
        <>
          {newData?.length > 0 ? (
            <Fragment>
              <p
                style={{
                  fontSize: '16px',
                  margin: 0,
                  fontWeight: 700,
                  color: 'black',
                }}
              >
                New
              </p>

              <hr style={{ margin: '10px 0' }} />
              {newData?.map((item, index) => {
                return (
                  <div key={`${item.id}-${index}`} className="">
                    <div className="flex gap-10">
                      <Image
                        src={
                          item.message?.includes('GR')
                            ? GrabImage
                            : item.message?.includes('NW')
                            ? ShopeeImage
                            : GS25Image
                        }
                        style={{ width: 30, height: 30, borderRadius: '50%' }}
                      />
                      <div className="flex items-center w-full" style={{ justifyContent: 'space-between' }}>
                        <p style={{ margin: 0 }}>{item.message}</p>
                        <p style={{ margin: 0, fontSize: '10px' }}>{moment(item.created_date).utc().fromNow()}</p>
                      </div>
                    </div>
                    <hr style={{ margin: '10px 0' }} />
                  </div>
                );
              })}
            </Fragment>
          ) : null}
          {oldData?.length > 0 ? (
            <Fragment>
              <p
                style={{
                  fontSize: '16px',
                  margin: 0,
                  fontWeight: 700,
                  color: 'black',
                }}
              >
                Before
              </p>

              <hr style={{ margin: '10px 0' }} />
              {oldData?.map((item, index) => {
                return (
                  <div key={`${item.id}-${index}`} className="">
                    <div className="flex gap-10">
                      <Image
                        src={
                          item.message?.includes('GR')
                            ? GrabImage
                            : item.message?.includes('NW')
                            ? ShopeeImage
                            : GS25Image
                        }
                        style={{ width: 30, height: 30, borderRadius: '50%' }}
                      />
                      <div className="flex items-center w-full" style={{ justifyContent: 'space-between' }}>
                        <p style={{ margin: 0 }}>{item.message}</p>
                        <p style={{ margin: 0, fontSize: '10px' }}>
                          {moment(new Date(item.createdDate || item.createdDate)).fromNow()}
                        </p>
                      </div>
                    </div>
                    <hr style={{ margin: '10px 0' }} />
                  </div>
                );
              })}
            </Fragment>
          ) : null}
        </>
      )}
    </div>
  );
};

export default NotificationTab;
