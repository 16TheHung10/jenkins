import React, { useContext, useRef, useState } from "react";
import BaseButton from "components/common/buttons/baseButton/BaseButton";
import CustomField from "components/mainContent/content/CustomField";
import { AlertHelper } from "helpers";
import { Context } from "components/mainContent/content";

function FormManage(props) {
  const { titleTable } = props;
  const context = useContext(Context);
  const fieldsRef = useRef([]);
  const isIdUpdate = context.isIdUpdate.get;

  const resetForm = () => {
    let objReset = { ...context.ipField.get };
    Object.keys(objReset).map((x) => {
      objReset[x] = "";
    });
    context.ipField.set(objReset);
  };

  const hanldeAdd = () => {
    let count = 0;
    for (let item in context.ipField.get) {
      if (context.ipField.get[item] === "") {
        fieldsRef.current[count].hanldeFocusSelect();
        return;
      }
      count++;
    }
    const newList = [...context.resData.get];
    newList.push(context.ipField.get);
    context.resData.set(newList);
    handleCancel();
  };

  const hanldeUpdate = () => {
    let count = 0;
    for (let item in context.ipField.get) {
      if (context.ipField.get[item] === "") {
        fieldsRef.current[count].hanldeFocusSelect();
        return;
      }
      count++;
    }
    let newList = [...context.resData.get];
    if (newList && newList[context.editIndex.get]) {
      Object.keys(newList[context.editIndex.get]).map((x) => {
        if (x !== "id") {
          newList[context.editIndex.get][x] = context.ipField.get[x];
        }
      });
    }
    context.resData.set(newList);
    handleCancel();
  };

  const handleCancel = () => {
    context.isIdUpdate.set(false);
    context.editIndex.set(null);
    resetForm();
  };

  return (
    <div className="section-block app_container mb-15 mt-15">
      <div className="form-filter">
        <div className="row">
          <div className="col-md-12">
            <div className="row">
              {titleTable && titleTable.length !== 0
                ? titleTable.map((x, i) => (
                    <div key={i} className="col-md-3">
                      <CustomField
                        name={x}
                        ref={(el) => (fieldsRef.current[i] = el)}
                      />
                    </div>
                  ))
                : ""}

              {!isIdUpdate && (
                <div className="col-md-12">
                  <div className="form-group">
                    <BaseButton iconName="plus" onClick={hanldeAdd}>
                      Add
                    </BaseButton>
                  </div>
                </div>
              )}

              {isIdUpdate && (
                <div className="col-md-12">
                  <div className="form-group">
                    <button
                      type="button"
                      onClick={hanldeUpdate}
                      className="btn btn-success"
                      style={{ height: 38 }}
                    >
                      Update
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="btn btn-success"
                      style={{ height: 38 }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(FormManage);
