import { CreateElement } from "../factories/elementsHtml";
import PubSub from "pubsub-js";

const deleteProject = (element) => (element.style.display = "none");
const REMOVE_PROJECT = "REMOVE_PROJECT";

const elementProject = ({ title, UID }) => {
  const containerProject = CreateElement({
    elementType: "div",
    elementClass: "btns-project",
    elementId: UID,
  });

  const paraProject = CreateElement({
    elementType: "p",
    elementContent: title,
  });

  const btnDelete = CreateElement({
    elementType: "div",
    elementClass: "btn-delete",
    elementContent: "x",
    eventListener: {
      type: "click",
      function: (e) => {
        e.preventDefault();
        PubSub.publish(REMOVE_PROJECT, e.path[1].id);
        deleteProject(containerProject);
      },
    },
  });

  containerProject.appendChild(paraProject);
  containerProject.appendChild(btnDelete);

  return containerProject;
};

export default elementProject;
