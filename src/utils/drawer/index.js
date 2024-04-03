import { Drawer, Tag } from "antd";
import React, { useEffect, useMemo, useState } from "react";

export default function DrawerComp({ children, ...props }) {
  const [open, setOpen] = useState(false);
  const [colorButton, setColorButton] = useState("warning");

  useEffect(() => {
    props.colorBtn && setColorButton(props.colorBtn);
  }, [props.colorBtn]);
  useEffect(() => {
    props.isOpen && setOpen(props.isOpen);
  }, [props.isOpen]);

  const showDrawer = () => {
    // props.onSearch && props.onSearch();
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
    props.updateFilter &&
      props.keyFilter &&
      props.updateFilter(false, props.keyFilter);
  };

  const bodyContent = useMemo(() => {
    return (
      <>
        {/* <Tag color={colorButton} className='cursor' onClick={showDrawer}>{props.btnName || 'Button'}</Tag> */}
        <Drawer
          title={props.title}
          width={props.width || 500}
          onClose={onClose}
          open={open}
          style={{ zIndex: 1031 }}
          // extra={
          //     <Space>
          //         <Button onClick={onClose}>Cancel</Button>
          //         <Button type="primary" onClick={onClose}>
          //             OK
          //         </Button>
          //     </Space>
          // }
        >
          {children}
        </Drawer>
      </>
      //
    );
  }, [props.title, props.width, open, children, props.isOpen, props.keyFilter]);

  return bodyContent;
}
