import { format } from 'date-fns';

const cardContainer = document.querySelector('.card-container');
const headerContainer = document.querySelector('.header-container');

function addTodoList(newTodo) {
  const card = document.createElement('div');
  card.classList.add('card');
  cardContainer.appendChild(card);

  const done = document.createElement('input');
  done.setAttribute('type', 'checkbox');
  done.setAttribute('name', 'done-checkbox');
  done.setAttribute('id', 'done-checkbox');
  done.checked = newTodo.done;
  if (done.checked === true) card.classList.add('completed-todo');

  card.appendChild(done);

  const title = document.createElement('h2');
  title.classList.add('title');
  title.textContent = newTodo.title;
  card.appendChild(title);

  const description = document.createElement('div');
  description.classList.add('description');
  description.textContent = newTodo.description;
  card.appendChild(description);

  const dueDate = document.createElement('div');
  dueDate.classList.add('due-date');
  dueDate.textContent = `Due: ${newTodo.dueDate}`;
  card.appendChild(dueDate);

  const priority = document.createElement('div');
  priority.classList.add('priority');
  priority.textContent = `Priority: ${newTodo.priority}`;
  card.appendChild(priority);

  const removeTodoBtn = document.createElement('button');
  removeTodoBtn.classList.add('remove-todo');
  removeTodoBtn.textContent = 'Remove To Do';
  if (done.checked === true) removeTodoBtn.classList.add('completed-todo');
  card.appendChild(removeTodoBtn);
}

function clearAllCards() {
  const cardsToRemove = document.querySelectorAll('.card');
  cardsToRemove.forEach((card) => {
    card.remove();
  });
}

function addProject(name) {
  const project = document.createElement('div');
  project.classList.add('project');
  headerContainer.appendChild(project);

  const projectName = document.createElement('h1');
  projectName.textContent = name;
  project.appendChild(projectName);
}

function removeProject(proj) {
  proj.remove();
}

export { addTodoList, clearAllCards, addProject, removeProject };
