import { Component, createRef } from 'react';
import './item-add-task.css';
import PropTypes from 'prop-types';
import className from 'classnames';

class ItemAddTask extends Component {
  state = { label: '', min: '', sec: '', dirtyLabel: true, dirtyMin: false, dirtySec: false };

  textInput = createRef();

  componentDidMount() {
    this.focusTextInput();
  }

  taskHandler = ({ target: { value } }) => {
    if (!value.trim()) {
      this.setState({ label: value, dirtyLabel: true });
    } else {
      this.setState({ label: value, dirtyLabel: false });
    }
  };

  handleChangeTime = ({ target: { name, value } }) => {
    const match = { min: 'dirtyMin', sec: 'dirtySec' };
    if (!Number.isInteger(Number(value)) && !value >= 0) {
      this.setState({ [name]: value.replace(/\D/g, ''), [match[name]]: true });
      return;
    }
    if (value > 60) {
      this.setState({ [name]: 60, [match[name]]: false });
    } else {
      this.setState({ [name]: value, [match[name]]: false });
    }
  };

  submitHandler = (e) => {
    e.preventDefault();
    const { label, min, sec, dirtyLabel, dirtyMin, dirtySec } = this.state;
    const { onAddTask } = this.props;
    if (dirtyLabel || dirtyMin || dirtySec) {
      return;
    }
    onAddTask(label, Number(min), Number(sec));
    this.setState({ label: '', min: '', sec: '', dirtyLabel: true, dirtyMin: false, dirtySec: false });
    this.focusTextInput();
  };

  focusTextInput() {
    this.textInput.current.focus();
  }

  render() {
    const { label, min, sec, dirtyMin, dirtySec } = this.state;
    return (
      <header className="header">
        <h1>todos</h1>
        <form className="new-todo-form" onSubmit={this.submitHandler}>
          <input
            className="new-todo"
            type="text"
            placeholder="Task"
            name="label"
            value={label}
            ref={this.textInput}
            onChange={this.taskHandler}
          />
          <input
            className={className('new-todo-form__timer', { 'new-todo-form__timer--error': dirtyMin })}
            type="text"
            placeholder="Min"
            name="min"
            value={min}
            onChange={this.handleChangeTime}
          />
          <input
            className={className('new-todo-form__timer', { 'new-todo-form__timer--error': dirtySec })}
            type="text"
            placeholder="Sec"
            name="sec"
            value={sec}
            onChange={this.handleChangeTime}
          />
          <button type="submit" aria-label="submit" style={{ display: 'none' }} />
        </form>
      </header>
    );
  }
}

ItemAddTask.propTypes = {
  onAddTask: PropTypes.func.isRequired,
};

export default ItemAddTask;
