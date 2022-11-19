import { Component } from 'react';
import './App.css';
import { formatDistanceToNow } from 'date-fns';

import TaskList from '../taskList/TaskList';
import ItemAddTask from '../itemAddTask/itemAddTask';
import Footer from '../footer/Footer';

const data = {
  todoData: [
    {
      id: '2488544113',
      done: false,
      editing: false,
      label: 'Complete task',
      time: { taskAddTime: 1667303819786, timeToNow: '2 minutes', work: false, deadline: null, min: 10, sec: 0 },
    },
    {
      id: '6986027266',
      done: false,
      editing: true,
      label: 'Editing task',
      time: { taskAddTime: 1667303819786, timeToNow: '2 minutes', work: false, deadline: null, min: 5, sec: 30 },
    },
    {
      id: '218227547',
      done: true,
      editing: false,
      label: 'Active task',
      time: { taskAddTime: 1667303819786, timeToNow: '2 minutes', work: false, deadline: null, min: 1, sec: 0 },
    },
  ],
  filter: 'all',
};

const optionsFormatDistanceToNow = { includeSeconds: true };
const getId = () => Math.floor(Math.random() * 10 ** 10).toString();

export default class App extends Component {
  static createTodoItem(label, min, sec) {
    return {
      id: getId(),
      done: false,
      editing: false,
      label,
      time: {
        taskAddTime: Date.now(),
        timeToNow: 'less than 2 seconds',
        work: false,
        deadline: null,
        min,
        sec,
      },
    };
  }

  static completedTasksCount = (ar) => `${ar.filter((item) => !item.done).length}`;

  static filter(items, filter) {
    const match = {
      all() {
        return items;
      },
      active() {
        return items.filter((item) => !item.done);
      },
      completed() {
        return items.filter((item) => item.done);
      },
    };
    return match[filter] ? match[filter]() : items;
  }

  static toggleStateTodoData = (todoData, id, key) =>
    todoData.map((el) => (el.id === id ? { ...el, [key]: !el[key] } : el));

  static getDataLocalStorage = (key) => JSON.parse(localStorage.getItem(key));

  _updateInterval = 4000;

  state = { todoData: [], filter: 'all' };

  componentDidMount() {
    const todos = App.getDataLocalStorage('todo');
    if (todos) {
      this.setState(todos);
    } else {
      this.setState(() => data);
    }

    this.timeTick();
  }

  componentDidUpdate() {
    localStorage.setItem('todo', JSON.stringify(this.state));
    onstorage = (event) => {
      if (event.key !== 'todo') return;
      const todos = App.getDataLocalStorage('todo');
      if (todos) {
        this.setState(() => todos);
      }
    };
  }

  componentWillUnmount() {
    clearTimeout(this._timerId);
  }

  timeTick = () => {
    this.setState(({ todoData }) => ({
      todoData: todoData.map((task) => {
        const timeToNow = formatDistanceToNow(task.time.taskAddTime, optionsFormatDistanceToNow);
        return { ...task, time: { ...task.time, timeToNow } };
      }),
    }));
    this._timerId = setTimeout(this.timeTick, this._updateInterval);
  };

  addTask = (label, min, sec) => {
    const newItem = App.createTodoItem(label, min, sec);
    this.setState(({ todoData }) => ({ todoData: [newItem, ...todoData] }));
  };

  deleteTask = (id) => {
    this.setState(({ todoData }) => ({ todoData: todoData.filter((item) => item.id !== id) }));
  };

  onEditing = (id) => {
    this.setState(({ todoData }) => ({
      todoData: App.toggleStateTodoData(todoData, id, 'editing'),
    }));
  };

  onToggleDone = (id) => {
    this.setState(({ todoData }) => ({
      todoData: App.toggleStateTodoData(todoData, id, 'done'),
    }));
  };

  onFormatLabel = (id, label) => {
    this.setState(({ todoData }) => ({
      todoData: todoData.map((el) => (el.id === id ? { ...el, label, editing: !el.editing } : el)),
    }));
  };

  onFilterChange = (filter) => {
    this.setState(() => ({ filter }));
  };

  onClearCompletedTasks = () => {
    this.setState(({ todoData }) => ({ todoData: todoData.filter((item) => !item.done) }));
  };

  onUpdateTime = (id, timeState) => {
    this.setState(({ todoData }) => ({
      todoData: todoData.map((el) => (el.id === id ? { ...el, time: { ...el.time, ...timeState } } : el)),
    }));
  };

  render() {
    const { todoData, filter } = this.state;
    const isVisibleItems = App.filter(todoData, filter);
    const completedTasksCount = App.completedTasksCount(todoData);

    return (
      <section className="todoapp">
        <ItemAddTask onAddTask={this.addTask} />
        <section className="main">
          <TaskList
            todos={isVisibleItems}
            onToggleDone={this.onToggleDone}
            onEditing={this.onEditing}
            onDeleted={this.deleteTask}
            onFormatLabel={this.onFormatLabel}
            onUpdateTime={this.onUpdateTime}
          />
          <Footer
            onFilterChange={this.onFilterChange}
            filter={filter}
            onClearCompletedTasks={this.onClearCompletedTasks}
            isCompletedTasksCounter={completedTasksCount}
          />
        </section>
      </section>
    );
  }
}
