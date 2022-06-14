import PubSub, { publish } from "pubsub-js";
import { uid } from "uid";
import ToDo from "./modules/factories/Todo";
import Project from "./modules/factories/Project";
import elementProject from "./modules/components/project-comp";
import elementToDo from "./modules/components/todo-comp";

const contentProject = document.querySelector(".project__content");
const projectTitle = document.querySelector(".project-title");
const containerProjects = document.querySelector("#new-projects");
const buttonProject = document.querySelector(".btn-add-project");
const modalProject = document.querySelector("#add-project-modal");
const modalAddTask = document.querySelector("#add-task-modal");
const btnAddTask = document.querySelector("#add-task");
const btnCancelProject = document.querySelector("#btn-cancel-project");
const projectForm = document.querySelector("#form_project");
const taskForm = document.querySelector("#form_task");

const moduleView = (() => {
  const NOTIFY_NEW_PROJECT = "NOTIFY_NEW_PROJECT";
  const INIT_PROJECTS_LIST = "INIT_PROJECTS_LIST";
  const NOTIFY_NEW_TASK = "NOTIFY_NEW_TASK";
  const GET_ACTUAL_PROJECT = "GET_ACTUAL_PROJECT";
  const INIT_ACTUAL_PROJECT = "INIT_ACTUAL_PROJECT";
  const RENDER_TASKS_TITLE = "RENDER_TASKS_TITLE";

  const showModal = (modal) => {
    modal.style.opacity = "1";
    modal.style.visibility = "visible";
    modal.classList.toggle("hidden");
  };

  const hiddenModal = (modal) => {
    modal.style.opacity = "0";
    modal.style.visibility = "hidden";
    modal.classList.toggle("hidden");
  };

  const controllerModals = (() => {
    buttonProject.addEventListener("click", () => {
      const activeModal = showModal(modalProject);
    });

    btnAddTask.addEventListener("click", () => {
      const activeModal = showModal(modalAddTask);
    });

    window.addEventListener("click", (e) => {
      if (e.target == modalProject) {
        const desactiveModal = hiddenModal(modalProject);
      }
      if (e.target == modalAddTask) {
        const desactiveModal = hiddenModal(modalAddTask);
      }
    });

    btnCancelProject.addEventListener("click", (e) => {
      const desactiveModal = hiddenModal(modalProject);
    });
  })();

  const actualProject = (() => {
    let project;
    const get = () => project;

    const set = (title) => {
      project = title;
      PubSub.publish(GET_ACTUAL_PROJECT, actualProject.get());
    };

    return { get, set };
  })();

  const projectController = (() => {
    const clearContainerTasks = () => (contentProject.innerHTML = "");

    const appendProject = (project) => {
      containerProjects.appendChild(project);
    };

    const renderTitleProject = (msg, { title }) => {
      projectTitle.textContent = title;
    };

    const appendTaskToProject = (task) => {
      contentProject.appendChild(task);
    };

    const addTaskToProject = (msg, task) => {
      actualProject.get().tasks.push(task);
    };

    const renderTask = (task) => {
      appendTaskToProject(
        elementToDo({
          UID: task.UID,
          title: task.title,
          description: task.description,
          dueDate: task.dueDate,
          priority: task.priority,
        })
      );
    };

    const renderProject = (project) => {
      const projectElementHtml = elementProject({
        title: project.title,
        UID: project.UID,
      });

      projectElementHtml.addEventListener("click", (e) => {
        actualProject.set(project.title);

        clearContainerTasks();
        PubSub.publish(GET_ACTUAL_PROJECT, actualProject.get());
        PubSub.publish(INIT_ACTUAL_PROJECT, actualProject.get());
      });

      appendProject(projectElementHtml);
    };

    const renderProjectList = (msg, projectList) => {
      projectList.map((project) => renderProject(project));
    };

    const renderProjectTask = (msg, { tasks }) => {
      tasks.map(renderTask);
    };

    return {
      renderTitleProject,
      clearContainerTasks,
      renderProject,
      renderTask,
      renderProjectList,
      renderProjectTask,
      addTaskToProject,
    };
  })();

  projectForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const projectObject = Project({
      title: e.target.name_project.value,
      UID: uid(),
    });

    projectController.renderProject(projectObject);
    actualProject.set(projectObject.title);
    PubSub.publish(NOTIFY_NEW_PROJECT, projectObject);
    projectForm.reset();
    const desactiveModal = hiddenModal(modalProject);
  });

  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const todoObject = ToDo({
      UID: uid(),
      title: e.target.title.value,
      description: e.target.description.value,
      dueDate: e.target.date.value,
      priority: e.target.priority.value,
    });

    const taskObject = {
      projectName: actualProject.get(),
      task: todoObject,
    };

    projectController.renderTask(todoObject);
    PubSub.publish(NOTIFY_NEW_TASK, taskObject);

    form_task.reset();
    const desactiveModal = hiddenModal(modalAddTask);
  });

  PubSub.subscribe(INIT_PROJECTS_LIST, projectController.renderProjectList);
  PubSub.subscribe(RENDER_TASKS_TITLE, projectController.renderTitleProject);
  PubSub.subscribe(RENDER_TASKS_TITLE, projectController.renderProjectTask);
})();

export default moduleView;
