import React, { useState, useEffect } from "react";
import { StringHelper } from "helpers";

export default function TableTotalSmp(props) {
  const [data, setData] = useState({ data: {} });

  useEffect(() => {
    setData(props.data);
  });

  return (
    <>
      <table className="table table-hover table-total">
        <thead>
          <tr>
            <th className="rule-number">Total amount</th>
            <th className="rule-number">Cashin</th>
            <th className="rule-number">Cashout</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="rule-number">
              {StringHelper.formatQty(data.totalAmount) || 0}
            </td>
            <td className="rule-number">
              {StringHelper.formatQty(data.totalCashIn) || 0}
            </td>
            <td className="rule-number">
              {StringHelper.formatQty(data.totalCastOut) || 0}
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
