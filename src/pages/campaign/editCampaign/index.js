import { Spin, message } from "antd";
import { CampaignApi } from "api";
import { useCampaignContext } from "contexts";
import moment from "moment";
import React, { useEffect, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useHistory, useParams } from "react-router-dom";
import CampaignDetailsMain from "../details/CampaignDetailsMain";
import CampaignNav from "../nav/CampaignNav";

const CreateCampaign = () => {
  const queryClient = useQueryClient();
  const params = useParams();
  const history = useHistory();
  const { onSetAwardItems } = useCampaignContext();
  const handleGetCampaignDetails = async () => {
    const res = await CampaignApi.getCampaignDetails(params.id);
    if (res.status) {
      return res.data?.campaigns;
    } else {
      return null;
    }
  };

  const campaignDetailQuery = useQuery({
    queryKey: ["campaign/details", params.id],
    queryFn: handleGetCampaignDetails,
    enabled: Boolean(params.id),
  });

  const handleUpdateCampaign = async ({
    rest: value,
    imageProps,
    handleUploadImage: onUploadImage,
  }) => {
    const res = await CampaignApi.updateCampaign(params.id, value);
    if (res.status) {
      if (!imageProps.listImageUploaded[0]?.url?.includes("gs25")) {
        onUploadImage(params.id, imageProps.listImageUploaded);
      }
      return value;
    } else {
      throw new Error(res.message);
    }
  };

  const useQueryMutation = useMutation(handleUpdateCampaign, {
    onSuccess: (data) => {
      message.success("Updated campaign successfully");
      queryClient.invalidateQueries(["campaign/details"]);
      queryClient.invalidateQueries(["campaign"]);
      history.push("/campaigns");
    },
    onError: (err) => {
      message.error(err.message);
    },
  });
  const { data } = campaignDetailQuery;

  useEffect(() => {
    if (data?.awardItems) onSetAwardItems(data?.awardItems);
  }, [data]);

  const itemValid = (data) => {
    let res = [];
    if (!data) return res;
    for (let item of data) {
      let itemData = {};
      const { sourceItem, targetItem } = item;
      for (let i in sourceItem) {
        const source = sourceItem[i];
        if (+i === 0) {
          itemData = {
            ...itemData,
            itemsCodeA: source.itemCode,
            itemsNameA: source.itemName,
          };
        } else {
          itemData = {
            ...itemData,
            itemsCodeB: source.itemCode,
            itemsNameB: source.itemName,
          };
        }
      }
      for (let item of targetItem) {
        itemData = {
          ...itemData,
          itemsCodeC: item.itemCode,
          itemsNameC: item.itemName,
        };
      }
      res.push(itemData);
    }
    return res;
  };
  const initialValue = useMemo(() => {
    if (data)
      return {
        ...data,
        storeValid: data.storeValid ? JSON.parse(data.storeValid) : [],
        appliedStore: data.appliedStore ? JSON.parse(data.appliedStore) : [],
        paymentValid: data.paymentValid ? JSON.parse(data.paymentValid) : [],
        items: data.itemValid
          ? Array.isArray(JSON.parse(data.itemValid))
            ? JSON.parse(data.itemValid)
            : JSON.parse(data.itemValid)?.items?.split(",")
          : [],
        maxQty: data.itemValid
          ? !Array.isArray(JSON.parse(data.itemValid))
            ? JSON.parse(data.itemValid)?.maxQty
            : null
          : null,
        itemValid: data?.itemValid
          ? itemValid(JSON.parse(data?.itemValid).exchange)
          : [],
        date: data.startDateValid
          ? [moment(data.startDateValid), moment(data.endDateValid)]
          : null,
        dayOfWeek: data.dayOfWeek ? data.dayOfWeek?.split(",") : [],
        timeFrameQR:
          data.startHourValid || data.startHourValid === 0
            ? [
                moment(`${data.startHourValid.toString()}:00`, "HH:mm"),
                moment(`${data.endHourValid.toString()}:00`, "HH:mm"),
              ]
            : null,
      };
    return null;
  }, [data]);
  return (
    <CampaignNav isDetails campaignID={params.id}>
      {campaignDetailQuery.isLoading ? (
        <div
          className="w-full flex items-center justify-content-center"
          style={{ height: "calc(100vh - 60px)" }}
        >
          <Spin />
        </div>
      ) : (
        <CampaignDetailsMain
          initialValue={initialValue}
          onSubmit={useQueryMutation.mutate}
        />
      )}
    </CampaignNav>
  );
};

export default CreateCampaign;
