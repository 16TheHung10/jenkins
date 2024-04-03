class CacheHelper {
	storages : null;
	static instance = null;
  	static createInstance() {
  	    var object = new CacheHelper();
    	  return object;
  	}

  	static getInstance() {
    	if (!CacheHelper.instance) {
        	CacheHelper.instance = CacheHelper.createInstance();
        	CacheHelper.instance.storages = {};
      	}
      	return CacheHelper.instance;
  	}

  	addFetch(key, value){
  		if(value !== undefined && CacheHelper.getInstance().storages[key] === undefined){
  			CacheHelper.getInstance().storages[key] = value;
  		}
  		return CacheHelper.getInstance().storages[key];
  	}

    setValue(key, value){
      CacheHelper.getInstance().storages[key] = value;
    }

    clear(){
      this.storages = {};
    }
}

export default CacheHelper;