import PromotionUploadImage from "components/common/Image/PromotionUploadImage";
import { useUploadImage } from "hooks";
import React, { useEffect } from "react";

function UploadImageDiscountItemEdit({
  onSetListImages,
  initialImageLits,
  isReset,
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
    if (initialImageLits) {
      handleSetListImage(initialImageLits);
    }
  }, []);
  useEffect(() => {
    if (isReset) {
      handleSetListImage(null);
    }
  }, [isReset]);
  return (
    <PromotionUploadImage
      onChange={handleUploadSingleImage}
      onRemove={handleRemoveImage}
      imageList={listImageUploaded}
      disabledDelete
    />
  );
}

export default UploadImageDiscountItemEdit;
