import './tasks-filter.css';
import PropTypes from 'prop-types';
import className from 'classnames';

function TasksFilter({ onFilterChange, filter }) {
  const buttons = [
    { name: 'all', label: 'All' },
    { name: 'active', label: 'Active' },
    { name: 'completed', label: 'Completed' },
  ];

  const btnItems = buttons.map(({ name, label }) => (
    <li key={name}>
      <button className={className({ selected: filter === name })} onClick={() => onFilterChange(name)} type="button">
        {label}
      </button>
    </li>
  ));

  return <ul className="filters">{btnItems}</ul>;
}

TasksFilter.defaultProps = {
  filter: 'all',
};
TasksFilter.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
  filter: PropTypes.string,
};

export default TasksFilter;
