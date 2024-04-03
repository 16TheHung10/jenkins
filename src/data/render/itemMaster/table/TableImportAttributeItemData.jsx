const TableImportAttributeItemData = {
  columns: () => [
    {
      title: "Item",
      dataIndex: "itemCode",
      key: "itemCode",
      render: (text, record) =>
        text ? text + " - " + (record.itemName || "Invalid item") : +"-",
      onCell: (record) => {
        return {
          style: {
            background: record.isItemValid ? "transparent" : "red",
            color: record.isItemValid ? "black" : "white",
          },
        };
      },
      // sorter: (a, b) => a.promotionName?.localeCompare(b.promotionName),
    },
    {
      title: "Allow StoreTF",
      dataIndex: "allowStoreTF",
      key: "allowStoreTF",
      width: 100,
      render: (text) => text || +"-",
      // sorter: (a, b) => a.promotionName?.localeCompare(b.promotionName),
    },

    {
      title: "Return Condition",
      dataIndex: "returnCondition",
      key: "returnCondition",
      width: 100,
      render: (text) => text || +"-",
      // sorter: (a, b) => a.promotionName?.localeCompare(b.promotionName),
    },
    {
      title: "Return GoodAt",
      dataIndex: "returnGoodAt",
      key: "returnGoodAt",
      width: 100,
      render: (text) => text || +"-",
      // sorter: (a, b) => a.promotionName?.localeCompare(b.promotionName),
    },
    {
      title: "Weight",
      dataIndex: "weight",
      key: "weight",
      width: 100,
      render: (text) => text || +"-",
      // sorter: (a, b) => a.promotionName?.localeCompare(b.promotionName),
    },
    {
      title: "Size Length",
      dataIndex: "sizeLength",
      key: "sizeLength",
      width: 100,
      render: (text) => text || +"-",
      // sorter: (a, b) => a.promotionName?.localeCompare(b.promotionName),
    },
    {
      title: "Size Width",
      dataIndex: "sizeWidth",
      key: "sizeWidth",
      width: 100,
      render: (text) => text || +"-",
      // sorter: (a, b) => a.promotionName?.localeCompare(b.promotionName),
    },
    {
      title: "Size Height",
      dataIndex: "sizeHeight",
      key: "sizeHeight",
      width: 100,
      render: (text) => text || +"-",
      // sorter: (a, b) => a.promotionName?.localeCompare(b.promotionName),
    },
    {
      title: "Pack",
      dataIndex: "pack",
      key: "pack",
      width: 100,
      render: (text) => text || +"-",
      // sorter: (a, b) => a.promotionName?.localeCompare(b.promotionName),
    },
    {
      title: "Carton",
      dataIndex: "carton",
      key: "carton",
      width: 100,
      render: (text) => text || +"-",
      // sorter: (a, b) => a.promotionName?.localeCompare(b.promotionName),
    },
    {
      title: "Pallet",
      dataIndex: "pallet",
      key: "pallet",
      width: 100,
      render: (text) => text || +"-",
      // sorter: (a, b) => a.promotionName?.localeCompare(b.promotionName),
    },
  ],
};
export default TableImportAttributeItemData;
