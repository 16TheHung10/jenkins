import { Breadcrumb, Col, Row } from "antd";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./style.scss";

const BreadCrumb = ({ ...props }) => {
  const [data, setData] = useState(null);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (isMounted.current) {
      setData(props.data);
    }
  }, [props.data]);

  const bodyContent = useMemo(() => {
    return (
      <>
        {data?.length > 0 ? (
          <div style={{ padding: "0 15px" }}>
            <Row gutter={16}>
              <Col>
                <Breadcrumb className="custom-breadcrumb">
                  {data?.map((element, index) => (
                    <Breadcrumb.Item key={index}>
                      {element.href !== "" ? (
                        <Link to={element.href}>{element.title}</Link>
                      ) : (
                        element.title
                      )}
                    </Breadcrumb.Item>
                  ))}
                </Breadcrumb>
              </Col>
            </Row>
          </div>
        ) : null}
      </>
    );
  }, [data]);

  return bodyContent;
};

export default BreadCrumb;
