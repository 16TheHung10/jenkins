import { Col, Row, message } from "antd";
import { CustomerServiceApi } from "api";
import CancelAccountFieldComp from "components/mainContent/account/cancelAccount/field/CancelAccountFieldComp";
import CancelAccountFieldCompFilter from "components/mainContent/account/cancelAccount/field/CancelAccountFieldCompFilter";
import CancelAccountTableComp from "components/mainContent/account/cancelAccount/table/CancelAccountTableComp";
import CONSTANT from "constant";
import { FieldsRequestCancelAccountData } from "data/render/form";
import { ArrayHelper, UrlHelper } from "helpers";
import { useFormFields, useShowFilter } from "hooks";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { usePageWithNavContext, actionCreator } from "contexts";
import { PageWithNavActions } from "contexts/actions";
import PageWithNav from "components/layouts/pageWithNav/PageWithNav";
import { useHistory } from "react-router-dom";

const RequestCancelAccounts = () => {
  const { isVisible, TriggerComponent } = useShowFilter();
  const { dispatch } = usePageWithNavContext();

  const [cancelAccounts, setCancelAccounts] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cancelAccountsConst, setCancelAccountsConst] = useState(null);

  // Select options
  const memberCodeOptions = useMemo(() => {
    return cancelAccounts?.map((item) => {
      return { value: item.memberCode, label: item.memberCode };
    });
  }, [cancelAccounts]);

  const handleApproveCancelAccount = async (memberInfo, index) => {
    const { memberCode, reason } = memberInfo;
    const res = await CustomerServiceApi.approveCancelAccount(
      memberCode,
      reason,
    );
    if (res.status) {
      let updatedMember = {
        ...memberInfo,
        deleted: 1,
        updatedDate: Date.now(),
      };
      const clone = JSON.parse(JSON.stringify([...cancelAccounts]));
      clone.splice(index, 1, updatedMember);
      setCancelAccounts(clone);
      setCancelAccountsConst(clone);
      message.success("Approve cancel account successfully");
    } else {
      message.error(res.message);
    }
  };

  const handleGetCancelAccounts = async (value) => {
    const params = {
      startDate: moment(value.date[0]).format(CONSTANT.FORMAT_DATE_PAYLOAD),
      endDate: moment(value.date[1]).format(CONSTANT.FORMAT_DATE_PAYLOAD),
    };
    setIsLoading(true);
    const res = await CustomerServiceApi.getCancelAccounts(params);
    if (res.status) {
      const data = res.data?.listRequest?.sort((a, b) =>
        moment(b.updatedDate).diff(moment(a.updatedDate)),
      );
      setCancelAccounts(data);
      setCancelAccountsConst(data);
    } else {
      message.error(res.message);
    }
    setIsLoading(false);
  };

  const filterAccount = (value) => {
    const filtered = ArrayHelper.multipleFilter(cancelAccountsConst, value);
    setCancelAccounts(filtered);
  };

  const formSearch = useFormFields({
    fieldInputs: FieldsRequestCancelAccountData.fieldInputs(),
    onSubmit: handleGetCancelAccounts,
  });

  const formFilter = useFormFields({
    fieldInputs: FieldsRequestCancelAccountData.fieldInputsFilter({
      memberCodeOptions,
    }),
    onSubmit: filterAccount,
    watches: ["memberCode", "deleted"],
  });

  const { getValues } = formFilter;

  useEffect(() => {
    filterAccount(getValues());
  }, [getValues("memberCode"), getValues("deleted")]);

  useEffect(() => {
    const paramsObject = UrlHelper.getSearchParamsObject();
    const date =
      paramsObject.startDate && paramsObject.endDate
        ? [
            moment(new Date(paramsObject.startDate)),
            moment(new Date(paramsObject.endDate)),
          ]
        : null;
    if (date) {
      formSearch.reset({ date });
      handleGetCancelAccounts({ date });
    }
  }, []);

  useEffect(() => {
    let actionLeft = [
      {
        name: "Member search",
        actionType: "link",
        pathName: "/customer-service",
      },
      {
        name: "Bill search",
        pathName: "/bill-management-customer",
        actionType: "link",
      },
      {
        name: "Delete account",
        pathName: "/request-cancel-accounts",
        actionType: "link",
      },
    ];
    dispatch(actionCreator(PageWithNavActions.SET_ACTIONS_LEFT, actionLeft));
  }, []);
  return (
    <PageWithNav className="">
      {/* <ActionHeader /> */}
      <div className="section-block mt-15">
        <Row gutter={[16, 0]}>
          <Col span={24}>
            <CancelAccountFieldComp
              fieldsProps={formSearch}
              TriggerComponentFilter={TriggerComponent}
              loading={isLoading}
            />
          </Col>
          {isVisible ? (
            <Col span={24}>
              <CancelAccountFieldCompFilter fieldsProps={formFilter} />
            </Col>
          ) : null}

          <Col span={24} className="transition_animate_3">
            <CancelAccountTableComp
              onApproveCancelAccount={handleApproveCancelAccount}
              data={cancelAccounts || []}
              loading={isLoading}
            />
          </Col>
        </Row>
      </div>
    </PageWithNav>
  );
};

export default RequestCancelAccounts;
