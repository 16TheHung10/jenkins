import React, { useEffect } from "react";
import { FcApi } from "api";
import "./style.scss";
import FcMasterNav from "../fcMasterNav/FcMasterNav";
import { useMutation, useQueryClient } from "react-query";
import { StringHelper } from "helpers";
import { message } from "antd";
import FcMasterDetailsComp from "../fcMasterDetails/FcMasterDetailsComp";

const FcMasterCreate = () => {
  const getLatestSearchParamsOfFCManagementPage = () => {
    const url = new URL(
      "http://localhost:3000/fc-master?pageSize=30&pageNumber=1",
    );
    const searchObject = StringHelper.convertSearchParamsToObject(url.search);
    return searchObject;
  };
  const queryClient = useQueryClient();

  const handleCreate = async (value) => {
    const res = await FcApi.createFC(value);
    if (res.status) {
      return value;
    } else {
      throw new Error(res.message);
    }
  };
  const muation = useMutation(handleCreate, {
    onSuccess: (data, context) => {
      message.success("Create FC successfully");
      const currentData = queryClient.getQueryData([
        "fc",
        { ...getLatestSearchParamsOfFCManagementPage() },
      ]);
      if (currentData) {
        queryClient.setQueryData(
          ["fc", { ...getLatestSearchParamsOfFCManagementPage() }],
          {
            ...currentData,
            fcMasters: [data, ...currentData.fcMasters],
          },
        );
      }
    },
    onError: (error) => {
      message.error(error.message);
    },
  });
  return (
    <FcMasterNav>
      <FcMasterDetailsComp onSubmit={muation.mutate} />
    </FcMasterNav>
  );
};

export default FcMasterCreate;
