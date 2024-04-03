import React from "react";
import Image from "components/common/Image/Image";
import SomeThinkWentWrong from "images/some_think_went_wrong.png";
function Errors({ error }) {
  return (
    <div>
      <div className="w-full flex-col items-center justyfy-content-center m-auto flex justify-center">
        <Image className="m-auto" src={SomeThinkWentWrong} />
        <h3 className="text-center color-primary">
          Please <b>refresh</b> this page or contact IT for support
        </h3>
      </div>
    </div>
  );
}

export default Errors;
