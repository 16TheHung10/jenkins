import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';

import ContentModel from 'models/ContentModel';
// import DeviceModel from "models/DeviceModel";
// import CommonModel from "models/CommonModel";
import { AlertHelper } from 'helpers';

import JoditEditor from 'jodit-react';

const ContentdEdit = React.forwardRef((props, ref) => {
  const [data, setData] = useState([]);

  const editor = useRef(null);
  const [textAreaValue, setTextAreaValue] = useState('');

  const config = {
    readonly: false,
  };

  const showAlert = (msg, type = 'error') => {
    AlertHelper.showAlert(msg, type);
  };

  useImperativeHandle(ref, () => ({
    handleSave() {
      let type = props.type;
      let model = new ContentModel();

      let params = {
        content: textAreaValue,
      };

      model.putList(type, params).then((res) => {
        if (res.status) {
          showAlert(res.message, 'success');
        } else {
          showAlert(res.message);
        }
      });
    },
  }));

  const fetchData = async () => {
    let type = props.type;
    let model = new ContentModel();
    await model.getList(type).then((res) => {
      if (res.status && res.data.content) {
        let content = res.data.content.content;
        let code = res.data.content.code;
        let name = res.data.content.name;
        let template = res.data.content.template;

        setTextAreaValue(content);
      }
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="row">
      <JoditEditor
        ref={editor}
        value={textAreaValue}
        config={config}
        onBlur={(newContent) => setTextAreaValue(newContent?.target?.innerHTML)}
        onChange={(newContent) => {}}
      />
    </div>
  );
});

export default React.memo(ContentdEdit);
