import PubSub from "pubsub-js";

const storageController = (() => {
  const UPDATE_STORAGE_PROJECTS = "UPDATE_STORAGE_PROJECTS";
  const UPDATE_PROJECT_LIST = "UPDATE_PROJECT_LIST";

  const storage = window.localStorage;

  const set = (msg, value) => {
    storage.setItem("projects", JSON.stringify(value));
  };

  const get = (key) => {
    return JSON.parse(storage.getItem(key));
  };

  PubSub.subscribe(UPDATE_STORAGE_PROJECTS, set);
  PubSub.publish(UPDATE_PROJECT_LIST, get("projects"));
})();
