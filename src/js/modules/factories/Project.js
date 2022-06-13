import ToDo from "./Todo";

const Project = ({ title, UID, tasks = [] }) => {
  const addTask = (task) => {
    tasks.push(ToDo(task));
  };

  const selectTask = (taskUID) => {
    const selectedTask = tasks.find((task) => task.UID === taskUID);
    return selectedTask;
  };

  const indexSelectTask = (taskUID) => {
    const indexTask = tasks.indexOf(selectTask(taskUID));
    return indexTask;
  };

  const deleteTask = (taskUID) => {
    const index = indexSelectTask(taskUID);
    tasks.splice(index, 1);
  };

  return { title, UID, tasks, addTask, deleteTask };
};

export default Project;
