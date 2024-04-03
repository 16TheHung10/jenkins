const OptionsHelper = {
  convertDataToOptions: (data, valueKey, labelKey) => {
    const labelArray = labelKey?.split("-");
    if (data?.length > 0) {
      return data?.map((item, index) => {
        let labelValue = "";
        labelArray.forEach((el) => (labelValue += ` - ${item?.[el]}`));
        return {
          value: item?.[valueKey],
          label:
            labelArray?.length === 1
              ? item?.[labelKey]?.trim()
              : labelValue?.slice(3).trim(),
          key: `${valueKey}-${index}`,
        };
      });
    }
    return [];
  },

  getOptionsWhenValueIsRepeat: (data, valueKey, labelKeys) => {
    const mapStore = new Map();
    for (let item of data || []) {
      let value = "";
      for (let labelkey of labelKeys) {
        value += `${item[labelkey]} `;
      }
      if (!mapStore.get(item[valueKey])) {
        mapStore.set(item[valueKey], value);
      }
    }
    const res = Array.from(mapStore, ([key, value]) => ({
      value: key,
      label: value,
    }));
    return res;
  },
};
export default OptionsHelper;
