import BackAction from "components/common/backAction/BackAction";
import FCManagementCreateActionHeader from "components/mainContent/fcManagement/actionHeader/FCManagementCreateActionHeader";
import FCManagementDetails from "components/mainContent/fcManagement/details/FCManagementDetails";
import { useAppContext } from "contexts";
import RenderFieldBuilder from "helpers/RenderFieldsBuilder";
import RenderFieldsDirector from "helpers/RenderFieldsDirector";
import { StringHelper } from "helpers";
import { useFormFields } from "hooks";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useParams, useHistory } from "react-router-dom";

const FranchiseManagementCreate = () => {
  const { state: appState } = useAppContext();
  const params = useParams();
  const history = useHistory();
  const ExlucdesDisabledFieldsInitial = ["storeCode", "date"];
  const [exlucdesDisabledFields, setExcludesDisabledFields] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  /**
   * Generate fields using builder pattern and disable or not filed base on 'excludesDisabledFIelds'
   */
  const fieldInputs = () => {
    const director = new RenderFieldsDirector(RenderFieldBuilder);
    let arrayFields = director.fcManagementDetails({
      selectedCity,
      selectedDistrict,
    });

    if (exlucdesDisabledFields?.length > 0) {
      for (let i in arrayFields) {
        if (
          arrayFields[i]?.name &&
          !exlucdesDisabledFields?.includes(arrayFields[i].name)
        )
          arrayFields[i] = { ...arrayFields[i], disabled: true };
      }
    }

    return arrayFields;
  };

  const onSubmit = (value) => {};

  const hookFields = useFormFields({
    fieldInputs: fieldInputs(),
    onSubmit,
    watches: ["storeCode", "date", "fcCity", "fcDistrict"],
  });

  const initialData = useMemo(() => {
    return { promotionName: "cc" };
  }, []);

  /**
   * Toggle disable fields base on value of storeCode and date
   */
  // useEffect(() => {
  //   if (!hookFields.getValues().storeCode || !hookFields.getValues().date) {
  //     setExcludesDisabledFields(ExlucdesDisabledFieldsInitial);
  //   } else {
  //     setExcludesDisabledFields(false);
  //   }
  // }, [hookFields.getValues().storeCode, hookFields.getValues().date]);

  /**
   * Re-fetch options of disricts
   */
  useEffect(() => {
    const cityCode = hookFields.getValues().fcCity;
    setSelectedCity(cityCode);
    if (cityCode === null || cityCode === undefined) {
      hookFields.setValue("fcDistrict", null);
      hookFields.setValue("fcWard", null);
    }
  }, [hookFields.getValues().fcCity]);

  /**
   * Re-fetch options of ward
   */
  useEffect(() => {
    const districtCode = hookFields.getValues().fcDistrict;
    if (districtCode === null || districtCode === undefined) {
      hookFields.setValue("fcWard", null);
    }
    setSelectedDistrict(districtCode);
  }, [hookFields.getValues().fcDistrict]);

  return (
    <section>
      <FCManagementCreateActionHeader onSave={hookFields.onSubmitHandler} />
      <BackAction className="mt-15" title="Create new franchise" />
      <FCManagementDetails hookFields={hookFields} initialData={initialData} />
    </section>
  );
};

export default FranchiseManagementCreate;
