import './timer.css';
import { Component } from 'react';
import PropTypes from 'prop-types';
import className from 'classnames';

class Timer extends Component {
  state = { work: false, min: 0, sec: 0 };

  SECOND = 1000;

  MINUTE = this.SECOND * 60;

  deadline = null;

  _updateInterval = 1000;

  componentDidMount() {
    const { min, sec, work, deadline } = this.props;
    this.setState(() => ({ min, sec, work }));
    if (work) {
      this.deadline = deadline;
      this.timeTick();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { min, sec, work } = this.state;
    // console.log(min, sec, work);
    const { onUpdateTime } = this.props;
    if (prevState.sec !== sec || prevState.min !== min || prevState.work !== work) {
      onUpdateTime({ min, sec, work, deadline: this.deadline });
    }
  }

  componentWillUnmount() {
    clearTimeout(this._timerId);
  }

  timeTick = () => {
    const time = this.deadline - Date.now();
    if (time <= 0) {
      this.setState(() => ({ min: 0, sec: 0, work: false }));
      this.deadline = null;
      return;
    }
    this.setState({ min: Math.floor(time / this.MINUTE), sec: Math.floor(time / this.SECOND) % 60 });

    this._timerId = setTimeout(this.timeTick, this._updateInterval);
  };

  handlePlay = () => {
    const { min, sec } = this.state;
    if (min <= 0 && sec <= 0) {
      this.deadline = Date.now() + 60 * this.MINUTE;
    } else {
      this.deadline = Date.now() + min * this.MINUTE + sec * this.SECOND;
    }
    this.setState(() => ({ work: true }));
    this.timeTick();
  };

  handlePause = () => {
    this.deadline = null;
    this.setState(() => ({ work: false }));
    clearTimeout(this._timerId);
  };

  render() {
    const { work, min, sec } = this.state;
    return (
      <span className="description">
        <button
          onClick={this.handlePlay}
          aria-label="start timer"
          type="button"
          className={className('icon icon-play', { 'icon--active': !work })}
          disabled={work}
        />
        <button
          onClick={this.handlePause}
          aria-label="pause timer"
          type="button"
          className={className('icon icon-pause', { 'icon--active': work })}
          disabled={!work}
        />

        <time aria-label="time">
          <span aria-label="min">{min.toString().padStart(2, '0')}</span>&nbsp;:&nbsp;
          <span aria-label="sec">{sec.toString().padStart(2, '0')}</span>
        </time>
      </span>
    );
  }
}

Timer.defaultProps = {
  sec: 0,
  min: 0,
  onUpdateTime: () => {},
};

Timer.propTypes = {
  sec: PropTypes.number,
  min: PropTypes.number,
  onUpdateTime: PropTypes.func,
};

export default Timer;
