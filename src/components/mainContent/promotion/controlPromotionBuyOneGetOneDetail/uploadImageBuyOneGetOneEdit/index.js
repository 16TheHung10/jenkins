import PromotionUploadImage from "components/common/Image/PromotionUploadImage";
import { useUploadImage } from "hooks";
import React, { useEffect } from "react";

function UploadImageBuyOneGetOneEdit({
  onSetListImages,
  isReset,
  onChangeReset,
  initialImages,
}) {
  const {
    handleRemoveImage,
    handleUploadSingleImage,
    handleSetListImage,
    listImageUploaded,
  } = useUploadImage();

  useEffect(() => {
    onSetListImages(listImageUploaded);
  }, [listImageUploaded]);

  useEffect(() => {
    if (isReset) {
      handleSetListImage(null);
    }
  }, [isReset]);

  useEffect(() => {
    if (listImageUploaded) {
      onChangeReset(false);
    }
  }, [listImageUploaded]);

  useEffect(() => {
    handleSetListImage(initialImages);
  }, [initialImages]);
  return (
    <PromotionUploadImage
      onChange={handleUploadSingleImage}
      onRemove={handleRemoveImage}
      imageList={listImageUploaded}
      disabledDelete
    />
  );
}

export default UploadImageBuyOneGetOneEdit;
