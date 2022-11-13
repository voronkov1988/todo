import './task-list.css';
import className from 'classnames';
import PropTypes from 'prop-types';

import Task from '../task';

function TaskList({ todos, onDeleted, onToggleDone, onEditing, onFormatLabel, onUpdateTime }) {
  const listItems = todos.map(({ id, done, editing, label, time }) => (
    <li key={id} className={className({ completed: done, editing })}>
      <Task
        label={label}
        time={time}
        done={done}
        editing={editing}
        onDeleted={() => onDeleted(id)}
        onToggleDone={() => onToggleDone(id)}
        onEditing={() => onEditing(id)}
        onFormatLabel={(lb) => onFormatLabel(id, lb)}
        onUpdateTime={(timeState) => onUpdateTime(id, timeState)}
      />
    </li>
  ));

  return <ul className="todo-list">{listItems}</ul>;
}

TaskList.propTypes = {
  onDeleted: PropTypes.func.isRequired,
  onToggleDone: PropTypes.func.isRequired,
  onEditing: PropTypes.func.isRequired,
  todos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      done: PropTypes.bool,
      editing: PropTypes.bool,
      label: PropTypes.string,
      time: PropTypes.shape({
        taskAddTime: PropTypes.number,
        timeToNow: PropTypes.string,
        min: PropTypes.number,
        sec: PropTypes.number,
        work: PropTypes.bool,
      }),
    })
  ).isRequired,
};

export default TaskList;
