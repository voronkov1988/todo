import './task.css';
import PropTypes from 'prop-types';

import ItemEditingTask from '../item-editing-task';
import Timer from '../timer';

function Task(props) {
  const {
    label,
    onDeleted,
    onToggleDone,
    onEditing,
    editing,
    onFormatLabel,
    onUpdateTime,
    done,
    time: { timeToNow, min, sec, work, deadline },
  } = props;

  const task = (
    <div className="view">
      <input className="toggle" type="checkbox" checked={done} onChange={onToggleDone} />
      <label>
        <span className="title">{label}</span>
        <Timer min={min} sec={sec} work={work} deadline={deadline} onUpdateTime={onUpdateTime} />
        <span className="description">{timeToNow}</span>
      </label>
      <button aria-label="edit" type="button" className="icon icon-edit" onClick={onEditing} />
      <button aria-label="destroy" type="button" className="icon icon-destroy" onClick={onDeleted} />
    </div>
  );

  return editing ? <ItemEditingTask label={label} onFormatLabel={onFormatLabel} onEditing={onEditing} /> : task;
}

Task.defaultProps = {
  label: '',
};

Task.propTypes = {
  label: PropTypes.string,
  time: PropTypes.shape({
    taskAddTime: PropTypes.number,
    timeToNow: PropTypes.string,
    min: PropTypes.number,
    sec: PropTypes.number,
  }).isRequired,
  onDeleted: PropTypes.func.isRequired,
  onToggleDone: PropTypes.func.isRequired,
  onEditing: PropTypes.func.isRequired,
};

export default Task;
