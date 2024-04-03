import { APIHelper } from "helpers";

class MessageNotifyModel {
  pushMessage(params) {
    return APIHelper.post("/messagenotify", params);
  }

  getMessages(params = null) {
    return APIHelper.get("/messagenotify", params);
  }

  getReceivers(groupType) {
    return APIHelper.get("/messagenotify/receiver/" + groupType);
  }

  pushMessageTask(params) {
    return APIHelper.post("/messagenotify/pos/task", params);
  }

  pushMessageSyncTask(params) {
    return APIHelper.post("/messagenotify/synctask", params);
  }

  getLastMessages(objectID, groupType) {
    return APIHelper.get("/messagenotify/" + groupType + "/" + objectID);
  }

  getMessagesMember(params = null) {
    return APIHelper.get("/messagenotify/membertask", params);
  }

  pushMessageMember(params) {
    return APIHelper.post("/messagenotify/membertask", params);
  }

  cancelMessageMember(params) {
    return APIHelper.put("/messagenotify/membertask/cancel/" + params.id);
  }
}

export default MessageNotifyModel;
