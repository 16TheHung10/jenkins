import { Breadcrumb } from 'antd';
import { useAppContext } from 'contexts';
import { useHistory, useLocation } from 'react-router-dom';
import './styles.scss';
import React, { useMemo } from 'react';

const BreadCrumb = ({}) => {
  const { state } = useAppContext();
  const location = useLocation();
  const history = useHistory();
  const findRootMenu = (array, target) => {
    let res = null;
    for (let item of array) {
      if (item.url === target) {
        res = item;
      }
      if (item.childrens && item.childrens.length > 0) {
        const childItem = findRootMenu(item.childrens, target);
        if (childItem) {
          res = item;
        }
      }
    }
    return res;
  };

  // Find root parent of current route
  const rootMenu = useMemo(() => {
    if (state.menus) return findRootMenu(state.menus, location.pathname);
  }, [state.menus, location.pathname]);

  const renderBreadCrumb = (parentObject) => {
    // Push url of object into result, if object have children find which element is a parent of current route and then call fn again
    const res = [];
    res.push({
      title: parentObject.name,
      url: parentObject.url,
      icon: parentObject.icon,
    });
    if (parentObject.childrens) {
      const childObject = findRootMenu(parentObject.childrens, location.pathname);
      if (childObject) {
        const childRes = renderBreadCrumb(childObject);
        res.push(...childRes);
      }
    }
    return [...res];
  };
  return (
    <div className="" id="bread_crumb">
      <Breadcrumb>
        <Breadcrumb.Item>
          <i className={'fas fa-home cursor-pointer'} onClick={() => history.push('/')} />
        </Breadcrumb.Item>
        {rootMenu &&
          !['', '/'].includes(window.location.pathname) &&
          renderBreadCrumb(rootMenu)?.map((item, index) => {
            return <Breadcrumb.Item key={item.title + index}>{item?.title}</Breadcrumb.Item>;
          })}
      </Breadcrumb>
    </div>
  );
};

export default BreadCrumb;
