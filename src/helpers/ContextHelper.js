import { actionCreator } from "contexts";
import UrlHelper from "./UrlHelper";

const ContextHelper = {
  resetSearchParams(reset, context) {
    const searchParams = UrlHelper.getSearchParamsObject();
    reset(searchParams);
    context.dispatch(actionCreator("SET_SEARCH_PARAMS", searchParams));
  },
};
export default ContextHelper;
