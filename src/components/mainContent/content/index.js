import React, { useEffect, useState, useImperativeHandle } from 'react';

import FormManage from './FormManage';
import ResultTable from './ResultTable';
import ContentModel from 'models/ContentModel';

import { AlertHelper } from 'helpers';

export const Context = React.createContext();

const Content = React.forwardRef((props, ref) => {
  const [fields, setFields] = useState({});
  const [ipField, setIpField] = useState({});

  const [titleTable, setTitleTable] = useState([]);

  const [group, setGroup] = useState(null);
  const [position, setPosition] = useState(null);
  const [name, setName] = useState(null);
  const [expired, setExpired] = useState(null);
  const [dataOption, setDataOption] = useState(null);

  const [resData, setResData] = useState([]);

  const [isIdUpdate, setIsIdUpdate] = useState(false);
  const [editIndex, setEditIndex] = useState(0);

  const globalState = {
    fields: { get: fields, set: setFields },
    ipField: { get: ipField, set: setIpField },
    group: { get: group, set: setGroup },
    position: { get: position, set: setPosition },
    name: { get: name, set: setName },
    dataOption: { get: dataOption, set: setDataOption },

    expired: { get: expired, set: setExpired },
    resData: { get: resData, set: setResData },
    editIndex: { get: editIndex, set: setEditIndex },

    isIdUpdate: { get: isIdUpdate, set: setIsIdUpdate },
  };

  const showAlert = (msg, type = 'error') => {
    AlertHelper.showAlert(msg, type);
  };

  useImperativeHandle(ref, () => ({
    handleSave() {
      var type = props.type;
      var model = new ContentModel();

      var arrList = [...resData];
      arrList.map((x) => delete x.id);

      if (arrList.length === 0) {
        showAlert('Can not save empty list');
        return;
      }

      var params = {
        content: JSON.stringify(arrList),
        // content: "[{\"Group\":\"NGUYÊN LIỆU\",\"Position\":\"TỦ MÁT\",\"Name\":\"Rau răm\",\"Expired\":\"Trong ngày\"},{\"Group\":\"NGUYÊN LIỆU\",\"Position\":\"TỦ MÁT\",\"Name\":\"Nước mắm\",\"Expired\":\"Trong ngày\"},{\"Group\":\"NGUYÊN LIỆU\",\"Position\":\"TỦ MÁT\",\"Name\":\"Trân châu (Chiết lẻ)\",\"Expired\":\"1 ngày\"},{\"Group\":\"NGUYÊN LIỆU\",\"Position\":\"TỦ MÁT\",\"Name\":\"Cà phê đen pha sẵn\",\"Expired\":\"2 ngày\"},{\"Group\":\"NGUYÊN LIỆU\",\"Position\":\"TỦ MÁT\",\"Name\":\"Bột nhân bánh Chichiko\",\"Expired\":\"2 ngày\"},{\"Group\":\"NGUYÊN LIỆU\",\"Position\":\"TỦ MÁT\",\"Name\":\"Gà nướng Hàn Quốc\",\"Expired\":\"3 ngày\"},{\"Group\":\"NGUYÊN LIỆU\",\"Position\":\"TỦ MÁT\",\"Name\":\"Xúc xích\",\"Expired\":\"3 ngày\"},{\"Group\":\"NGUYÊN LIỆU\",\"Position\":\"TỦ MÁT\",\"Name\":\"Gà viên lá chanh\",\"Expired\":\"3 ngày\"},{\"Group\":\"NGUYÊN LIỆU\",\"Position\":\"TỦ MÁT\",\"Name\":\"Xôi gà\",\"Expired\":\"3 ngày\"},{\"Group\":\"NGUYÊN LIỆU\",\"Position\":\"TỦ MÁT\",\"Name\":\"Kim chi\",\"Expired\":\"3 ngày\"},{\"Group\":\"NGUYÊN LIỆU\",\"Position\":\"TỦ MÁT\",\"Name\":\"Trà Atiso bưởi đỏ\",\"Expired\":\"3 ngày\"},{\"Group\":\"NGUYÊN LIỆU\",\"Position\":\"TỦ MÁT\",\"Name\":\"Trà sữa gạo rang\",\"Expired\":\"3 ngày\"},{\"Group\":\"NGUYÊN LIỆU\",\"Position\":\"TỦ MÁT\",\"Name\":\"Sjora xoài đào\",\"Expired\":\"4 ngày\"},{\"Group\":\"NGUYÊN LIỆU\",\"Position\":\"TỦ MÁT\",\"Name\":\"Chả cá Topokki\",\"Expired\":\"5 ngày\"},{\"Group\":\"NGUYÊN LIỆU\",\"Position\":\"TỦ MÁT\",\"Name\":\"Topping lẩu:………..\",\"Expired\":\"5 ngày\"},{\"Group\":\"NGUYÊN LIỆU\",\"Position\":\"TỦ MÁT\",\"Name\":\"Bột vỏ bánh Chichiko\",\"Expired\":\"6 ngày\"},{\"Group\":\"NGUYÊN LIỆU\",\"Position\":\"TỦ MÁT\",\"Name\":\"Cam trái\",\"Expired\":\"7 ngày\"},{\"Group\":\"NGUYÊN LIỆU\",\"Position\":\"TỦ MÁT\",\"Name\":\"Topokki\",\"Expired\":\"7 ngày\"},{\"Group\":\"NGUYÊN LIỆU\",\"Position\":\"TỦ MÁT\",\"Name\":\"Topokki phô mai\",\"Expired\":\"7 ngày\"},{\"Group\":\"NGUYÊN LIỆU\",\"Position\":\"TỦ MÁT\",\"Name\":\"Xốt Topokki\",\"Expired\":\"10 ngày\"},{\"Group\":\"NGUYÊN LIỆU\",\"Position\":\"TỦ MÁT\",\"Name\":\"Xốt Tương đen\",\"Expired\":\"30 ngày\"},{\"Group\":\"NGUYÊN LIỆU\",\"Position\":\"TỦ MÁT\",\"Name\":\"Trân châu nguyên bịch\",\"Expired\":\"30 ngày\"},{\"Group\":\"NGUYÊN LIỆU\",\"Position\":\"PHÒNG THƯỜNG\",\"Name\":\"Xốt tương ớt (cà) chai\",\"Expired\":\"2 ngày\"},{\"Group\":\"NGUYÊN LIỆU\",\"Position\":\"PHÒNG THƯỜNG\",\"Name\":\"Xốt Mayo\",\"Expired\":\"2 ngày\"},{\"Group\":\"NGUYÊN LIỆU\",\"Position\":\"PHÒNG THƯỜNG\",\"Name\":\"Bánh mì Hotdog\",\"Expired\":\"3 ngày\"},{\"Group\":\"NGUYÊN LIỆU\",\"Position\":\"PHÒNG THƯỜNG\",\"Name\":\"Sữa đặc \",\"Expired\":\"4 ngày\"},{\"Group\":\"NGUYÊN LIỆU\",\"Position\":\"PHÒNG THƯỜNG\",\"Name\":\"Mì Koreno\",\"Expired\":\"5 ngày\"},{\"Group\":\"NGUYÊN LIỆU\",\"Position\":\"PHÒNG THƯỜNG\",\"Name\":\"Mè\",\"Expired\":\"10 ngày\"},{\"Group\":\"NGUYÊN LIỆU\",\"Position\":\"PHÒNG THƯỜNG\",\"Name\":\"Bột Nestle\",\"Expired\":\"15 ngày\"},{\"Group\":\"NGUYÊN LIỆU\",\"Position\":\"PHÒNG THƯỜNG\",\"Name\":\"Syrup Dâu, Vải \",\"Expired\":\"15 ngày\"},{\"Group\":\"NGUYÊN LIỆU\",\"Position\":\"PHÒNG THƯỜNG\",\"Name\":\"Xốt tương ớt (cà) bình\",\"Expired\":\"15 ngày\"},{\"Group\":\"NGUYÊN LIỆU\",\"Position\":\"PHÒNG THƯỜNG\",\"Name\":\"Muối tiêu\",\"Expired\":\"30 ngày\"},{\"Group\":\"NGUYÊN LIỆU\",\"Position\":\"PHÒNG THƯỜNG\",\"Name\":\"Nước tương\",\"Expired\":\"30 ngày\"},{\"Group\":\"NGUYÊN LIỆU\",\"Position\":\"PHÒNG THƯỜNG\",\"Name\":\"Bột phô mai\",\"Expired\":\"30 ngày\"},{\"Group\":\"NGUYÊN LIỆU\",\"Position\":\"PHÒNG THƯỜNG\",\"Name\":\"Bột Socola Hershey\",\"Expired\":\"30 ngày\"},{\"Group\":\"NGUYÊN LIỆU\",\"Position\":\"PHÒNG THƯỜNG\",\"Name\":\"Đường mía \",\"Expired\":\"30 ngày\"},{\"Group\":\"NGUYÊN LIỆU\",\"Position\":\"PHÒNG THƯỜNG\",\"Name\":\"Syrup Đường đen\",\"Expired\":\"60 ngày\"},{\"Group\":\"THÀNH PHẨM\",\"Position\":\"TỦ WARMER\",\"Name\":\"Mì đã trụng\",\"Expired\":\"8 tiếng\"},{\"Group\":\"THÀNH PHẨM\",\"Position\":\"TỦ WARMER\",\"Name\":\"Bánh mì thịt nướng\",\"Expired\":\"8 tiếng\"},{\"Group\":\"THÀNH PHẨM\",\"Position\":\"TỦ WARMER\",\"Name\":\"Banh mì chả cá\",\"Expired\":\"8 tiếng\"},{\"Group\":\"THÀNH PHẨM\",\"Position\":\"TỦ WARMER\",\"Name\":\"Bánh mì opla\",\"Expired\":\"8 tiếng\"},{\"Group\":\"THÀNH PHẨM\",\"Position\":\"TỦ WARMER\",\"Name\":\"Hotdog 25\",\"Expired\":\"8 tiếng\"},{\"Group\":\"THÀNH PHẨM\",\"Position\":\"TỦ WARMER\",\"Name\":\"Hotdog signature\",\"Expired\":\"8 tiếng\"},{\"Group\":\"THÀNH PHẨM\",\"Position\":\"TỦ WARMER\",\"Name\":\"Bánh chuối chiên\",\"Expired\":\"8 tiếng\"},{\"Group\":\"THÀNH PHẨM\",\"Position\":\"TỦ WARMER\",\"Name\":\"Topokki - Topokki phô mai (lắc)\",\"Expired\":\"12 tiếng\"},{\"Group\":\"THÀNH PHẨM\",\"Position\":\"TỦ WARMER\",\"Name\":\"Xúc xích \",\"Expired\":\"12 tiếng\"},{\"Group\":\"THÀNH PHẨM\",\"Position\":\"TỦ WARMER\",\"Name\":\"Xúc xích Cocktail\",\"Expired\":\"12 tiếng\"},{\"Group\":\"THÀNH PHẨM\",\"Position\":\"TỦ WARMER\",\"Name\":\"Gà viên lá chanh\",\"Expired\":\"12 tiếng\"},{\"Group\":\"THÀNH PHẨM\",\"Position\":\"TỦ WARMER\",\"Name\":\"Chả cá hạt bắp\",\"Expired\":\"12 tiếng\"},{\"Group\":\"THÀNH PHẨM\",\"Position\":\"TỦ WARMER\",\"Name\":\"Gà Kara-Age\",\"Expired\":\"12 tiếng\"},{\"Group\":\"THÀNH PHẨM\",\"Position\":\"TỦ WARMER\",\"Name\":\"Bánh xếp hải sản\",\"Expired\":\"12 tiếng\"},{\"Group\":\"THÀNH PHẨM\",\"Position\":\"TỦ WARMER\",\"Name\":\"Bánh xếp thịt\",\"Expired\":\"12 tiếng\"},{\"Group\":\"THÀNH PHẨM\",\"Position\":\"TỦ WARMER\",\"Name\":\"Gà nướng Hàn Quốc\",\"Expired\":\"12 tiếng\"},{\"Group\":\"THÀNH PHẨM\",\"Position\":\"TỦ WARMER\",\"Name\":\"Corndog phô mai\",\"Expired\":\"12 tiếng\"},{\"Group\":\"THÀNH PHẨM\",\"Position\":\"TỦ WARMER\",\"Name\":\"Đùi gà chiên\",\"Expired\":\"12 tiếng\"},{\"Group\":\"THÀNH PHẨM\",\"Position\":\"TỦ WARMER\",\"Name\":\"Bánh sao biển GS25\",\"Expired\":\"12 tiếng\"},{\"Group\":\"THÀNH PHẨM\",\"Position\":\"TỦ BÁNH BAO\",\"Name\":\"Bánh bao cade\",\"Expired\":\"12 tiếng\"},{\"Group\":\"THÀNH PHẨM\",\"Position\":\"TỦ BÁNH BAO\",\"Name\":\"Bánh bao khoai môn\",\"Expired\":\"12 tiếng\"},{\"Group\":\"THÀNH PHẨM\",\"Position\":\"TỦ BÁNH BAO\",\"Name\":\"Bánh bao 1 trứng cút\",\"Expired\":\"12 tiếng\"},{\"Group\":\"THÀNH PHẨM\",\"Position\":\"TỦ BÁNH BAO\",\"Name\":\"Bánh bao 2 trứng cút\",\"Expired\":\"12 tiếng\"},{\"Group\":\"THÀNH PHẨM\",\"Position\":\"TỦ BÁNH BAO\",\"Name\":\"Bánh bao kim chi\",\"Expired\":\"12 tiếng\"},{\"Group\":\"THÀNH PHẨM\",\"Position\":\"TỦ BÁNH BAO\",\"Name\":\"Bánh bao thịt, trứng muối, xá xíu\",\"Expired\":\"12 tiếng\"},{\"Group\":\"THÀNH PHẨM\",\"Position\":\"TỦ BÁNH BAO\",\"Name\":\"Bánh bao trứng muối\",\"Expired\":\"12 tiếng\"},{\"Group\":\"THÀNH PHẨM\",\"Position\":\"TỦ BÁNH BAO\",\"Name\":\"Bánh bao xá xíu\",\"Expired\":\"12 tiếng\"},{\"Group\":\"THÀNH PHẨM\",\"Position\":\"TỦ BÁNH BAO\",\"Name\":\"Bánh giò nhân thịt\",\"Expired\":\"12 tiếng\"},{\"Group\":\"THÀNH PHẨM\",\"Position\":\"TỦ BÁNH BAO\",\"Name\":\"Bánh giò nhân tôm\",\"Expired\":\"12 tiếng\"},{\"Group\":\"THÀNH PHẨM\",\"Position\":\"TỦ BÁNH BAO\",\"Name\":\"Bánh giò gà xé\",\"Expired\":\"12 tiếng\"},{\"Group\":\"THÀNH PHẨM\",\"Position\":\"TỦ BÁNH BAO\",\"Name\":\"Xôi gà\",\"Expired\":\"12 tiếng\"},{\"Group\":\"THÀNH PHẨM\",\"Position\":\"TỦ BÁNH BAO\",\"Name\":\"Bánh xếp hải sản\",\"Expired\":\"12 tiếng\"},{\"Group\":\"THÀNH PHẨM\",\"Position\":\"TỦ BÁNH BAO\",\"Name\":\"Hoành thánh\",\"Expired\":\"12 tiếng\"},{\"Group\":\"THÀNH PHẨM\",\"Position\":\"TỦ BÁNH BAO\",\"Name\":\"Trứng luộc\",\"Expired\":\"8 tiếng\"},{\"Group\":\"THÀNH PHẨM\",\"Position\":\"NỒI ODEN\",\"Name\":\"Topping lẩu\",\"Expired\":\"24 tiếng\"},{\"Group\":\"THÀNH PHẨM\",\"Position\":\"MÁY SLUSH\",\"Name\":\"Slush Dâu/Vải\",\"Expired\":\"14 ngày\"},{\"Group\":\"THÀNH PHẨM\",\"Position\":\"MÁY SLUSH\",\"Name\":\"Slush Hershey\",\"Expired\":\" 7 ngày\"},{\"Group\":\"THÀNH PHẨM\",\"Position\":\"MÁY NESTLE\",\"Name\":\"Nước Milo\",\"Expired\":\"24 tiếng\"},{\"Group\":\"THÀNH PHẨM\",\"Position\":\"MÁY NESTLE\",\"Name\":\"Trà chanh Nestea\",\"Expired\":\"24 tiếng\"},{\"Group\":\"THÀNH PHẨM\",\"Position\":\"MÁY NESTLE\",\"Name\":\"Nước Sjora xoài đào\",\"Expired\":\"24 tiếng\"},{\"Group\":\"THÀNH PHẨM\",\"Position\":\"MÁY NESTLE\",\"Name\":\"Nước Atiso Việt quất\",\"Expired\":\"24 tiếng\"},{\"Group\":\"THÀNH PHẨM\",\"Position\":\"TỦ BAIN LẠNH\",\"Name\":\"Gíá hẹ/ dưa leo\",\"Expired\":\"24 tiếng\"},{\"Group\":\"THÀNH PHẨM\",\"Position\":\"TỦ BAIN LẠNH\",\"Name\":\"Topokki / xốt\",\"Expired\":\"24 tiếng\"}]"
      };

      model.putList(type, params).then((res) => {
        if (res.status) {
          showAlert(res.message, 'success');
          fetchData();
        } else {
          showAlert(res.message);
        }
      });
    },
  }));

  const fetchData = async () => {
    let type = props.type;
    let model = new ContentModel();
    await model.getList(type).then((res) => {
      if (res.status && res.data.content) {
        let div = document.createElement('div');
        div.innerHTML = res.data.content.content;

        let content = JSON.parse(div.textContent);

        let code = res.data.content.code;
        let name = res.data.content.name;
        let template = res.data.content.template;

        hanldeCreateGroupTitle(removeWhiteSpaceFromArray(content));
        handleCreateOptionSelect(removeWhiteSpaceFromArray(content));

        globalState.resData.set(removeWhiteSpaceFromArray(content));
      }
    });
  };

  const removeWhiteSpaceFromArray = (array) => {
    return array.filter((item) => item !== ' ');
  };

  const hanldeCreateGroupTitle = (data) => {
    let result = [];
    let obj = {};
    if (data.length !== 0 && data !== undefined) {
      let target = data.shift();
      target &&
        Object.keys(target).map((x) => {
          result.indexOf(x) === -1 && result.push(x);

          obj[x] = '';
        });
    }
    setIpField(obj);

    setTitleTable(result);
  };

  useEffect(() => {
    handleCreateOptionSelect(globalState.resData.get);
  }, [globalState.resData.get]);

  const handleCreateOptionSelect = (data) => {
    let objGroup = {};
    let arrGroup = [];
    data.map((x) => Object.keys(x).map((x2) => arrGroup.indexOf(x2) === -1 && arrGroup.push(x2)));

    arrGroup.map((x) => {
      let list = createOption(data, x);

      objGroup[x] = list;
    });

    setDataOption(objGroup);
  };

  const createOption = (data, key) => {
    let arr = [];
    data.map((el) => {
      arr.indexOf(el[key]) === -1 && arr.push(el[key]);
    });

    return arr;
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Context.Provider value={globalState}>
      <FormManage titleTable={titleTable} setTitleTable={setTitleTable} />

      <ResultTable titleTable={titleTable} setTitleTable={setTitleTable} />
    </Context.Provider>
  );
});

export default React.memo(Content);
