import * as domFuncs from './domFuncs';
import './style.css';
import Icon from '../images/close_FILL0_wght400_GRAD0_opsz48.png';

const addTodoBtn = document.querySelector('.new-todo');
const projects = document.querySelectorAll('.project');
const popup = document.querySelector('.popup-container');
const closePopup = document.querySelector('.close-popup');
closePopup.src = Icon;
const newTodoForm = document.querySelector('.new-todo-form');
const cardContainer = document.querySelector('.card-container');

let masterList = [];

const admin = (newTodo) => {
  let masterList = [];
  const addToList = () => masterList.push(newTodo);
  const outputMasterList = () => console.log(masterList);
  return { outputMasterList, addToList };
};

const todoFactory = (title, description, dueDate, priority, project, done) => {
  return { title, description, dueDate, priority, project, done };
};

function removeTodoList(todo) {
  const cardsToRemove = document.querySelectorAll('.card');
  cardsToRemove.forEach((card) => {
    card.remove();
  });
}

function addTodoList(newTodo) {
  console.log(newTodo.done);
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
  dueDate.textContent = `Due Date: ${newTodo.dueDate}`;
  card.appendChild(dueDate);

  const priority = document.createElement('h2');
  priority.classList.add('priority');
  priority.textContent = `Priority: ${newTodo.priority}`;
  card.appendChild(priority);

  const removeTodoBtn = document.createElement('button');
  removeTodoBtn.classList.add('remove-todo');
  removeTodoBtn.textContent = 'Remove To Do';
  card.appendChild(removeTodoBtn);
}

function openForm() {
  popup.style.display = 'flex';
}

addTodoBtn.addEventListener('click', () => openForm());

popup.addEventListener('click', (e) => {
  if (
    e.target.className === 'popup-container' ||
    e.target.classList.contains('close-popup')
  ) {
    popup.style.display = 'none';
  }
});

document.onkeydown = (e) => {
  if (e.key === 'Escape') {
    popup.style.display = 'none';
  }
};

function submitForm(formData) {
  const formDataObj = Object.fromEntries(formData);
  const projectSelected = document.querySelector('.current-project');
  const newTodo = todoFactory(
    formDataObj.title,
    formDataObj.description,
    formDataObj['due-date'],
    formDataObj.priority,
    projectSelected.children[0].textContent
  );
  // console.log(projectSelected.children[0].textContent);
  masterList.push(newTodo);
  console.log(masterList[0]);
  addTodoList(newTodo);
}

function getData(form) {
  const formData = new FormData(form);
  submitForm(formData);
}

// Submit form
newTodoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  getData(e.target);
  popup.style.display = 'none';
  e.target.reset();
});

// Remove to do
document.addEventListener('click', (e) => {
  const target = e.target.closest('.remove-todo'); // Or any other selector.
  if (target) {
    const index = Array.prototype.indexOf.call(
      target.parentElement.parentElement.children,
      target.parentElement
    );
    masterList.splice(index, 1);
    target.parentElement.remove();
  }
});

// Done checkbox
document.addEventListener('click', (e) => {
  const target = e.target.closest('#done-checkbox'); // Or any other selector.
  if (target) {
    const index = Array.prototype.indexOf.call(
      target.parentElement.parentElement.children,
      target.parentElement
    );
    if (target.checked === true) {
      target.parentElement.classList.add('completed-todo');
      target.parentElement.children[5].classList.add('completed-todo');
      masterList[index].done = true;
    } else {
      target.parentElement.classList.remove('completed-todo');
      target.parentElement.children[5].classList.remove('completed-todo');
      masterList[index].done = false;
    }
  }
});

// Project selector
document.addEventListener('click', (e) => {
  const target = e.target.closest('.project'); // Or any other selector.
  if (target) {
    if (!target.classList.contains('current-project')) {
      projects.forEach((project) => {
        project.classList.remove('current-project');
      });
      target.classList.add('current-project');

      const otherProjectTodos = masterList.filter(
        (todo) => todo.project !== target.textContent.trim()
      );
      otherProjectTodos.forEach((todo) => {
        removeTodoList(todo);
      });
      const clickedProjectTodos = masterList.filter(
        (todo) => todo.project === target.textContent.trim()
      );
      clickedProjectTodos.forEach((todo) => {
        addTodoList(todo);
      });
    }
  }
});

const sampleTodo = todoFactory(
  'Go to gym',
  'Workout after work',
  '12312312',
  'low',
  'Personal',
  false
);
const sampleTodo2 = todoFactory(
  'Make bed',
  'Make bed after waking up',
  '54324534',
  'medium',
  'Personal',
  false
);

addTodoList(sampleTodo);
masterList.push(sampleTodo);
addTodoList(sampleTodo2);
masterList.push(sampleTodo2);
