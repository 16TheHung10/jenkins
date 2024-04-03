import { Button } from 'antd';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import './style.scss';
const SubmitBottomButton = ({ title = 'Submit', ...props }) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const observer = useRef();
  const btnSubmitRef = (node) => {
    observer.current = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    });
    if (node) {
      observer.current.observe(node);
    } else {
      observer.current.disconnect();
    }
  };

  useEffect(() => {
    return () => {
      observer.current.disconnect();
    };
  }, []);
  return (
    <>
      <div className={`submit_btn ${!isIntersecting ? 'hiddenBtn' : ''}`}>
        <Button
          type="primary"
          className={`${isIntersecting ? 'w-fit' : 'w-full'}`}
          htmlType="submit"
          style={{ background: '#21bb21', border: 'none' }}
          {...props}
        >
          {title}
        </Button>
      </div>
      <div ref={btnSubmitRef} className=""></div>
    </>
  );
};

export default SubmitBottomButton;
