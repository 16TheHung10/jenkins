const TableHelper = {
  renderFilter: (key, dataTable, label) => {
    const map = new Map();
    for (let value of dataTable || []) {
      if (!map.has(value[key])) {
        map.set(value[key], { key: value[key], label: value[label] });
      }
    }
    const newArray = [...map]?.map((item, index) => {
      return {
        text:
          item?.[1].key +
          `${item[1].label ? " - " : " "}` +
          (item?.[1].label || ""),
        value: item?.[0],
      };
    });
    if (typeof newArray[0]?.text === "string") {
      newArray.sort((a, b) => a.text.localeCompare(b.text));
    } else {
      newArray.sort((a, b) => a.text - b.text);
    }
    return newArray;
  },
};
export default TableHelper;
