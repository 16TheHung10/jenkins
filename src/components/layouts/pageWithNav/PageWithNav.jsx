import { actionCreator, usePageWithNavContext, useAppContext } from 'contexts';
import { PageWithNavActions } from 'contexts/actions';
import React, { useCallback, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './style.scss';

const PageWithNav = ({ children, actionLeft, actionRight, ...props }) => {
  const { state: AppState } = useAppContext();
  const { state, dispatch } = usePageWithNavContext();
  const onClickTab = (tab) => {
    if (tab.actionType !== 'link') {
      dispatch(actionCreator(PageWithNavActions.SET_ACTIVE_TAB_NAME, tab.name));
      tab.action();
    }
  };

  const renderAction = useCallback(
    (actions) => {
      return actions?.map((item) => {
        if (item.isHidden || state.hiddenTabType?.includes(item.actionType)) return null;
        if (item.actionType === 'link')
          return (
            <NavLink
              exact
              to={AppState.menuObject[item.pathName]?.url || item.pathName}
              className={`btn flex items-center`}
              style={{ display: 'flex' }}
              key={item.name}
              disabled={item.disabled}
            >
              {item.name}
            </NavLink>
          );
        return (
          <button
            className={`btn ${state.activeTab.name === item.name ? 'active' : ''}`}
            key={item.name}
            onClick={() => onClickTab(item)}
          >
            {item.name}
          </button>
        );
      });
    },
    [AppState.menuObject]
  );

  useEffect(() => {
    if (actionLeft) {
      dispatch(actionCreator(PageWithNavActions.SET_ACTIONS_LEFT, actionLeft));
    }
  }, [actionLeft]);

  useEffect(() => {
    if (actionRight) {
      dispatch(actionCreator(PageWithNavActions.SET_ACTIONS_LEFT, actionLeft));
    }
  }, [actionRight]);

  useEffect(() => {
    if (
      (!state.actionRight && !state.actionLeft) ||
      (state.actionRight.length === 0 && state.actionLeft.length === 0)
    ) {
      dispatch(actionCreator(PageWithNavActions.SET_VISIBLE, false));
    } else {
      dispatch(actionCreator(PageWithNavActions.SET_VISIBLE, true));
    }
  }, [state.actionLeft, state.actionRight]);
  return (
    <div id="pageWithNavWrapper" {...props}>
      {/* Actions */}
      {state?.isVisible ? (
        <div
          className="top-menu w-full flex justify-content-between"
          // style={{ margin: "0 -15px", width: "calc(100% + 30px)" }}
        >
          <div className="flex items-end" style={{ padding: '0 15px' }}>
            {renderAction(state?.actionLeft)}
          </div>
          <div className="flex items-center" style={{ padding: '0 15px' }}>
            {renderAction(state?.actionRight)}
          </div>
        </div>
      ) : null}

      {/* Content */}
      {children}
    </div>
  );
};

export default PageWithNav;
