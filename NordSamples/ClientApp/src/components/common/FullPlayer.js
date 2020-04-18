import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import Duration from '../../services/Duration';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import PauseCircleFilledIcon from '@material-ui/icons/PauseCircleFilled';
import { makeStyles } from '@material-ui/core/styles';
import { Store } from '../../state/Store';

const useStyles = makeStyles((theme) => ({
  mp3Player: {
    borderRadius: '10px',
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12);',
  },
  mp3PlayerInverse: {
    display: 'flex',
    alignItems: 'center',
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    margin: 0,
    padding: '0 !important',
    fontSize: '12px',
  },
}));

const getFilename = (filename) => {
  if (filename.startsWith('patch_')) {
    return filename.substring(filename.indexOf('_', 6) + 1);
  }
  return filename;
};

const FullPlayer = (props) => {
  const { state, dispatch } = React.useContext(Store);
  const [playing, setPlaying] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const player = React.createRef();
  const classes = useStyles();

  useEffect(() => {
    if (state.activeMp3Context && props.id === state.activeMp3Context.fileId && props.context === state.activeMp3Context.context) {
      if (!playing) {
        setPlaying(true);
      }
    } else {
      setPlaying(false);
    }
  }, [state.activeMp3Context, props, playing]);

  const handlePause = () => {
    dispatch({
      type: 'setPlayMp3Id',
      id: null,
    });
  };

  const handlePlay = () => {
    dispatch({
      type: 'setPlayMp3Id',
      activeMp3Context: { fileId: props.id, context: props.context },
    });
  };

  return (
    <Grid container spacing={2} className={props.inverse ? classes.mp3PlayerInverse : classes.mp3Player}>
      <Grid item xs={2}>
        <Box className={classes.controls} m={0}>
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
            onProgress={(state) => setPlayed(state.played)}
            onDuration={(duration) => setDuration(duration)}
          />
          {playing ? (
            <PauseCircleFilledIcon color={props.inverse ? 'primary' : 'inherit'} fontSize='large' onClick={handlePause} className='react-player' />
          ) : (
            <PlayCircleFilledIcon color={props.inverse ? 'primary' : 'inherit'} fontSize='large' onClick={handlePlay} className='react-player' />
          )}
        </Box>
      </Grid>
      {props.progress && (
        <Grid item xs={8}>
          {props.filename && (
            <Grid item xs={12} className={classes.title}>
              {getFilename(props.filename)}
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
