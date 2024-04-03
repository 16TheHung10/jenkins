import { AuthApi } from './AuthApi';

const WikiApi = {
  getWikiByCode: (wikiCode) => {
    return AuthApi.get(`/wikicontent/${wikiCode}`);
  },
  createWiki: (data) => {
    return AuthApi.post(`/wikicontent`, data);
  },
  updateWiki: (wikiCode, data) => {
    return AuthApi.put(`/wikicontent/${wikiCode}`, data);
  },
};

export default WikiApi;
