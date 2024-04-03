import React from 'react';
import Image from 'components/common/Image/Image';
import Icons from 'images/icons';
import './style.scss';
const PaymentGroups = ({ paymentMethods, group, groupCode, onOpenCreate, onOpenUpdate }) => {
  return (
    <>
      <h3 className="text-center">{group?.groupPaymentName || 'Orther'}</h3>
      <div className="flex gap-20 wrap" id="paymentGroup">
        <div className="center icon" onClick={onOpenCreate}>
          <Icons.Plus />
        </div>
        {paymentMethods?.map((payment) => {
          return (
            <div className="image">
              {/* <div className="center icon edit" onClick={() => onOpenUpdate(payment)}>
                <Icons.Edit />
              </div> */}
              <Image
                key={payment.methodCode}
                style={{
                  width: '60px',
                  height: '60px',
                  boxShadow: ' #32325d40 0px 2px 5px -1px, #0000004d 0px 1px 3px -1px',
                  borderRadius: '10px',
                }}
                src={`data:image/jpeg;base64,${payment.image}`}
              />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default PaymentGroups;
