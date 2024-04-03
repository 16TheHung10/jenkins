import { message } from "antd";
import { FileHelper, StringHelper } from "helpers";
import { useState } from "react";

const useUploadImage = () => {
  const [listImageUploaded, setListImageUploaded] = useState([]);

  const handleUploadImage = async (files) => {
    if (
      !(
        files !== undefined &&
        files[0] !== undefined &&
        (/^image/.test(files[0].type) || /^png/.test(files[0].type))
      )
    ) {
      message.error("File upload is invalid");
      return;
    }

    if (files[0].size / 1024 > 200) {
      message.error("Max file size < 200KB");
      return;
    }

    let resourceRaw = await FileHelper.convertToBase64(files[0]);
    let resource = await StringHelper.base64Smooth(resourceRaw);
    const imgName =
      files[0]?.name.split(".")[0] +
      Date.now() +
      "." +
      files[0]?.name.split(".")[1];
    setListImageUploaded((prev) => [...prev, { imgName, url: resourceRaw }]);
  };
  const handleUploadSingleImage = async (info, ratito) => {
    const file = info.fileList?.[0]?.originFileObj;
    if (!file) {
      return;
    }
    const isJpgOrPng =
      file?.type === "image/jpeg" ||
      file?.type === "image/png" ||
      file?.type === "image/gif" ||
      file?.type === "image/bmp" ||
      file?.type === "image/webp" ||
      file?.type === "image/svg+xml";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
      return;
    }
    const isLt2M = file.size / 1024 < 200;
    if (!isLt2M) {
      message.error("Image must smaller than 200KB!");
      return;
    }
    try {
      let resourceRaw = await FileHelper.convertToBase64(file, ratito);
      let resource = await StringHelper.base64Smooth(resourceRaw);
      const name =
        file?.name.split(".") + Date.now() + "." + file?.name.split(".")[1];
      setListImageUploaded([{ name, url: resourceRaw }]);
      return true;
    } catch (err) {
      message.error(err.message);
      return false;
    }
  };
  const handleSetListImage = (value) => {
    setListImageUploaded(value);
  };
  const handleRemoveImage = (index) => {
    const cloneListUploadedImage = [...(listImageUploaded || [])];
    cloneListUploadedImage.splice(index, 1);
    setListImageUploaded([...(cloneListUploadedImage || [])]);
  };
  return {
    handleUploadImage,
    handleRemoveImage,
    handleUploadSingleImage,
    handleSetListImage,
    listImageUploaded,
  };
};

export default useUploadImage;
