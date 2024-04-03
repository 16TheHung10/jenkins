import { Button, Input } from "antd";
import React, { useRef, useState } from "react";
import { actionCreator, useIconMenuContext } from "contexts";

const useAddIconMenu = (title = "Select icon") => {
  const { state, dispatch } = useIconMenuContext();
  const [selectedIcon, setSelectedIcon] = useState();
  const [preview, setPreview] = useState("");
  const [iconInputValue, setIconInputValue] = useState("");
  const [errors, setErrors] = useState(null);

  const inputRef = useRef(null); // Tham chiếu đến ô input

  const onSetSelectedIcon = (value) => {
    setSelectedIcon(value);
  };
  const createMarkup = (htmlString) => {
    return { __html: htmlString };
  };
  const convertElementToClassName = (value) => {
    const regex = /class="([^"]*)"/;
    const match = value.match(regex);
    const classValue = match ? match[1] : "";
    return classValue;
  };
  const handleChange = (e) => {
    const { value } = e.target;
    setIconInputValue(value);
    // const regex = /class="([^"]*)"/;
    // const match = value.match(regex);
    // const classValue = match ? match[1] : '';
    // setPreview({ html: value, className: classValue });
  };
  const handleAddNewIcon = () => {
    const value = inputRef.current?.input.value;

    if (!value) {
      setErrors({ message: "Please input icon element" });
      return;
    }
    const regex = /class="([^"]*)"/;
    const match = value.match(regex);
    const classValue = match ? match[1] : "";
    const iconData = { html: value, className: classValue };
    // inputRef.current = null;
    setIconInputValue("");
    dispatch(
      actionCreator("SET_ICONS", [
        ...state.icons,
        { iconClass: iconData?.className },
      ]),
    );
  };
  const Component = () => {
    return (
      <div className="section-block mt-15 w-full">
        <div className=" mt-10">
          <p>{title} </p>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              display: "flex",
              flexWrap: "wrap",
            }}
            className="flex m-0 menu-icons"
          >
            {state?.icons?.map((item, index) => {
              return (
                <li
                  style={{
                    cursor: "pointer",
                    width: "50px",
                    height: "50px",
                    border: `1px solid ${
                      selectedIcon?.iconClass === item.iconClass
                        ? "var(--primary-color)"
                        : "#cacaca"
                    }`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "5px",
                  }}
                  className="icon-item"
                  onClick={() => onSetSelectedIcon(item)}
                  key={`icon-${index}`}
                >
                  <i className={item.iconClass}></i>
                </li>
              );
            })}
          </ul>
        </div>

        <hr />

        <div className=" mt-10" style={{ transition: "all 0.3s" }}>
          <p className="flex items-center">
            Add new icons{" "}
            <a
              target="_blank"
              className="fs-12 ml-10"
              href="https://fontawesome.com/v5/search"
            >
              ( Browse icons )
            </a>
          </p>
          <div className="flex items-start gap-10">
            <div className="flex items-start flex-col " style={{ flex: 1 }}>
              <Input
                className="w-full"
                ref={inputRef}
                placeholder='Example: <i class="fas fa-yin-yang"></i>'
                value={iconInputValue}
                onChange={handleChange}
              />
              <p className="error-text-12">{errors?.message}</p>
            </div>
            <Button onClick={handleAddNewIcon}>Add</Button>
          </div>
          <div className="flex items-center gap-10">
            <p className="m-0">Preview</p>
            <i className={convertElementToClassName(iconInputValue)}></i>
          </div>
          {/* <div className="mt-10 mb-10 flex items-center">
            <p className="m-0 mr-10">Preview:</p> <div dangerouslySetInnerHTML={createMarkup(preview?.html)} />
          </div> */}
        </div>
      </div>
    );
  };

  return { Component, selectedIcon, onSetSelectedIcon };
};

export default useAddIconMenu;
