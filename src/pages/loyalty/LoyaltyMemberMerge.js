import { Button, message, PageHeader, Steps } from "antd";
import React, { useRef, useState } from "react";
import SearchMember from "components/mainContent/loyalty/mergeMemberFn/SearchMember";
import ConfirmMergeMember from "components/mainContent/loyalty/mergeMemberFn/ConfirmMergeMember";
import MainTable from "components/common/Table/UI/MainTable";
import { MergeMemberTableData } from "data/render/table";
import LoyaltyApi from "api/LoyaltyApi";
import { useHistory } from "react-router-dom";
import LoyaltyNav from "../../components/mainContent/loyalty/nav/LoyaltyNav";
const LoyaltyMemberMerge = () => {
  const history = useHistory();
  const [current, setCurrent] = useState(0);
  const [setselectedMember1, setSetselectedMember1] = useState(null);
  const [setselectedMember2, setSetselectedMember2] = useState(null);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const reasonRef = useRef();
  const onSetSelectedUser = (index, value) => {
    if (+index === 1) {
      setSetselectedMember1(value);
    } else if (+index === 2) {
      setSetselectedMember2(value);
    }
    return;
  };
  const steps = [
    {
      title: "Member 1",
      content: (
        <div className="">
          <p className="cl-red m-0 mt-15">
            <b>NOTE: </b>This user will be blocked after the merge process is
            completed.
          </p>
          <SearchMember setValue={onSetSelectedUser} index={1} />
          <MainTable
            rowClassName={`${
              setselectedMember1?.locked === 0 ? "disabled_row" : ""
            }`}
            className="mb-15"
            columns={MergeMemberTableData.columns()}
            dataSource={setselectedMember1 ? [setselectedMember1] : []}
          />
        </div>
      ),
    },
    {
      title: "Member 2",
      content: (
        <div className="">
          <SearchMember setValue={onSetSelectedUser} index={2} />
          <MainTable
            rowClassName={`${
              setselectedMember1?.locked === 0 ? "disabled_row" : ""
            }`}
            className="mb-15"
            columns={MergeMemberTableData.columns()}
            dataSource={setselectedMember2 ? [setselectedMember2] : []}
          />
        </div>
      ),
    },
    {
      title: "Reason",
      content: (
        <div className="flex flex-col mb-15 mt-15">
          <label htmlFor="" className="required mb-10">
            Reason
          </label>
          <textarea
            ref={reasonRef}
            placeholder="Enter the reason why merge two user"
            className=""
            rows={20}
          />
        </div>
      ),
    },
    {
      title: "Merge",
      content: (
        <ConfirmMergeMember
          memberData1={setselectedMember1}
          memberData2={setselectedMember2}
        />
      ),
    },
  ];

  const isStepComplete = () => {
    switch (current) {
      case 0:
        if (!setselectedMember1) {
          message.error("Please select member 1");
          return false;
        }
        if (setselectedMember1.delete !== 0) {
          message.error("This user is deleted");
          return false;
        }
        if (setselectedMember1.active === 0) {
          message.error("This user is inactive");
          return false;
        }

        return true;
      case 1:
        if (!setselectedMember2) {
          message.error("Please select member 2");
          return false;
        }
        if (setselectedMember2.delete !== 0) {
          message.error("This user is deleted");
          return false;
        }
        if (setselectedMember2.active === 0) {
          message.error("This user is inactive");
          return false;
        }

        if (setselectedMember2.memberCode === setselectedMember1?.memberCode) {
          message.error("This user has been selected");
          return false;
        }

        return true;
      case 2:
        const reasonValue = reasonRef.current?.value;
        if (!reasonValue) {
          message.error("Please insert reason");
          return false;
        }
        if (reasonValue.length < 20) {
          message.error("The reason must be at least 20 characters");
          return false;
        }
        setReason(reasonValue);
        return true;
      default:
        return false;
    }
  };
  const handleActionMergePoint = () => {
    let params = {
      memberCode: setselectedMember2.memberCode,
      body: {
        reason,
        memberCode: setselectedMember1.memberCode,
      },
    };
    setLoading(true);
    LoyaltyApi.mergePoint(params).then((res) => {
      setLoading(false);
      if (res.status) {
        message.success("Merge member successfully");
        setTimeout(() => {
          history.push("/loyalty");
        }, 1000);
      } else {
        message.error(res.message);
      }
    });
  };

  const next = () => {
    if (isStepComplete()) {
      setCurrent(current + 1);
    }
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  return (
    <LoyaltyNav>
      <div className="section-block mt-15">
        {/* <PageHeader className="p-0 mbi-15" onBack={() => history.push('/loyalty')} title="Merge member" /> */}
        <h3>Merge member</h3>
        <Steps current={current} items={items} />
        <div className="steps-content">{steps[current].content}</div>
        <div className="steps-action">
          {current < steps.length - 1 && (
            <Button type="primary" onClick={() => next()}>
              Next
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button
              loading={loading}
              type="primary"
              onClick={handleActionMergePoint}
            >
              Merge
            </Button>
          )}
          {current > 0 && (
            <Button
              style={{
                margin: "0 8px",
              }}
              onClick={() => prev()}
            >
              Previous
            </Button>
          )}
        </div>
      </div>
    </LoyaltyNav>
  );
};
export default LoyaltyMemberMerge;
