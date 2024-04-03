import React from "react";
import { useAppContext } from "contexts";
import { actionCreator } from "contexts";

const NavbarBrand = () => {
  const { state: AppState, dispatch: AppDispatch, onGetMenu } = useAppContext();
  const toggleCollapsed = () => {
    AppDispatch(actionCreator("TOGGLE_MENU_COLLAPSE"));
  };
  return (
    <div className="navbar-brand flex items-center gap-10 p-0">
      <i
        onClick={toggleCollapsed}
        style={{
          height: 46,
          display: "flex",
          alignItems: "center",
          justifyContent: `${!AppState.isMenuCollapsed ? "start" : "center"}`,
          background: "transparent",
          color: "var(--primary-color)",
          outline: "none",
          border: "none",
          boxShadow: "none",
          fontSize: 28,
          cursor: "pointer",
        }}
        className="fas fa-th-large"
      ></i>
    </div>
  );
};

export default NavbarBrand;
