import React, { useContext, useMemo, useState } from "react";
import { Context } from "./index";
import { StringHelper } from "helpers";
import BaseButton from "components/common/buttons/baseButton/BaseButton";
function ResultTable(props) {
  const { titleTable, setTitleTable } = props;

  const context = useContext(Context);

  const [listShow, setListShow] = useState([]);

  React.useEffect(() => {
    let arr = context.resData.get;

    if (Array.isArray(arr)) {
      arr.map((x) => (x["id"] = StringHelper.randomKey()));
      setListShow(arr);
    }
  }, [context.resData.get, listShow]);

  const handleUpdateEdit = (item) => {
    context.isIdUpdate.set(true);
    const data = [...context.resData.get];

    const target = data.filter((x) => x.id === item.id).shift();

    const pos = data.findIndex((x) => x.id === item.id);
    context.editIndex.set(pos);
    let objIpField = { ...context.ipField.get };

    Object.keys(target).map((x) => {
      if (x !== "id") {
        Object.keys(objIpField).map((el) => {
          if (x === el) {
            objIpField[el] = target[x];
          }
        });
      }
    });

    context.ipField.set(objIpField);
  };

  const resetForm = () => {
    context.isIdUpdate.set(false);

    let objReset = { ...context.ipField.get };

    Object.keys(objReset).map((x) => {
      objReset[x] = "";
    });

    context.ipField.set(objReset);
  };

  const handleDeleteItem = (item) => {
    const data = [...context.resData.get];

    const target = data.filter((x) => x.id === item.id).shift();

    const newList = data.filter((x) => x.id !== target.id);
    resetForm();
    setListShow(newList);
    context.resData.set(newList);
  };

  const handleReturnList = (list) => {
    if (!Array.isArray(list) || list.length <= 0) return;

    let keys = [];
    Object.keys(context.ipField.get).map((el) => {
      if (el !== "id") {
        keys.indexOf(el) === -1 &&
          context.ipField.get[el] !== "" &&
          keys.push(el);
      }
    });

    let values = [];
    Object.keys(context.ipField.get).map((el) => {
      if (el !== "id") {
        values.indexOf(context.ipField.get[el]) === -1 &&
          context.ipField.get[el] !== "" &&
          values.push(context.ipField.get[el]);
      }
    });

    let newList = [];
    if (values.length === 0) {
      newList = list;
    } else {
      newList = list.filter((x) => {
        return keys.every((y) => {
          return values.includes(x[y]);
        });
      });
    }

    return newList;
  };

  const bodyContent = useMemo(() => {
    const list = handleReturnList(listShow);

    return (
      <div className="section-block app_container mb-15">
        <section>
          <div
            className="wrap-table htable"
            style={{ maxHeight: "calc(100vh - 300px)" }}
          >
            <table className="table table-hover table-expiry">
              <thead>
                <tr>
                  {titleTable.map((x, index) => (
                    <th key={index}>{x}</th>
                  ))}

                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {list !== undefined && list.length !== 0
                  ? list.map((item, index) => (
                      <tr key={index} className="itemFilter">
                        {titleTable.map((x, index2) => (
                          <td key={index2}>{item[x]}</td>
                        ))}

                        <td>
                          <div className="flex items-center gap-10">
                            <BaseButton
                              iconName="edit"
                              onClick={() => handleUpdateEdit(item)}
                            ></BaseButton>
                            <BaseButton
                              iconName="delete"
                              color="error"
                              onClick={() => handleDeleteItem(item)}
                            ></BaseButton>
                          </div>
                        </td>
                      </tr>
                    ))
                  : null}
              </tbody>
            </table>
            {list !== undefined && list.length === 0 ? (
              <div className="table-message">Item not found</div>
            ) : null}
          </div>
        </section>
      </div>
    );
  });

  return bodyContent;
}

export default React.memo(ResultTable);
