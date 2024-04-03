import React from "react";
import { useHistory } from "react-router-dom";

const BackAction = ({ title, LastedUpdate, createdDate, ...props }) => {
  const history = useHistory();

  const handleGoBack = () => {
    history.goBack();
  };
  return (
    <div {...props}>
      <div className="flex items-center gap-10">
        <button
          type="button"
          className="btn btn-back"
          style={{ background: "beige" }}
          onClick={handleGoBack}
        >
          Back
        </button>
        <h2 className="name-target">{title}</h2>

        {createdDate ? (
          <h6 className="m-0">Created date: {createdDate}</h6>
        ) : null}
        {LastedUpdate ? <LastedUpdate /> : null}
      </div>
    </div>
  );
};

export default BackAction;
