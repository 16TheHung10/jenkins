const ObjectHelper = {
  removeAllNullValue(object) {
    Object.keys(object || {}).forEach((key) => {
      (object?.[key] === null ||
        object?.[key] === undefined ||
        object?.[key] === "" ||
        object?.[key].length === 0) &&
        delete object?.[key];
    });
    return object;
  },
};
export default ObjectHelper;
