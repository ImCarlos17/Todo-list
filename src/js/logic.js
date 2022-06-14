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
  const RENDER_TASKS_TITLE = "RENDER_TASKS_TITLE";
  const INIT_ACTUAL_PROJECT = "INIT_ACTUAL_PROJECT";

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
  };

  const addProjectToList = (msg, project) => {
    projectList.push(project);
    PubSub.publish(UPDATE_STORAGE_PROJECTS, projectList);
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

  const removeTask = (msg, { projectName, taskUID }) => {
    const project = getProject(projectName);
    project.deleteTask(taskUID);
    PubSub.publish(UPDATE_STORAGE_PROJECTS, projectList);
  };

  const addDefaultProjects = () => {
    addProjectToList("msg", Project({ title: "Estudiar", UID: uid() }));
    addProjectToList("msg", Project({ title: "Entrenar", UID: uid() }));
    addProjectToList("msg", Project({ title: "Compras", UID: uid() }));

    addTaskToProject("msg", {
      projectName: "Estudiar",
      task: {
        UID: uid(),
        title: "Javascript",
        description: "fundamentos",
        dueDate: "2022-01-30",
        priority: "High",
      },
    });

    addTaskToProject("msg", {
      projectName: "Entrenar",
      task: {
        UID: uid(),
        title: "Workout",
        description: "2pm-5pm",
        dueDate: "2022-01-20",
        priority: "High",
      },
    });

    addTaskToProject("msg", {
      projectName: "Compras",
      task: {
        UID: uid(),
        title: "SuperMarket",
        description: "todo lo necesario",
        dueDate: "2022-01-20",
        priority: "High",
      },
    });
  };

  const InitDeafualtProjectList = (msg, storageList) => {
    if (storageList) {
      const defaultProjectList = storageList[0];
      renderActualProject("text", defaultProjectList.title);
    } else {
      addDefaultProjects();
    }
  };

  const renderActualProject = (msg, projectName) => {
    const projectTitle = getProject(projectName).title;
    const taskList = getProject(projectName).tasks;
    PubSub.publish(RENDER_TASKS_TITLE, {
      title: projectTitle,
      tasks: taskList,
    });
  };

  PubSub.subscribe(UPDATE_PROJECT_LIST, updateProjecList);
  PubSub.subscribe(UPDATE_PROJECT_LIST, InitDeafualtProjectList);
  PubSub.subscribe(NOTIFY_NEW_PROJECT, addProjectToList);
  PubSub.subscribe(NOTIFY_NEW_TASK, addTaskToProject);
  PubSub.subscribe(GET_ACTUAL_PROJECT, setActualProject);
  PubSub.subscribe(REMOVE_PROJECT, removeProject);
  PubSub.subscribe(REMOVE_TASK, removeTask);
  PubSub.subscribe(INIT_ACTUAL_PROJECT, renderActualProject);
})();
export default moduleLogic;
