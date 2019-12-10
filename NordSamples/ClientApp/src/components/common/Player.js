import React, { Component } from 'react';
import ReactPlayer from 'react-player';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';

class Player extends Component {
  constructor(props) {
    super(props);
    this.player = React.createRef();
    this.state = {
      playing: false
    };
    this.playPause = this.playPause.bind(this);
  }

  playPause(e) {
    this.setState({ playing: !this.state.playing });
  }

  render() {
    const { playing } = this.state;
    const { src } = this.props;
    return (
      <div>
        <span className='controls'>{playing ? <StopIcon onClick={this.playPause} /> : <PlayArrowIcon onClick={this.playPause} />}</span>
        <span>
          <ReactPlayer
            ref={this.player}
            className='react-player'
            width='0'
            height='0'
            url={src}
            playing={playing}
            controls={false}
            light={false}
            loop={false}
            playbackRate={1.0}
            volume={0.8}
            onPlay={() => this.setState({ playing: true })}
            onPause={() => this.setState({ playing: false })}
          />
        </span>
      </div>
    );
  }
}

export default Player;
