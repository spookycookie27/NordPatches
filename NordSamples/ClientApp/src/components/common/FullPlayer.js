import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import Duration from '../../services/Duration';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import PauseCircleFilledIcon from '@material-ui/icons/PauseCircleFilled';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  mp3Player: {
    borderRadius: '25px',
    backgroundColor: '#cc0930',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12);'
  },
  mp3PlayerInverse: {
    display: 'flex',
    alignItems: 'center'
  },
  controls: {
    display: 'flex',
    alignItems: 'center'
  },
  title: {
    margin: 0,
    padding: '0 !important',
    fontSize: '12px'
  }
}));

const FullPlayer = props => {
  const [playing, setPlaying] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const player = React.createRef();
  const classes = useStyles();
  return (
    <Grid container spacing={2} className={props.inverse ? classes.mp3PlayerInverse : classes.mp3Player}>
      <Grid item xs={2}>
        <Box className={classes.controls}>
          <ReactPlayer
            ref={player}
            className='react-player'
            width='0'
            height='0'
            url={props.src}
            playing={playing}
            controls={false}
            light={false}
            loop={false}
            playbackRate={1.0}
            volume={0.8}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onProgress={state => setPlayed(state.played)}
            onDuration={duration => setDuration(duration)}
          />
          {playing ? (
            <PauseCircleFilledIcon color={props.inverse ? 'primary' : 'inherit'} fontSize='large' onClick={() => setPlaying(!playing)} />
          ) : (
            <PlayCircleFilledIcon color={props.inverse ? 'primary' : 'inherit'} fontSize='large' onClick={() => setPlaying(!playing)} />
          )}
        </Box>
      </Grid>
      {props.progress && (
        <Grid item xs={8}>
          {props.filename && (
            <Grid item xs={12} className={classes.title}>
              {props.filename}
            </Grid>
          )}
          <progress max={1} value={played} style={{ width: '100%' }} />
        </Grid>
      )}
      {props.duration && (
        <Grid item xs={2}>
          <Duration seconds={duration * played} />
        </Grid>
      )}
    </Grid>
  );
};

export default FullPlayer;
