import PubSub, { publish } from "pubsub-js";
import { uid } from "uid";
import Project from "./modules/factories/Project";

const moduleLogic = (() => {
  const NOTIFY_NEW_PROJECT = "NOTIFY_NEW_PROJECT";
  const NOTIFY_NEW_TASK = "NOTIFY_NEW_TASK";
  const UPDATE_STORAGE_PROJECTS = "UPDATE_STORAGE_PROJECTS";
  const UPDATE_PROJECT_LIST = "UPDATE_PROJECT_LIST";
  const INIT_PROJECTS_LIST = "INIT_PROJECTS_LIST";
  const GET_ACTUAL_PROJECT = "GET_ACTUAL_PROJECT";
  const REMOVE_PROJECT = "REMOVE_PROJECT";
  const REMOVE_TASK = "REMOVE_TASK";

  let actualProject;

  const setActualProject = (msg, project) => {
    actualProject = project;
  };

  let projectList = [];

  const updateProjecList = (msg, storageList) => {
    if (storageList) {
      projectList = storageList.map((project) => Project(project));
    } else {
      projectList = [];
    }

    PubSub.publish(INIT_PROJECTS_LIST, projectList);
    console.log(projectList);
  };

  const addProjectToList = (msg, project) => {
    projectList.push(project);
    PubSub.publish(UPDATE_STORAGE_PROJECTS, projectList);
    console.log(projectList);
  };

  const getProject = (name) => {
    return projectList.find((project) => project.title === name);
  };

  const addTaskToProject = (msg, { projectName, task }) => {
    const project = getProject(projectName);
    project.addTask(task);
    console.log(project);
    console.log(projectList);
    PubSub.publish(UPDATE_STORAGE_PROJECTS, projectList);
  };

  const removeProject = (msg, uidProject) => {
    const newProjectList = projectList.filter(
      (project) => project.UID !== uidProject
    );
    projectList.splice(0, projectList.length);

    PubSub.publish(UPDATE_STORAGE_PROJECTS, newProjectList);
  };

  const getProjectTask = (projectName) => {
    const tasks = getProject(projectName).tasks;
    return tasks;
  };

  const removeTask = (msg, { projectName, taskUID }) => {
    const project = getProject(projectName);
    project.deleteTask(taskUID);
    console.log(project);
    PubSub.publish(UPDATE_STORAGE_PROJECTS, projectList);
  };

  PubSub.subscribe(UPDATE_PROJECT_LIST, updateProjecList);
  PubSub.subscribe(NOTIFY_NEW_PROJECT, addProjectToList);
  PubSub.subscribe(NOTIFY_NEW_TASK, addTaskToProject);
  PubSub.subscribe(GET_ACTUAL_PROJECT, setActualProject);
  PubSub.subscribe(REMOVE_PROJECT, removeProject);
  PubSub.subscribe(REMOVE_TASK, removeTask);
})();
export default moduleLogic;
