const ImageHelper = {
  getImageUrlByPromotion: (promotionCode, itemCode) => {
    const baseUrl = process.env.REACT_APP_API_EXT_MEDIA_GET;
    return (
      baseUrl +
      `/promotion/${promotionCode}/${itemCode}.jpg?random=${Date.now()}`
    );
  },
};
export default ImageHelper;
