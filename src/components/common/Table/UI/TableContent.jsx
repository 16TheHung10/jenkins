import { Table, Switch } from "antd";
import { StringHelper } from "helpers";
import React, { useMemo, useState } from "react";
const { Column, ColumnGroup } = Table;

const TableContent = ({
  dataTable,
  th,
  rowKey,
  loading,
  expandedRowRender,
  showExpand = false,
  disabled,
  ...props
}) => {
  const [isExpand, setIsExpand] = useState(true);

  const renderColumns = useMemo(() => {
    let currentIndex = -1;
    return th?.map((item, index) => {
      if (typeof item.field === "string") {
        if (item.children) {
          return (
            <Column title={item.field} key={`th-${index}`} {...item.props}>
              {item.children?.map((item2, index2) => {
                currentIndex += 1;
                return (
                  <Column
                    title={item2.field}
                    {...item2.props}
                    dataIndex={Object.keys(rowKey)?.[currentIndex]}
                    key={`th-${index}-${index2}`}
                  />
                );
              })}
            </Column>
          );
        }
        currentIndex += 1;
        return (
          <Column
            {...item.props}
            title={item.field}
            dataIndex={Object.keys(rowKey)?.[currentIndex]}
            key={`th-${index}`}
          />
        );
      }
      return item.field;
    });
  }, [dataTable, th]);

  const formatDataTable = useMemo(() => {
    return dataTable?.map((item, index) => {
      for (let key of Object.keys(item)) {
        if (typeof item[key] === "number") {
          item[key] = StringHelper.formatPrice(item[key]);
        }
      }
      return item;
    });
  }, [dataTable]);

  const dataSource = useMemo(() => {
    return formatDataTable?.map((item, index) => {
      let row = {};
      for (let fieldName of Object.keys(rowKey) || []) {
        if (typeof fieldName === "string") {
          let concatValue = "";
          for (let field of rowKey[fieldName]?.split("-")) {
            if (item[field]) {
              concatValue += ` ${item[field]}`;
            } else {
              concatValue += `-`;
            }
          }
          row = {
            ...row,
            [fieldName]: concatValue?.trim(),
            key: `row-${index}`,
          };
        }
      }
      return row;
    });
  }, [dataTable, rowKey]);

  return (
    <div className="w-full">
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
        disabled={true}
        className={`${isExpand ? "expand" : "shrink"} w-fit`}
        scroll={{ x: true }}
        bordered
        {...props}
        expandable={{ expandedRowRender }}
        loading={loading}
        dataSource={dataSource}
      >
        {renderColumns}
      </Table>
    </div>
  );
};

export default TableContent;
