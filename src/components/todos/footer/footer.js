import './footer.css';
import PropTypes from 'prop-types';

import TasksFilter from '../tasks-filter';

function Footer({ onFilterChange, filter, onClearCompletedTasks, isCompletedTasksCounter }) {
  return (
    <footer className="footer">
      <span className="todo-count">{isCompletedTasksCounter}&nbsp;items left</span>
      <TasksFilter onFilterChange={onFilterChange} filter={filter} />
      <button type="button" className="clear-completed" onClick={onClearCompletedTasks}>
        Clear completed
      </button>
    </footer>
  );
}

Footer.defaultProps = {
  isCompletedTasksCounter: '$',
};
Footer.propTypes = {
  isCompletedTasksCounter: PropTypes.string,
};

export default Footer;
