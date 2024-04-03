import { Button, Switch, Table, Tooltip } from 'antd';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';
import Icons from 'images/icons';
import React, { useMemo, useState } from 'react';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
const MainTable = ({
  dataSource,
  columns,
  loading,
  showExpand = false,
  pagination,
  isFullScreen = false,
  ...props
}) => {
  const [isExpand, setIsExpand] = useState(true);
  const newDataSource = useMemo(() => {
    return dataSource?.map((item, index) => ({ ...item, key: item.key || index })) || [];
  }, [dataSource]);

  const handle = useFullScreenHandle();
  return (
    <FullScreen handle={handle}>
      {isFullScreen ? (
        <div className="w-full" style={{ textAlign: 'right' }}>
          <Tooltip placement="left" title={`${handle.active ? 'Exit full screen' : 'Full screen'}`}>
            <div className="w-fit" style={{ padding: 5, background: '#d8d8d8', borderRadius: 5, marginLeft: 'auto' }}>
              {handle.active ? (
                <Icons.Shrink
                  onClick={handle.active ? handle.exit : handle.enter}
                  className="cursor-pointer flex"
                  style={{ fill: 'white' }}
                />
              ) : (
                <Icons.Expand
                  onClick={handle.active ? handle.exit : handle.enter}
                  className="cursor-pointer flex"
                  style={{ fill: 'white' }}
                />
              )}
            </div>
          </Tooltip>
        </div>
      ) : null}
      {showExpand ? (
        <Switch
          checkedChildren="Expand Table"
          unCheckedChildren="Expand Table"
          defaultChecked
          checked={isExpand}
          onChange={() => setIsExpand((prev) => !prev)}
          style={{ marginBottom: 10 }}
        />
      ) : null}
      <Table
        // className={isExpand ? 'expand' : 'shrink'}
        pagination={pagination ? { ...pagination, position: ['bottomCenter'] } : false}
        className="w-fit"
        // rowKey={(record) => {
        //   return Date.now();
        // }}
        // scroll={{ x: 500 }}
        bordered
        {...props}
        loading={loading}
        dataSource={newDataSource}
        columns={columns}
        // style={{ overflowX: 'scroll' }}
      />
    </FullScreen>
  );
};

export default React.memo(MainTable);
