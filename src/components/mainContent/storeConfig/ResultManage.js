import React, { useContext, useMemo, useState } from "react";
import { StoreContext } from "components/mainContent/storeConfig";
import StoreConfigModel from "models/StoreConfigModel";
import { AlertHelper } from "helpers";
import BaseButton from "components/common/buttons/baseButton/BaseButton";

function ResultManage(props) {
  const storeContext = useContext(StoreContext);
  const [listShow, setListShow] = useState([]);

  const showAlert = (msg, type = "error") => {
    AlertHelper.showAlert(msg, type);
  };

  const resetForm = () => {
    storeContext.storeItem.set("");
    storeContext.partner.set([{ codeName: "", codeValue: "", template: null }]);

    storeContext.isIdUpdate.set(false);
    storeContext.islock.set(false);
  };

  const handleUpdate = (index, item) => {
    const data = storeContext.resData.get;

    const result = data.filter((x) => x.Name.includes(item.Name));
    const target = result.shift();

    storeContext.storeItem.set(target.Name);
    storeContext.isIdUpdate.set(true);
    storeContext.islock.set(true);

    let list = [];
    if (target.Config === null) {
      list.push({ codeName: "", codeValue: "", template: null });
    } else {
      for (let item in target.Config) {
        if (storeContext.listTemplate.get.includes(item)) {
          list.push({
            codeName: item,
            codeValue: "",
            template: JSON.parse(target.Config[item]),
          });
        } else {
          list.push({
            codeName: item,
            codeValue: target.Config[item],
            template: null,
          });
        }
      }
    }

    storeContext.partner.set(list);

    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  };

  const handleDeleteItem = (index, item) => {
    let answer = window.confirm('Please help me confirm the action "DELETE"');
    if (answer === true) {
      const storeDelete = item.Name;
      deleteStore(storeDelete);
    }
  };

  const deleteStore = async (store) => {
    let model = new StoreConfigModel();

    if (store && store !== "") {
      await model.deleteStoreConfig(store).then((res) => {
        if (res.status) {
          showAlert(res.message, "success");

          const data = [...storeContext.resData.get];
          const result = data.filter((x) => x.Name !== store);
          storeContext.resData.set(result);
          resetForm();
        } else {
          showAlert(res.message);
        }
      });
    }
  };

  const handleReturnList = (list) => {
    if (!Array.isArray(list) || list.length <= 0) return;

    let resultFilter =
      storeContext.storeItem.get !== ""
        ? list.filter((x) =>
            x.Name.toLowerCase().includes(
              storeContext.storeItem.get.toLowerCase(),
            ),
          )
        : list;

    // let resultFilterPartner = storeContext.parterFilter.get !== "" ? resultFilter.filter((x)=>x.Config[storeContext.parterFilter.get] !== storeContext.parterFilter.get ) : resultFilter;
    let resultFilterPartner =
      storeContext.parterFilter.get !== ""
        ? resultFilter.filter(
            (x) => !x.Config.hasOwnProperty(storeContext.parterFilter.get),
          )
        : resultFilter;

    return resultFilterPartner;
  };

  React.useEffect(() => {
    let list = handleReturnList(storeContext.resData.get) || [];

    setListShow(list);
  }, [
    storeContext.storeItem.get,
    storeContext.resData.get,
    storeContext.parterFilter.get,
  ]);

  return (
    <div className="section-block mb-15" style={{ flex: 1 }}>
      <section style={{ minWidth: "100%" }}>
        <div className="wrap-table htable" style={{ minHeight: 550 }}>
          <table className="table table-hover detail-search-rcv">
            <thead>
              <tr>
                <th>STT</th>
                <th>Store</th>
                <th>Partner</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {listShow.map((item, index) => (
                <tr key={index} onDoubleClick={() => handleUpdate(index, item)}>
                  <td>{index + 1}</td>
                  <td>{item.Name}</td>
                  <td>
                    {item.Config !== null && Object.keys(item.Config).length > 0
                      ? Object.keys(item.Config).map((item2, index2) => (
                          <div
                            style={{ display: "block" }}
                            className="terminalsDevice"
                            key={index2}
                          >
                            [{" "}
                            <span
                              style={{ display: "inline-block", minWidth: 90 }}
                            >
                              {item2}
                            </span>
                            <span
                              style={{ display: "inline-block", minWidth: 20 }}
                            >
                              {" "}
                              -{" "}
                            </span>
                            <span>{item.Config[item2]}</span> ]
                          </div>
                        ))
                      : null}
                  </td>
                  <td>
                    <BaseButton
                      iconName={"delete"}
                      color="error"
                      onClick={() => handleDeleteItem(index, item)}
                    ></BaseButton>
                  </td>
                </tr>
              )) ?? null}
            </tbody>
          </table>
          {listShow.length === 0 ? (
            <div className="table-message">Item not found</div>
          ) : null}
        </div>
      </section>
    </div>
  );
}

export default React.memo(ResultManage);
