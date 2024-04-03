import { fetchData } from "./FetchData";

const telegramNoti = async (obj) => {
  const { errorCode, appName, url, name, storeCode, typePage } = obj;
  const text = `[${errorCode}][${appName}][${storeCode}][${name}][${typePage}]${url}`;
  try {
    const api = `${text}`;
    const response = await fetchData(
      api,
      "GET",
      null,
      null,
      process.env.REACT_APP_TELEGRAM_URL,
    );
    if (response?.status) {
      console.log(text);
    }
  } catch (error) {
    console.error("Error fetching data: ", error);
  }
};

export { telegramNoti };
