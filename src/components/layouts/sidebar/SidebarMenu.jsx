import { Menu, Switch, Tooltip } from 'antd';
import crypto from 'crypto-js';
import SearchInput from 'components/common/inputs/SearchInput';
import { useAppContext } from 'contexts';
import Mainlogo from 'images/logo.png';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import './style.scss';
import { HashingHelper, UrlHelper } from 'helpers';
const SidebarMenu = () => {
  const { state: AppState, onGetMenu, onToggleWikiMod, onSetWikiCode, onConvertMenuToArrayID } = useAppContext();
  const [openKeys, setOpenKeys] = useState([]);

  useEffect(() => {
    onConvertMenuToArrayID();
  }, [AppState.menus?.length]);

  const findAllParent = (childKey) => {
    const res = [childKey.toString()];
    const parentID = AppState.menuObjectID?.[childKey]?.parentID;

    if (!parentID) {
      return res;
    } else {
      const res2 = findAllParent(parentID);
      res.push(...res2);
    }
    return res;
  };

  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (latestOpenKey && !AppState.menuObjectID?.[latestOpenKey]) {
      setOpenKeys(keys);
    } else {
      if (latestOpenKey) {
        const allKey = findAllParent(latestOpenKey);
        setOpenKeys(allKey ? [...allKey] : []);
      } else {
        setOpenKeys(keys);
      }
    }
  };

  useEffect(() => {
    onGetMenu();
  }, []);

  function getItem(label, key, icon, children, type) {
    return {
      key,
      icon,
      children,
      label,
      type,
      title: label,
    };
  }

  const hashingParams = (link) => {
    if (UrlHelper.isURL(link)) {
      const encodedLink = HashingHelper.encrypt(link);
      return '/external-iframe?link=' + encodedLink;
    }
    return link;
    //   if (link.slice(17).split('=')[0] === 'link') {
    //   let path = link.slice(0, 17);
    //   let linkExternal = link.slice(17).split('=')[1];
    //   const encodedLink = HashingHelper.encrypt(linkExternal);
    //   return path + 'link=' + encodedLink + '&iframeMode=false';
    // } else {
    //   return link;
    // }
  };
  const renderItems = useCallback(
    (menus) => {
      if (!menus || menus.length === 0) return null;
      return [
        ...menus
          ?.filter((el) => +el.appPermission === 1001)
          ?.map((item, index) => {
            return getItem(
              item.childrens?.length > 0 ? (
                <>
                  {item.parentID === 0 ? (
                    // <WikiMenu code={`MENU_${item.name?.trim()?.replaceAll(' ', '')?.toUpperCase()}`}>
                    <span
                      className="menu-text disable_select_text wiki_el"
                      data-wiki-id={`MENU_${item.name?.trim()?.replaceAll(' ', '')?.toUpperCase()}`}
                    >
                      {item.name}
                    </span>
                  ) : (
                    // </WikiMenu>
                    <Tooltip title={item.name} placement="right">
                      <span className="menu-text disable_select_text">{item.name}</span>
                    </Tooltip>
                  )}
                </>
              ) : (
                <>
                  {AppState.isWikiMode ? (
                    <span
                      data-wiki-id={`MENU_${item.name?.trim()?.replaceAll(' ', '')?.toUpperCase()}`}
                      className="wiki_el"
                    >
                      {item.name}
                    </span>
                  ) : item.parentID === 0 ? (
                    <Link className="menu-text" to={hashingParams(AppState.menuObject[item.url]?.url || item.url)}>
                      {item.name}
                    </Link>
                  ) : (
                    <Tooltip title={item.name} placement="right">
                      <Link className="menu-text" to={hashingParams(AppState.menuObject[item.url]?.url || item.url)}>
                        {item.name}
                      </Link>
                    </Tooltip>
                  )}
                </>
              ),
              item.id,
              <i className={item.icon?.includes('fas') ? item.icon : 'fas ' + item.icon}></i>,
              renderItems(item.childrens)
            );
          }),
      ];
    },
    [AppState.menus?.length, AppState.menuObject, AppState.isWikiMode]
  );
  const items = useMemo(() => {
    return renderItems(AppState.menus);
  }, [renderItems]);

  const onClick = (e) => {
    // console.log('click', e.item);
  };

  return (
    <div
      id="sidebar"
      style={{
        width: AppState.isMenuCollapsed ? 70 : 256,
        transition: 'all 0.3s ease 0s',
      }}
    >
      <div
        className="flex flex-col items-center"
        style={{
          padding: ' 10px 0px',
          position: 'sticky',
          top: '0',
          zIndex: '99',
          background: 'white',
          width: '100%',
        }}
      >
        <a href={'/'} className="flex justify-content-center">
          <img
            style={{
              transition: 'all 0.3s',
              width: AppState.isMenuCollapsed ? 60 : 150,
            }}
            src={Mainlogo}
            alt="Osam Logo"
            className="img-fluid logo"
          />
        </a>
        <Switch
          checkedChildren="Wiki mode"
          unCheckedChildren="Wiki mode"
          defaultChecked
          checked={AppState.isWikiMode}
          onChange={onToggleWikiMod}
          style={{ marginTop: 10 }}
        />
        <div
          className=""
          style={{
            width: '90%',
            margin: '10px 0',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          {AppState.isMenuCollapsed ? (
            <Tooltip title={<SearchInput />} placement="right">
              <i className="fas fa-search" />
            </Tooltip>
          ) : (
            <SearchInput />
          )}
        </div>
      </div>
      <Menu
        triggerSubMenuAction="hover"
        onClick={onClick}
        style={{ width: AppState.isMenuCollapsed ? 70 : 266 }}
        mode="inline"
        items={[
          // getItem(<SearchInput />, 'search', <i className="fas fa-search"></i>),
          getItem(
            <Link to="/" className="linkMenu">
              <span className="txt-menu">Home</span>
            </Link>,
            'home_dashboard',
            <i className="fas fa-home"></i>
            // item.children.length > 0 ? '' : 'group'
          ),
          ...(items || []),
          getItem(
            <Link to="/user-manual" className="linkMenu">
              <span className="txt-menu">User wiki</span>
            </Link>,
            'wiki_dashboard',
            <i className="fas fa-book"></i>,
            null
          ),
        ]}
        inlineIndent={24}
        inlineCollapsed={AppState.isMenuCollapsed}
        openKeys={openKeys}
        onOpenChange={onOpenChange}
      />
    </div>
  );
};

export default SidebarMenu;
