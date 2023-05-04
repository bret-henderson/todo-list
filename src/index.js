import * as domFuncs from './domFuncs';
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

function createNewProject(name) {
  masterList.push({ projName: name, todos: [] });
  domFuncs.addProject(name);
}

const todoFactory = (title, description, dueDate, priority, project, done) => {
  return { title, description, dueDate, priority, project, done };
};

function openForm() {
  popup.style.display = 'flex';
}

function openProjForm() {
  popupProj.style.display = 'flex';
}

// Delete project
deleteProjBtn.addEventListener('click', () => {
  const projToDelete = document.querySelector('.current-project');
  domFuncs.removeProject(projToDelete);
  const index = masterList.findIndex(
    (proj) => proj.projName === projToDelete.children[0].textContent
  );
  masterList.splice(index, 1);
  console.log(masterList);

  domFuncs.clearAllCards();
  const projToSelect = document.querySelector('.project');
  selectProject(projToSelect);
});

// Add todo
addTodoBtn.addEventListener('click', () => openForm());

// Add project
newProjBtn.addEventListener('click', () => openProjForm());

// Close todo popup if clicked outside
popup.addEventListener('click', (e) => {
  console.log(e.target);
  if (
    e.target.classList.contains('popup-container') ||
    e.target.classList.contains('close-popup')
  ) {
    popup.style.display = 'none';
  }
});

// Close project popup if clicked outside
popupProj.addEventListener('click', (e) => {
  console.log(e.target.className);
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

// To do form
function submitTodoForm(formData) {
  const formDataObj = Object.fromEntries(formData);
  const projectSelected = document.querySelector('.current-project');
  const newTodo = todoFactory(
    formDataObj.title,
    formDataObj.description,
    formDataObj['due-date'],
    formDataObj.priority,
    projectSelected.children[0].textContent
  );
  const index = masterList.findIndex(
    (proj) => proj.projName === projectSelected.children[0].textContent
  );
  console.log(index);
  masterList[index].todos.push(newTodo);
  domFuncs.addTodoList(newTodo);
}

// Project form
function submitProjForm(formData) {
  const formDataObj = Object.fromEntries(formData);
  const newProjName = formDataObj['project-name'];
  createNewProject(newProjName);
  const projToSelect = document.querySelector('.header-container').lastChild;
  selectProject(projToSelect);
}

function getData(form) {
  const formData = new FormData(form);
  return formData;
}

// Submit new todo form
newTodoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  // getData(e.target);
  submitTodoForm(getData(e.target));
  popup.style.display = 'none';
  e.target.reset();
});

// Submit new project form
newProjForm.addEventListener('submit', (e) => {
  e.preventDefault();
  // getData(e.target);
  domFuncs.clearAllCards();
  popupProj.style.display = 'none';
  submitProjForm(getData(e.target));
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
  const currentProj = document.querySelector('.current-project');
  if (target) {
    console.log(target);
    const index = masterList.findIndex(
      (masterProj) =>
        masterProj.projName === currentProj.children[0].textContent
    );
    const index2 = Array.prototype.indexOf.call(
      target.parentElement.parentElement.children,
      target.parentElement
    );

    if (target.checked === true) {
      target.parentElement.classList.add('completed-todo');
      target.parentElement.children[5].classList.add('completed-todo');
      masterList[index].todos[index2].done = true;
    } else {
      target.parentElement.classList.remove('completed-todo');
      target.parentElement.children[5].classList.remove('completed-todo');
      masterList[index].todos[index2].done = false;
    }
  }
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
      const clickedProj = masterList.filter(
        (proj) => proj.projName === target.textContent
      );

      clickedProj[0].todos.forEach((todo) => {
        domFuncs.addTodoList(todo);
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

createNewProject('Personal');
createNewProject('Work');
createNewProject('Test Proj');

const defaultProj = document.querySelector('.project');
defaultProj.classList.add('current-project');

function selectProject(selectedProj) {
  const projects = document.querySelectorAll('.project');
  projects.forEach((proj) => {
    proj.classList.remove('current-project');
  });
  selectedProj.classList.add('current-project');
  const index = masterList.findIndex(
    (proj) => proj.projName === selectedProj.children[0].textContent
  );
  masterList[index].todos.forEach((todo) => {
    domFuncs.addTodoList(todo);
  });
}

domFuncs.addTodoList(sampleTodo);
domFuncs.addTodoList(sampleTodo2);
masterList[0].todos.push(sampleTodo);
masterList[0].todos.push(sampleTodo2);
