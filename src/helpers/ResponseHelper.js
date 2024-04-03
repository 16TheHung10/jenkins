import AppMessage from 'message/reponse.message';

const ResponseHelper = {
  handleResponse: (res) => {
    if (res.status) {
      return res.data;
    } else {
      AppMessage.error(res.message);
      return null;
    }
  },
};
export default ResponseHelper;
