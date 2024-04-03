import React from 'react';
import './style.scss';
import Icons from 'images/icons';
const StatisticCard = ({ title, value, icon, color = 'blue', className }) => {
  return (
    <div id="statistic-card" className={`${className}`}>
      <div className="flex gap-10">
        <div className={`content ${color}`}>
          <p className="title">{title}</p>
          <h4 className="font-bold value">{value}</h4>
        </div>
        {icon ? <div className={`icon ${color} center`}>{icon}</div> : null}
      </div>
    </div>
  );
};

export default StatisticCard;
