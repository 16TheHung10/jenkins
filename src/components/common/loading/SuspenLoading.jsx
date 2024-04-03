import React from 'react';
import './styles.scss';
const SuspenLoading = () => {
  return (
    <div id="suspen-loading" className="flex items-center justify-center" style={{ height: '100vh' }}>
      <div className="container">
        <div className="coast">
          <div className="wave-rel-wrap">
            <div className="wave" />
          </div>
        </div>
        <div className="coast delay">
          <div className="wave-rel-wrap">
            <div className="wave delay" />
          </div>
        </div>
        <div className="text text-l">L</div>
        <div className="text text-o">O</div>
        <div className="text text-a">A</div>
        <div className="text text-d">D</div>
        <div className="text text-i">I</div>
        <div className="text text-n">N</div>
        <div className="text text-g">G</div>
      </div>
    </div>
  );
};

export default SuspenLoading;
