import './style.css';

const todoFactory = (title, description, dueDate, priority) => {
  const sayHello = () => console.log(title);
  return { sayHello };
};

const projectFactory = (todoList) => {
  const sayHello = () => console.log('hello!');
  return { sayHello };
};

const jeff = todoFactory(
  'Get fitted for tux',
  'For upcoming wedding',
  '4/16/2023',
  'High'
);

jeff.sayHello(); // calls the function and logs 'hello!'
