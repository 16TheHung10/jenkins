import { routerRef } from 'App';
import ObjectHelper from './ObjectHelper';
import StringHelper from './StringHelper';

const UrlHelper = {
  setSearchParams(searchParams) {
    window.history.replaceState(null, null, searchParams);
    return searchParams;
  },
  setSearchParamsFromObject(newParams) {
    const currentUrlParams = UrlHelper.getSearchParamsObject();
    const removeNullValue = ObjectHelper.removeAllNullValue({
      ...currentUrlParams,
      ...newParams,
    });
    const newSearchObject = { ...removeNullValue };
    const searchParams = StringHelper.convertObjectToSearchParams(newSearchObject);
    if (routerRef && routerRef.current) {
      routerRef.current.history.replace(routerRef.current.history.location?.pathname + searchParams, searchParams);
    }
    return searchParams;
  },
  getSearchParams() {
    const searchParams = window.location.search;
    return searchParams;
  },
  getSearchParamsObject() {
    const searchParamsObject = StringHelper.convertSearchParamsToObject(window.location.search);
    return searchParamsObject;
  },
  isURL(str) {
    try {
      new URL(str);
      return true;
    } catch (error) {
      return false;
    }
  },
};
export default UrlHelper;
