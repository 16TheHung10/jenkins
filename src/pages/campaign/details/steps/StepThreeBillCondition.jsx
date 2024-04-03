import { Button, Col, Row, Table, message } from 'antd';
import FieldList from 'components/common/fieldList/FieldList';
import SectionWithTitle from 'components/common/section/SectionWithTitle';
import { useAppContext, useCampaignContext } from 'contexts';
import { FieldsCampaignData } from 'data/render/form';
import { useFormFields } from 'hooks';
import React from 'react';

const StepThreeBillCondition = ({ formProps, campaignType, current, campaignOptions }) => {
  const { onSetBillConditionPayments, state } = useCampaignContext();
  const { state: AppState } = useAppContext();
  const { formInputsWithSpan } = formProps;
  const { itemOptions, paymentOptions } = campaignOptions;

  const campaignBillConditionFormProps = useFormFields({
    fieldInputs: FieldsCampaignData.fieldAddPayment({
      paymentOptions,
      current,
      campaignType,
      itemOptions,
    }),
    onSubmit: (value) => {
      if (state.billConditionPayments && state.billConditionPayments.findIndex((el) => el[value.code]) !== -1) {
        message.error('Payment method already exists');
        return;
      }
      const formatValue = { [value.code]: value.value };
      onSetBillConditionPayments([formatValue, ...(state.billConditionPayments || [])]);
      campaignBillConditionFormProps.reset();
      return;
    },
  });

  return (
    <div className="section-block mt-10">
      <Row gutter={[16, 0]} className="items-center">
        <FieldList fields={campaignType === 5 ? formInputsWithSpan.slice(0, 1) : formInputsWithSpan} />
      </Row>
      {[5, 3].includes(campaignType) ? null : (
        <SectionWithTitle title="Add payment methods">
          <Row gutter={[16, 0]} className="items-center">
            <FieldList fields={campaignBillConditionFormProps.formInputsWithSpan} />
            <Col span={24}>
              <Button
                onClick={() => {
                  try {
                    campaignBillConditionFormProps.onSubmitHandler();
                  } catch (err) {
                    message.error(err.message);
                  }
                }}
              >
                Add payment method
              </Button>
            </Col>
            <Col span={12}>
              <Table
                className="w-full mt-10"
                dataSource={state.billConditionPayments?.map((item) => ({
                  code: Object.keys(item)[0],
                  value: Object.values(item)[0],
                }))}
                columns={[
                  {
                    title: 'Payment code',
                    dataIndex: 'code',
                    key: 'code',
                    render: (value, record) => {
                      return value ? AppState.paymentmethods?.[value]?.methodName : '-';
                    },
                  },
                  {
                    title: 'Value',
                    dataIndex: 'value',
                    key: 'maxQtyvalue',
                  },
                ]}
              />
            </Col>
          </Row>
        </SectionWithTitle>
      )}
    </div>
  );
};

export default StepThreeBillCondition;

