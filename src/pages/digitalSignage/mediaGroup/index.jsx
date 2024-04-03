import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Drawer, Form, Spin, Tabs } from 'antd';
import MainTable from 'components/common/Table/UI/MainTable';
import { TableDigitalSignageGroupData } from 'data/render/table';
import moment from 'moment';
import DigitalSignageGroupFormDetails from 'pages/digitalSignage/mediaGroup/form/details';
import useGroupDetailsQuery from 'pages/digitalSignage/mediaGroup/hooks/useGroupDetailsQuery';
import useGroupQuery from 'pages/digitalSignage/mediaGroup/hooks/useGroupQuery';
import DigitalSignageMediaGroupFormSearch from 'pages/digitalSignage/mediaGroup/form/search';
import DigitalSignageNav from '../nav';
import useCreateGroupMutation from 'pages/digitalSignage/mediaGroup/hooks/useCreateGroupMutation';
import useUpdateGroupMutation from 'pages/digitalSignage/mediaGroup/hooks/useUpdateGroupMutation';
import DigitalSignageGroupFormMediaDetails from 'pages/digitalSignage/mediaGroup/form/mediaDetails';
import useUpdateGroupMediaMutation from 'pages/digitalSignage/mediaGroup/hooks/useUpdateGroupMediaMutation';
import useTVTypesQuery from 'pages/digitalSignage/tv/hooks/useTVTypesQuery';
import useDeleteGroupMutation from 'pages/digitalSignage/mediaGroup/hooks/useDeleteGroupMutation';
const initialValue = {
  mode: '',
  groupName: '',
  groupType: '',
  medias: [],
  applyDates: [],
  times: [],
};
const DigitalSignageMediaGroup = () => {
  const [isShowDrawerUpdate, setIsShowDrawerUpdate] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState();
  const [searchParams, setSearchParams] = useState({ keyword: '' });
  const [form] = Form.useForm();
  const [formMedia] = Form.useForm();
  const [formSearch] = Form.useForm();
  const groupQuery = useGroupQuery({ searchParams });
  const groupDetailQuery = useGroupDetailsQuery({ groupCode: selectedGroup?.groupCode });
  const createGroupMutation = useCreateGroupMutation();
  const updateGroupMutation = useUpdateGroupMutation({ groupCode: selectedGroup?.groupCode });
  const updateGroupMediaMutation = useUpdateGroupMediaMutation({ groupCode: selectedGroup?.groupCode });
  const deleteGroupMutation = useDeleteGroupMutation();

  const typeQuery = useTVTypesQuery();

  const handleSetSearchParams = useCallback(
    (value) => {
      setSearchParams(value);
    },
    [searchParams]
  );

  const handleResetField = (data) => {
    if (!data) {
      form.setFieldsValue({ ...initialValue });
      return;
    }
    const dateMap = new Map();
    for (let date of data.applyDates) {
      if (!dateMap.has(date.applyDate)) {
        dateMap.set(date.applyDate, [{ frame: [moment(date.startTime, 'HH:mm'), moment(date.endTime, 'HH:mm')] }]);
      } else {
        const currentValue = dateMap.get(date.applyDate);
        currentValue.push({ frame: [moment(date.startTime, 'HH:mm'), moment(date.endTime, 'HH:mm')] });
        dateMap.set(date.applyDate, currentValue);
      }
    }
    const dateArraySorted = Array.from(dateMap.keys())?.sort((a, b) => moment(a).diff(moment(b)));
    const resetValues = {
      ...data,
      medias: data.medias?.sort((a, b) => a.mediaOrder - b.mediaOrder)?.map((item) => ({ mediaCode: item.mediaCode })),
      applyDates:
        dateArraySorted?.length > 0
          ? [moment(new Date(dateArraySorted[0])), moment(new Date(dateArraySorted[dateArraySorted.length - 1]))]
          : null,
      times: dateMap.values().next().value,
    };
    form.setFieldsValue({ ...resetValues });
    formMedia.setFieldsValue({ medias: resetValues.medias });
    return resetValues;
  };

  const toggleShowDrawerUpdate = useCallback(
    (groupData) => {
      setSelectedGroup(groupData.groupCode ? groupData : null);
      setIsShowDrawerUpdate((prev) => !prev);
    },
    [isShowDrawerUpdate, selectedGroup]
  );

  const tabItems = useMemo(() => {
    const tabs = [
      {
        key: '1',
        label: `Group's info`,
        children: (
          <DigitalSignageGroupFormDetails
            form={form}
            groupMutation={createGroupMutation}
            updateGroupMutation={updateGroupMutation}
            selectedGroup={selectedGroup}
          />
        ),
      },
    ];
    if (selectedGroup?.groupCode) {
      tabs.push({
        key: '2',
        label: `Group's media`,
        children: (
          <DigitalSignageGroupFormMediaDetails
            form={formMedia}
            updateGroupMediaMutation={updateGroupMediaMutation}
            selectedGroup={selectedGroup}
          />
        ),
      });
    }
    return tabs;
  }, [selectedGroup, form]);

  useEffect(() => {
    handleResetField(groupDetailQuery.data);
  }, [groupDetailQuery.data]);

  return (
    <DigitalSignageNav>
      <div className="section-block mt-15" id="mediaGroupSearch">
        <DigitalSignageMediaGroupFormSearch
          form={formSearch}
          onOpenFormCreate={toggleShowDrawerUpdate}
          onSetSearParams={handleSetSearchParams}
        />
      </div>
      <div className="section-block mt-15" id="mediaGroupSearchResult">
        <MainTable
          className="w-full"
          loading={groupQuery.isLoading}
          columns={TableDigitalSignageGroupData.columns({
            onOpenFormEdit: toggleShowDrawerUpdate,
            typeQuery,
            deleteGroupMutation,
          })}
          dataSource={Object.values(groupQuery.data || {}) || []}
        />
      </div>
      <Drawer width={700} open={isShowDrawerUpdate} onClose={toggleShowDrawerUpdate} footer={false}>
        {groupDetailQuery.isLoading ? (
          <div className="w-full h-full center">
            <Spin />
          </div>
        ) : selectedGroup ? (
          <Tabs className="" defaultActiveKey="1" items={tabItems} />
        ) : (
          <DigitalSignageGroupFormDetails
            form={form}
            groupMutation={createGroupMutation}
            updateGroupMutation={updateGroupMutation}
            selectedGroup={selectedGroup}
          />
        )}
      </Drawer>
    </DigitalSignageNav>
  );
};

export default DigitalSignageMediaGroup;
