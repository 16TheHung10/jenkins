import { useAppContext } from 'contexts';
import { useEffect, useRef, useState } from 'react';

const useItemOptions = () => {
  const searchItemRef = useRef();
  const [itemSearch, setItemSearch] = useState('');
  const { state: AppState, onGetItemOptions } = useAppContext();
  useEffect(() => {
    if (searchItemRef.current) {
      clearTimeout(searchItemRef.current);
    }
    searchItemRef.current = setTimeout(() => {
      onGetItemOptions(itemSearch);
    }, [500]);
    return () => {
      clearTimeout(searchItemRef.current);
    };
  }, [itemSearch]);

  return { itemOptions: AppState.itemOptions, onSetItemSearch: setItemSearch };
};

export default useItemOptions;

