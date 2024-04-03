import { Tag, message } from "antd";
import BaseButton from "components/common/buttons/baseButton/BaseButton";
import cityJson from "data/json/city.json";
import districtJson from "data/json/district.json";
import wardJson from "data/json/ward.json";
import { StringHelper, UrlHelper } from "helpers";
import CustomerServiceModel from "models/CustomerServiceModel";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
const CustomerServiceDetails = ({ isUserNotFound, data, onOpenEdit }) => {
  const [userData, setUserData] = useState(data);
  const history = useHistory();

  const handleClickRow = () => {
    const currentSearchParams = UrlHelper.getSearchParamsObject();
    const newParamsObject = {
      ...currentSearchParams,
      selectedCustomer: data.memberNo,
    };
    const searchParams =
      StringHelper.convertObjectToSearchParams(newParamsObject);
    history.replace(searchParams);
    onOpenEdit();
  };
  const handleUpdateCSStatus = async (phone) => {
    // status : 0 : 1
    const model = new CustomerServiceModel();
    const res = await model.updateCSStatus(phone);
    if (res.status) {
      setUserData((prev) =>
        JSON.parse(JSON.stringify({ ...prev, blocked: 0 })),
      );
      message.success("Updated status successfully");
    } else {
      message.error("Update status failed !!!");
    }
  };

  useEffect(() => {
    setUserData(data);
  }, [data]);
  useState(() => {
    if (isUserNotFound) {
      setUserData(null);
    }
  }, [isUserNotFound]);
  return (
    <div>
      {!userData?.memberNo ? null : (
        <div>
          {/* {renderDetail()} */}
          <table className="table table-hover detail-search-rcv w-fit">
            <thead style={{ background: "#1890ff", color: "white" }}>
              <tr>
                <th>Member no</th>
                <th>First name</th>
                <th>Last name</th>
                <th>Email</th>
                {/* <th>Phone number</th> */}
                <th>Birth day</th>
                <th>Current point</th>

                <th>Address</th>
                <th>Ward</th>
                <th>District</th>
                <th>City</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{userData?.memberNo || "-"}</td>
                <td>{userData?.firstName || "-"}</td>
                <td>{userData?.lastName || "-"}</td>
                <td>{StringHelper.hideEmail(userData?.email) || "-"}</td>
                {/* <td>{StringHelper.hidePhoneBumber(userData?.phone)}</td> */}

                <td className="rule-number">
                  {userData?.birthday
                    ? StringHelper.hideDateOfBirth(
                        moment(new Date(userData?.birthday)),
                      )
                    : "-"}
                </td>
                <td style={{ color: "#1890ff", fontWeight: 500 }}>
                  {StringHelper.formatPrice(userData?.totalPoint) || "-"}
                </td>

                <td>
                  {StringHelper.hidePartOfString(userData?.address) || "-"}
                </td>
                <td>
                  {wardJson.find((el) => +el.code === +userData?.wardID)
                    ?.name || "-"}
                </td>
                <td>
                  {districtJson.find((el) => +el.code === +userData?.districtID)
                    ?.name || "-"}
                </td>
                <td>
                  {cityJson.find((el) => +el.code === +userData?.cityID)
                    ?.name || "-"}
                </td>
                <td>
                  <Tag
                    color={`${
                      userData?.active === 0 || userData.blocked
                        ? "red"
                        : "green"
                    }`}
                  >
                    {userData?.active === 0 || userData.blocked
                      ? "Inactive"
                      : "Active"}
                  </Tag>
                </td>
                <td>
                  <BaseButton
                    iconName="edit"
                    onClick={handleClickRow}
                  ></BaseButton>
                </td>
              </tr>
              {userData?.blocked === 1 ? (
                <tr>
                  <td
                    colSpan={11}
                    style={{ background: "#fff1f0", border: "1px solid red" }}
                  >
                    <p
                      className="cl-red m-0"
                      style={{ display: "inline-block" }}
                    >
                      Tài khoản đã bị khoá do đăng nhập sai quá nhiều lần
                    </p>
                    <button
                      onClick={() => handleUpdateCSStatus(userData.phoneSearch)}
                      className="btn-danger ml-10"
                      style={{ padding: "5px 10px" }}
                    >
                      Mở khoá
                    </button>
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CustomerServiceDetails;
