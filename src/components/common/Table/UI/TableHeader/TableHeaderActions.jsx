import { Button, Col, Row } from "antd";
import { useMemo } from "react";

const TableHeaderActions = ({ fields, onSubmit }) => {
  const renderField = useMemo(() => {
    const html = [];
    for (let field of fields || []) {
      html.push(field.comp);
    }
    return fields?.map((item, index) => {
      return item.comp;
    });
  }, [fields]);

  return (
    <Row
      style={{
        boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
        marginBottom: "20px",
        padding: "10px",
      }}
      gutter={[16, 16]}
    >
      {renderField}
      <Col span={6} style={{ display: "flex", alignItems: "end" }}>
        <Button type="primary" onClick={onSubmit}>
          Search
        </Button>
      </Col>
    </Row>
  );
};

export default TableHeaderActions;
