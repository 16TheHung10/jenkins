import FCManagementOverviewActionHeader from "components/mainContent/fcManagement/actionHeader/FCManagementOverviewActionHeader";
import FCManagementOverview from "components/mainContent/fcManagement/overview/FCManagementOverview";
import { actionCreator, useFCManagementContext } from "contexts";
import { ContextHelper, ObjectHelper, UrlHelper } from "helpers";
import RenderFieldBuilder from "helpers/RenderFieldsBuilder";
import RenderFieldsDirector from "helpers/RenderFieldsDirector";
import { useFormFields } from "hooks";
import React, { useCallback, useEffect } from "react";
import { useQuery } from "react-query";

const FranchiseManagement = () => {
  const fcManagementContext = useFCManagementContext();
  const onSubmit = async (value) => {
    const params = ObjectHelper.removeAllNullValue(value);
    UrlHelper.setSearchParamsFromObject(value);
    fcManagementContext.dispatch(actionCreator("SET_SEARCH_PARAMS", params));
  };

  const fieldInputs = useCallback(() => {
    const director = new RenderFieldsDirector(RenderFieldBuilder);
    const array = director.fcManagementOverview();
    return array;
  }, []);

  const hookFields = useFormFields({
    fieldInputs: fieldInputs(),
    onSubmit,
  });

  async function handleSearch() {
    const res = await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({ status: 1 });
      }, 1000);
    });
    if (res.status) {
    }
    return res;
  }

  useEffect(() => {
    ContextHelper.resetSearchParams(hookFields.reset, fcManagementContext);
  }, [UrlHelper.getSearchParams()]);

  // Query
  const fcManageQuery = useQuery({
    queryKey: [fcManagementContext.state.currentSearchParams],
    queryFn: handleSearch,
    enabled: Boolean(fcManagementContext.state.currentSearchParams),
  });
  // End Query
  if (fcManageQuery.isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <section>
      <FCManagementOverviewActionHeader />
      <FCManagementOverview hookFields={hookFields} />
    </section>
  );
};

export default React.memo(FranchiseManagement);
