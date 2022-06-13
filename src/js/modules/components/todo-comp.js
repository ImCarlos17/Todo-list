import { CreateElement } from "../factories/elementsHtml";
import PubSub from "pubsub-js";
import { uid } from "uid";

const contentModalDescription = document.querySelector(".content-description");
const descriptionModal = document.querySelector("#description-modal");
const deleteElement = (element) => (element.style.display = "none");
const GET_ACTUAL_PROJECT = "GET_ACTUAL_PROJECT";
const REMOVE_TASK = "REMOVE_TASK";

let actualProject;

const setActualProject = (msg, project) => {
  actualProject = project;
  console.log(actualProject);
};

const setContentModalDescription = (text) => {
  contentModalDescription.textContent = text;
};

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
const desactiveModalDescription = (e) => {
  if (e.target == descriptionModal) {
    hiddenModal(descriptionModal);
  }
};

const priorityColorClass = (priority) => {
  let priorityClass;

  if (priority == "Low") {
    priorityClass = "low-priority";
  } else if (priority == "Medium") {
    priorityClass = "medium-priority";
  } else if (priority == "High") {
    priorityClass = "high-priority";
  }
  return priorityClass;
};

const elementToDo = ({ UID, title, description, dueDate, priority }) => {
  const containerTask = CreateElement({
    elementType: "div",
    elementClass: "container-task",
    elementId: UID,
  });

  const taskInput = CreateElement({
    elementType: "input",
    typeAttribute: "checkbox",
    eventListener: {
      type: "click",
      function: (e) => {
        deleteElement(containerTask);
        console.log(actualProject);
        PubSub.publish(REMOVE_TASK, {
          projectName: actualProject,
          taskUID: e.path[1].id,
        });
      },
    },
  });

  const taskWrapper = CreateElement({
    elementType: "div",
    elementClass: "task__wrapper",
  });

  const taskTitle = CreateElement({
    elementType: "p",
    elementClass: "task__title",
    elementContent: title,
  });

  const taskDescription = CreateElement({
    elementType: "p",
    elementClass: "task__description",
    elementContent: "Click to see",
    eventListener: {
      type: "click",
      function: () => {
        setContentModalDescription(description);
        showModal(descriptionModal);

        descriptionModal.addEventListener("click", desactiveModalDescription);
      },
    },
  });

  const taskDate = CreateElement({
    elementType: "p",
    elementClass: "task__date",
    elementContent: dueDate,
  });

  const taskPriority = CreateElement({
    elementType: "p",
    elementClass: priorityColorClass(priority),
    elementContent: priority,
  });

  taskWrapper.appendChild(taskTitle);
  taskWrapper.appendChild(taskDescription);
  taskWrapper.appendChild(taskDate);
  taskWrapper.appendChild(taskPriority);

  containerTask.appendChild(taskInput);
  containerTask.appendChild(taskWrapper);

  return containerTask;
};

PubSub.subscribe(GET_ACTUAL_PROJECT, setActualProject);

export default elementToDo;
