import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { FcApi } from "api";
import { message } from "antd";
import { useMutation, useQuery, useQueryClient } from "react-query";
import SuspenLoading from "components/common/loading/SuspenLoading";
import FcMasterNav from "../fcMasterNav/FcMasterNav";
import { StringHelper } from "helpers";
import { useAppContext } from "contexts";
import StoreOfFC from "./storeOfFC/StoreOfFC";
import FcMasterDetailsComp from "../fcMasterDetails/FcMasterDetailsComp";
const FcMasterDetails = () => {
  const queryClient = useQueryClient();
  const params = useParams();
  const { state: AppState } = useAppContext();
  const getLatestSearchParamsOfFCManagementPage = () => {
    const latesttUrl = AppState.menuObject["/fc-master"]?.url;
    const url = new URL(`https://portal.gs25.com.vn${latesttUrl}`);
    const searchObject = StringHelper.convertSearchParamsToObject(url.search);
    return searchObject;
  };

  const handleGetFcDetails = async () => {
    const res = await FcApi.getFCDetails(params.id, params.storeCode);
    if (res.status) {
      return res.data.fcMaster;
    } else {
      message.error(res.message);
      return null;
    }
  };

  const handleFetchStoreOfFC = async () => {
    const res = await FcApi.getStoreOfFC(params.id);
    if (res.status) {
      return res.data;
    } else {
      message.error(res.message);
      return null;
    }
  };

  const storeOfFCQuery = useQuery({
    queryKey: ["fc/store", params.id],
    queryFn: handleFetchStoreOfFC,
    enabled: Boolean(params.id),
  });
  const fcDetailsQuery = useQuery({
    queryKey: ["fcDetails", params.id, params.storeCode],
    queryFn: handleGetFcDetails,
    enabled: Boolean(params.id),
  });

  const handleUpdate = async (value) => {
    const res = await FcApi.updateFCDetails(params.id, value);
    if (res.status) {
      return value;
    } else {
      throw new Error(res.message);
    }
  };

  const handleAddStoreOfFc = async (data) => {
    const res = await FcApi.addStoreOfFC(params.id, data);
    if (res.status) {
      return data;
    } else {
      message.error(res.message);
      throw new Error(res.messsage);
    }
  };

  const handleDeleteStoreOfFc = async ({ item, index }) => {
    const res = await FcApi.deleteStoreOfFC(params.id, {
      storeCode: item.storeCode,
    });
    if (res.status) {
      return index;
    } else {
      throw new Error(res.messsage);
    }
  };
  const muation = useMutation(handleUpdate, {
    onSuccess: (data, context) => {
      message.success("Update FC successfully");
      queryClient.invalidateQueries(["fc"]);
      queryClient.invalidateQueries(["fcDetails"]);
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  const storeFCMutation = useMutation(handleAddStoreOfFc, {
    onSuccess: (data, context) => {
      message.success("Add stores successfully");
      queryClient.setQueryData(["fc/store", params.id], (oldData) => {
        return {
          ...oldData,
          stores: [
            { ...data, storeName: AppState.stores?.[data.storeCode].storeName },
            ...oldData.stores,
          ],
        };
      });
    },
    onError: (error) => {},
  });

  const storeFCDeleteMutation = useMutation(handleDeleteStoreOfFc, {
    onSuccess: (index, context) => {
      message.success("Delete stores successfully");
      queryClient.setQueryData(["fc/store", params.id], (oldData) => {
        const clone = JSON.parse(JSON.stringify(oldData)).stores;
        clone.splice(index, 1);
        console.log(index);
        return { stores: clone };
      });
    },
    onError: (error) => {},
  });

  if (fcDetailsQuery.isLoading) return <SuspenLoading />;
  return (
    <FcMasterNav isDetails taxCode={params.id} storeCode={params.storeCode}>
      <FcMasterDetailsComp
        initialValue={fcDetailsQuery.data}
        onSubmit={muation.mutate}
      />
      {/* <StoreOfFC query={storeOfFCQuery} addMutaion={storeFCMutation} deleteMutaion={storeFCDeleteMutation} /> */}
    </FcMasterNav>
  );
};

export default FcMasterDetails;
