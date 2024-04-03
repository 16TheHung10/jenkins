import { useGoldenTimeContext } from "contexts";
import RenderFieldsHelper from "helpers/RenderFieldsBuilder";
import { useFormFields, useHeaderActions, usePageActions } from "hooks";
import React, { Fragment } from "react";
import { useHistory } from "react-router-dom";
import PrimeTimePromotionDataFetcher from "./PrimeTimePromotionDataFetcher";
import PrimeTimePromotionDataTable from "./PrimeTimePromotionDataTable";

const ActionHeader = () => {
  const history = useHistory();
  const handleCreate = () => {
    history.push("/promotion-prime-time/create");
  };
  const Action = usePageActions(
    [
      {
        name: "New",
        actionType: "info",
        action: handleCreate,
      },
    ],
    [],
  );
  return <Action />;
};

const PrimeTimePromotionMain = () => {
  const history = useHistory();

  const [statePrimeTime, dispatchPrimeTime] = useGoldenTimeContext();
  const headerActions = useHeaderActions();

  const handleClickOnRow = (record) => {
    history.push(`/promotion-prime-time/edit/${record.promotionCode}`);
  };
  const fieldInputs = () => {
    const fieldsFactory = new RenderFieldsHelper();
    const array = [
      fieldsFactory.selectFactory("multipleStore"),
      fieldsFactory.datePickerFactory("range", true),
      fieldsFactory.inputTextFactory("promotionName"),
      fieldsFactory.selectFactory("status"),
    ];
    return array;
  };
  const onSubmit = (value) => {};
  const { formInputs, formValues, onSubmitHandler, reset, getValues } =
    useFormFields({
      fieldInputs: fieldInputs(),
      onSubmit,
    });

  return (
    <Fragment>
      <ActionHeader />
      {/* <BoxShadow>
        <form onSubmit={onSubmitHandler}>
          <Row gutter={[16, 0]}>
            {formInputs?.map((item, index) => {
              return (
                <Col key={`search-primetime-field-${index}`} span={6}>
                  {item}
                </Col>
              );
            })}
            <Col span={6}>
              <Button htmlType="submit" className="btn-danger mt-10">
                Search
              </Button>
            </Col>
          </Row>
        </form>
      </BoxShadow> */}

      <div
        className="section-block mt-15"
        style={{ width: 900, maxWidth: "100%" }}
      >
        <PrimeTimePromotionDataFetcher
          actions={headerActions}
          data={statePrimeTime?.data}
        />
        <PrimeTimePromotionDataTable
          data={statePrimeTime?.data}
          onClickOnRow={handleClickOnRow}
        />
      </div>
    </Fragment>
  );
};

export default PrimeTimePromotionMain;
