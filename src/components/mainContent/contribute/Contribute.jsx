import { PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, Popover, Upload, message } from "antd";
import { FileHelper, StringHelper } from "helpers";
import ContributeImage from "images/contributeImage.png";
import FeedbackModel from "models/FeedbackModel";
import { useState } from "react";
import ListUploadedImage from "./ListUploadedImage/ListUploadedImage";
import React from "react";
import "./contribute.style.scss";

const Contribute = () => {
  const [fieldsState, setFieldsState] = useState({
    content: "",
    imgUrl: "",
  });

  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState([]);
  const [form] = Form.useForm();

  const handleChangeTextArea = (e) => {
    setFieldsState((prev) => ({ ...prev, content: e.target.value }));
  };
  const onsubmit = async () => {
    const model = new FeedbackModel();
    let image = [];
    for (let file of previewImage) {
      let base64Clean = await StringHelper.base64Smooth(file.url);
      image.push(base64Clean);
    }
    const res = await model.createNewFeedback({
      description: fieldsState?.content,
      image,
    });
    if (res.status) {
      setFileList(null);
      setPreviewImage(null);
      setFieldsState(null);
      form.resetFields();
      message.success("Created new feedback successfully");
    } else {
      message.error(res.message + " feedback");
    }
  };
  const handleConvertToBase64 = async (file) => {
    try {
      if (
        !(
          file !== undefined &&
          (/^image/.test(file.type) || /^png/.test(file.type))
        )
      ) {
        throw new Error("File upload is invalid");
      }
      // if (file.size / 1024 > 200) {
      //     message.error("Max file size < 200KB");
      //     throw new Error("File upload is invalid");
      // }

      let resourceRaw = await FileHelper.convertToBase64(file);
      let resource = await StringHelper.base64Smooth(resourceRaw);
      const imgName =
        file?.name.split(".") + Date.now() + "." + file?.name.split(".")[1];
      return { imgName, url: resourceRaw };
    } catch (err) {
      message.error(err.message);
      throw new Error(err);
    }
  };

  const handleRemoveImage = (index) => {
    const clone = [...(previewImage || [])];
    const cloneFile = [...(fileList || [])];

    clone.splice(index, 1);
    cloneFile.splice(index, 1);

    setPreviewImage(clone);
    setFileList(cloneFile);
  };
  const handleChangeFileUpload = async ({ fileList: newFileList }) => {
    try {
      const listPreview = [];
      for (let file of newFileList) {
        const objectFile = await handleConvertToBase64(file.originFileObj);
        listPreview.push(objectFile);
      }
      setPreviewImage(listPreview);
      setFileList(newFileList);
    } catch (e) {
      message.error(e.message);
    }
  };

  const uploadButton = (
    <div className="flex items-center">
      <PlusOutlined />
      <div
        style={{
          padding: "5px",
        }}
      >
        Upload
      </div>
    </div>
  );
  return (
    <div id="contribute">
      <div
        className="color-primary contribute"
        style={{
          cursor: "pointer",
          fontWeight: "bold",
          paddingTop: 11,
        }}
      >
        <Popover
          className="contribute-popover"
          trigger="click"
          placement="bottomLeft"
          title={null}
          content={
            <div className="contribute_container">
              <div className="contribute_header">
                <img
                  src={ContributeImage}
                  alt="Osam Logo"
                  className="img-fluid logo contribute_image"
                />
              </div>
              <h1 className="title">Build a better future</h1>
              <Upload
                className="uploadImageFeedback"
                showUploadList={false}
                // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                listType="picture-card"
                onChange={handleChangeFileUpload}
                maxCount={3}
                fileList={fileList}
                multiple
              >
                {previewImage?.length >= 3 ? null : uploadButton}
              </Upload>
              <Form
                layout="vertical"
                form={form}
                onFinish={(e) => {
                  onsubmit();
                }}
              >
                <ListUploadedImage
                  listData={previewImage}
                  onRemoveImage={handleRemoveImage}
                />
                <Form.Item
                  label="Description"
                  name="description"
                  rules={[
                    {
                      required: true,
                      message: "Please input your detail for this feedback!",
                    },
                  ]}
                >
                  <Input.TextArea
                    style={{ marginTop: 10 }}
                    rows={4}
                    value={fieldsState?.content}
                    showCount
                    maxLength={1000}
                    placeholder="Enter you feedback"
                    onChange={handleChangeTextArea}
                  />
                </Form.Item>

                <Button htmlType="submit" type="primary">
                  Send
                </Button>
              </Form>
            </div>
          }
        >
          Feedback
        </Popover>
      </div>
    </div>
  );
};

export default Contribute;
