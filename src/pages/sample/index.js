import React, { useState } from "react";
import FormField from "data/oldVersion/formFieldRender";
import { useFormFields } from "hooks";
import SampleFields from "../../components/mainContent/sample/Fields/SampleFields";
import SampleTable from "components/mainContent/sample/Table/SampleTable.jsx";

const Campaign = () => {
  const [campaignData, setCampaignData] = useState(null);

  const handleSubmit = (value) => {};
  const {
    formInputsWithSpan: formInputs,
    onSubmitHandler,
    reset,
    getValues,
    setValue,
  } = useFormFields({
    fieldInputs: FieldsSampleData.fieldInputs(),
    onSubmit: handleSubmit,
  });
  return (
    <div className="">
      <SampleFields onSubmit={onSubmitHandler} fields={formInputs} />
      <SampleTable data={campaignData} />
    </div>
  );
};

export default Campaign;
