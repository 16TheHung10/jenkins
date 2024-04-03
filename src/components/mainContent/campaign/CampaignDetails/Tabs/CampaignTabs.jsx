import React from "react";
import GameApp from "./TabItem/GameApp/GameAppDetails";
import POSPromotion from "./TabItem/POSPromotion/POSPromotionDetails";
import { Tabs } from "antd";

const CampaignTabs = () => {
  const items = [
    {
      key: "1",
      label: `POS promotion`,
      children: <POSPromotion />,
    },
    {
      key: "2",
      label: `Game app promotion`,
      children: <GameApp />,
    },
  ];

  return (
    <Tabs className="section-block mt-15" defaultActiveKey="1" items={items} />
  );
};

export default CampaignTabs;
