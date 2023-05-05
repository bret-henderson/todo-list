import { format, isSameDay } from 'date-fns';
import * as domFuncs from './domFuncs';
import Project from './Project';
import './style.css';
import Icon from '../images/close_FILL0_wght400_GRAD0_opsz48.png';

const addTodoBtn = document.querySelector('.new-todo');
const popup = document.querySelector('.popup-container.todo');
const popupProj = document.querySelector('.popup-container.proj');
const closePopup = document.querySelectorAll('.close-popup');
closePopup.forEach((popup) => {
  popup.src = Icon;
});
const newTodoForm = document.querySelector('.new-todo-form');
const newProjForm = document.querySelector('.new-proj-form');
const deleteProjBtn = document.querySelector('.delete-project');
const newProjBtn = document.querySelector('.new-project');

let masterList = [];

function getData(form) {
  const formData = new FormData(form);
  const formDataObj = Object.fromEntries(formData);
  return formDataObj;
}

// PROJECTS -------------------------

// Create new project
function createNewProject(name, todos) {
  const newProj = new Project(name, todos);
  masterList.push(newProj);
  domFuncs.addProject(name);
}

newProjBtn.addEventListener('click', () => {
  popupProj.style.display = 'flex';
});

// Select project
function selectProject(selectedProj) {
  const projects = document.querySelectorAll('.project');
  projects.forEach((proj) => {
    proj.classList.remove('current-project');
  });
  selectedProj.classList.add('current-project');
  const currentProj = masterList.find(
    (proj) => proj.getName() === selectedProj.children[0].textContent
  );
  currentProj.todos.forEach((todo) => {
    domFuncs.addTodoList(todo);
  });
}

// Project form
function submitProjForm(formData) {
  const formDataObj = Object.fromEntries(formData);
  const newProjName = formDataObj['project-name'];
  createNewProject(newProjName, []);
  const projToSelect = document.querySelector('.header-container').lastChild;
  selectProject(projToSelect);
}

// Submit new project form
newProjForm.addEventListener('submit', (e) => {
  e.preventDefault();
  domFuncs.clearAllCards();
  popupProj.style.display = 'none';
  submitProjForm(getData(e.target));
  e.target.reset();
});

// Delete project
deleteProjBtn.addEventListener('click', () => {
  const projToDelete = document.querySelector('.current-project');
  domFuncs.removeProject(projToDelete);
  const index = masterList.findIndex(
    (proj) => proj.getName() === projToDelete.children[0].textContent
  );
  masterList.splice(index, 1);
  domFuncs.clearAllCards();
  const projToSelect = document.querySelector('.project');
  selectProject(projToSelect);
});

// Project selector
document.addEventListener('click', (e) => {
  const target = e.target.closest('.project'); // Or any other selector.
  if (target) {
    const projects = document.querySelectorAll('.project');
    if (!target.classList.contains('current-project')) {
      projects.forEach((project) => {
        project.classList.remove('current-project');
      });
      target.classList.add('current-project');

      // Create a blank slate
      domFuncs.clearAllCards();

      // Add cards from newly clicked project
      const clickedProj = masterList.find(
        (proj) => proj.getName() === target.textContent
      );
      clickedProj.getTodos().forEach((todo) => {
        domFuncs.addTodoList(todo);
      });
    }
  }
});

// Close project popup if clicked outside
popupProj.addEventListener('click', (e) => {
  if (
    e.target.classList.contains('popup-container') ||
    e.target.classList.contains('close-popup')
  ) {
    popupProj.style.display = 'none';
  }
});

// Close popup on 'escape' press
document.onkeydown = (e) => {
  if (e.key === 'Escape') {
    popup.style.display = 'none';
    popupProj.style.display = 'none';
  }
};

// TODOs -------------------------

// todo factory function
const todoFactory = (title, description, dueDate, priority, project, done) => {
  return { title, description, dueDate, priority, project, done };
};

addTodoBtn.addEventListener('click', () => {
  const today = format(new Date(), 'yyyy-MM-dd');
  (document.getElementById('due-date').valueAsDate = new Date()).value = today;
  popup.style.display = 'flex';
});

// To do form
function submitTodoForm(formData) {
  const projectSelected = document.querySelector('.current-project');
  let date = formData['due-date'];
  const d = date.split('-')[2];
  const m = date.split('-')[1];
  const y = date.split('-')[0];
  date = d + '/' + m + '/' + y;
  const newTodo = todoFactory(
    formData.title,
    formData.description,
    date,
    formData.priority,
    projectSelected.children[0].textContent
  );
  const currentProj = masterList.find(
    (proj) => proj.getName() === projectSelected.children[0].textContent
  );
  currentProj.addTodo(newTodo);
  domFuncs.addTodoList(newTodo);
}

// Remove to do
document.addEventListener('click', (e) => {
  const target = e.target.closest('.remove-todo'); // Or any other selector.
  const currentProjName =
    document.querySelector('.current-project').children[0].textContent;
  if (target) {
    const todoName = e.target.parentElement.children[1].textContent;
    const currentProj = masterList.find(
      (proj) => proj.getName() === currentProjName
    );
    const currentTodo = currentProj.getTodo(todoName);
    currentProj.removeTodo(currentTodo);
    target.parentElement.remove();
  }
});

// Submit new todo form
newTodoForm.addEventListener('submit', (e) => {
  const currentProjName =
    document.querySelector('.current-project').children[0].textContent;
  const currentProj = masterList.find(
    (proj) => proj.getName() === currentProjName
  );
  const data = getData(e.target);
  if (
    currentProj.getTodos().find((x) => x.title === data.title) === undefined
  ) {
    submitTodoForm(getData(e.target));
    e.preventDefault();
    popup.style.display = 'none';
    e.target.reset();
  } else {
    alert('Duplicate todo name');
    e.preventDefault();
  }
});

// Done checkbox
document.addEventListener('click', (e) => {
  const target = e.target.closest('#done-checkbox'); // Or any other selector.
  const currentProjName =
    document.querySelector('.current-project').children[0].textContent;
  if (target) {
    const todoName = e.target.parentElement.children[1].textContent;
    const currentProj = masterList.find(
      (proj) => proj.getName() === currentProjName
    );
    const currentTodo = currentProj.getTodo(todoName);
    if (target.checked === true) {
      target.parentElement.classList.add('completed-todo');
      target.parentElement.children[5].classList.add('completed-todo');
      currentProj.setDone(currentTodo, true);
    } else {
      target.parentElement.classList.remove('completed-todo');
      target.parentElement.children[5].classList.remove('completed-todo');
      currentProj.setDone(currentTodo, false);
    }
  }
});

// Close todo popup if clicked outside
popup.addEventListener('click', (e) => {
  if (
    e.target.classList.contains('popup-container') ||
    e.target.classList.contains('close-popup')
  ) {
    popup.style.display = 'none';
  }
});

// CREATE SAMPLE PROJECTS & TODOS -------------------------

const sampleTodo = todoFactory(
  'Go to gym',
  'Workout after work',
  '05/10/2023',
  'low',
  'Personal',
  false
);
const sampleTodo2 = todoFactory(
  'Make bed',
  'Make bed after waking up',
  '05/12/2023',
  'medium',
  'Personal',
  false
);

const sampleTodo3 = todoFactory(
  'Call mom',
  'This is important',
  '05/12/2023',
  'high',
  'Personal',
  false
);

const sampleTodo4 = todoFactory(
  'Do timesheet',
  'Blah',
  '05/05/2023',
  'high',
  'Work',
  false
);

createNewProject('Personal', [sampleTodo, sampleTodo2, sampleTodo3]);
createNewProject('Work', [sampleTodo4]);

const defaultProj = document.querySelector('.project');
defaultProj.classList.add('current-project');

domFuncs.addTodoList(sampleTodo);
domFuncs.addTodoList(sampleTodo2);
domFuncs.addTodoList(sampleTodo3);
