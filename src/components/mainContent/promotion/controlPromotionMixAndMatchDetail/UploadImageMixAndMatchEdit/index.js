import PromotionUploadImage from "components/common/Image/PromotionUploadImage";
import { useUploadImage } from "hooks";
import React, { useEffect } from "react";

function UploadImageMixAndMatchEdit({
  onSetListImages,
  isReset,
  onChangeReset,
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
  return (
    <PromotionUploadImage
      onChange={handleUploadSingleImage}
      onRemove={handleRemoveImage}
      imageList={listImageUploaded}
    />
  );
}

export default UploadImageMixAndMatchEdit;
