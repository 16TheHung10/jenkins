import { useGoldenTimeContext } from 'contexts';
import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import PrimeTimeDiscountTabItem from './Discount/PrimeTimeDiscountTabItem';
import PrimeTimeFreeTabItem from './Free/PrimeTimeFreeTabItem';

const PrimeTimeCreateTabItems = ({ selectedTab, disabled }) => {
  const [state, dispatch] = useGoldenTimeContext();
  const params = useParams();
  const items = [
    {
      key: '1',
      label: `Promotion discount item`,
      disabled: !params.id ? false : params.id?.toString().startsWith('BG'),
      Component: () => <PrimeTimeDiscountTabItem disabled={disabled} />,
    },
    {
      key: '2',
      disabled: !params.id ? false : params.id?.toString().startsWith('DI'),
      label: `Promotion free item`,
      Component: () => <PrimeTimeFreeTabItem disabled={disabled} />,
    },
  ];
  const CurrentCompData = useMemo(() => {
    const selectedTabValue = params.id ? (params.id?.toString().startsWith('BG') ? '2' : '1') : null;
    return items?.find((el) => el.key === (selectedTabValue || selectedTab));
  }, [selectedTab]);

  return (
    <div style={{ padding: 10 }} className="w-full">
      <h3 style={{ textTransform: 'uppercase', fontSize: '16px' }}>{CurrentCompData?.label}</h3>
      {CurrentCompData?.Component()}
      {/* <Tabs style={{ padding: 10 }} defaultActiveKey={selectedTab || "1"} activeKey={selectedTab} onTabClick={(value) => onSetSelectedTab(value)} items={items} /> */}
    </div>
  );
};
export default PrimeTimeCreateTabItems;

