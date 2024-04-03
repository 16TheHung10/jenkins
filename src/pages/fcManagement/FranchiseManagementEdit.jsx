import BackAction from "components/common/backAction/BackAction";
import FCManagementCreateActionHeader from "components/mainContent/fcManagement/actionHeader/FCManagementCreateActionHeader";
import FCManagementDetails from "components/mainContent/fcManagement/details/FCManagementDetails";
import RenderFieldBuilder from "helpers/RenderFieldsBuilder";
import RenderFieldsDirector from "helpers/RenderFieldsDirector";
import { useFormFields } from "hooks";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useParams } from "react-router-dom/";

const FranchiseManagementEdit = () => {
  const [disabledFields, setDisabledFields] = useState(true);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  const params = useParams();

  const fieldInputs = (disabledArray) => {
    const director = new RenderFieldsDirector(RenderFieldBuilder);
    let array = director.fcManagementDetails({
      selectedCity,
      selectedDistrict,
    });

    if (disabledArray) {
      for (let i in array) {
        array[i] = { ...array[i], disabled: true };
      }
    }
    return array;
  };

  const onSubmit = (value) => {};

  const hookFields = useFormFields({
    fieldInputs: fieldInputs(disabledFields),
    onSubmit,
    watches: ["fcCity", "fcDistrict"],
  });
  const initialData = useMemo(() => {
    return { promotionName: "cc" };
  }, []);

  useEffect(() => {
    const cityCode = hookFields.getValues().fcCity;
    setSelectedCity(cityCode);
    if (cityCode === null || cityCode === undefined) {
      hookFields.setValue("fcDistrict", null);
      hookFields.setValue("fcWard", null);
    }
  }, [hookFields.getValues().fcCity]);

  useEffect(() => {
    const districtCode = hookFields.getValues().fcDistrict;
    if (districtCode === null || districtCode === undefined) {
      hookFields.setValue("fcWard", null);
    }
    setSelectedDistrict(districtCode);
  }, [hookFields.getValues().fcDistrict]);

  const BackTitle = () => {
    return (
      <>
        Edit franchise <span className="color-primary">#{params.id}</span>
      </>
    );
  };
  return (
    <section>
      <FCManagementCreateActionHeader onSave={hookFields.onSubmitHandler} />
      <BackAction className="mt-15" title={<BackTitle />} />
      <FCManagementDetails hookFields={hookFields} initialData={initialData} />
    </section>
  );
};

export default FranchiseManagementEdit;
