import React, { Fragment, useState } from "react";
import { useQuery } from "react-query";
import { UserApi } from "api";
import { Drawer, Modal, Spin, Tooltip } from "antd";
import Icons from "images/icons";
import { StringHelper } from "helpers";
import SuspenLoading from "../loading/SuspenLoading";
const IconShowUserInfo = ({ userID, ...props }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const handleGetUserInfo = async () => {
    const res = await UserApi.getUserInfo(userID);
    if (res.status) {
      return res.data;
    } else {
      throw new Error("Get user info failed");
    }
  };

  const userInfoQuery = useQuery({
    queryKey: ["user/info", userID],
    queryFn: handleGetUserInfo,
    enabled: isClicked,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });
  const onToggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };
  return (
    <Fragment>
      <Tooltip placement="top" title="Click to show user info">
        <Icons.Search
          onClick={() => {
            onToggleModal();
            setIsClicked(true);
          }}
          {...props}
          style={{ cursor: "pointer", fontSize: "10px" }}
        />
      </Tooltip>
      <Drawer
        placement="left"
        title={`#${userID}`}
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        footer={false}
      >
        {userInfoQuery.isLoading ? (
          <div className="flex justify-content-center w-full">
            <Spin size="large" tip="Loading..." />
          </div>
        ) : (
          Object.keys(userInfoQuery.data || {}).map((key) => (
            <p key={key}>
              {StringHelper.camelCaseToString(key)}: {userInfoQuery.data?.[key]}
            </p>
          ))
        )}
      </Drawer>
    </Fragment>
  );
};

export default IconShowUserInfo;
