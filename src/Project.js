export default class Project {
  constructor(name, todos) {
    this.name = name;
    this.todos = todos;
  }

  getName() {
    return this.name;
  }

  getTodos() {
    return this.todos;
  }

  getTodo(name) {
    return this.todos.find((todo) => todo.title === name);
  }

  setDone(todo, flag) {
    this.todos.find((x) => x === todo).done = flag;
  }

  addTodo(todo) {
    this.todos.push(todo);
  }

  removeTodo(todo) {
    const index = this.todos.findIndex((x) => x === todo);
    this.todos.splice(index, 1);
  }
}
