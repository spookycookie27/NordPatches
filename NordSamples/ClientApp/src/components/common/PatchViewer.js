import React, { useEffect, useState } from 'react';
import RestUtilities from '../../services/RestUtilities';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Rating from '@material-ui/lab/Rating';
import Tooltip from '@material-ui/core/Tooltip';
import { categories, instruments, blobUrl } from '../../Constants';
import Button from '@material-ui/core/Button';
import { nufFileLink } from './Common';
import FullPlayer from '../common/FullPlayer';
import { useGlobalState } from '../../State';
import moment from 'moment';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  fileContainer: {
    padding: theme.spacing(1),
    marginBottom: theme.spacing(2)
  },
  file: {
    color: 'inherit',
    textDecoration: 'none'
  },
  title: {
    fontSize: '16px'
  },
  card: {
    marginBottom: theme.spacing(2)
  },
  mainCard: {
    marginBottom: theme.spacing(2)
  },
  audio: {
    width: '100%'
  },
  ratingBox: {
    display: 'flex',
    alignItems: 'center'
  }
}));

const labels = {
  1: 'Useless',
  2: 'Poor',
  3: 'Ok',
  4: 'Good',
  5: 'Excellent'
};

function IconContainer(props) {
  const { value, ...other } = props;
  return (
    <Tooltip title={labels[value] || ''}>
      <span {...other} />
    </Tooltip>
  );
}

const PatchViewer = props => {
  const classes = useStyles();
  const [patch, setPatch] = useState(null);
  const [userRating, setUserRating] = useState(null);
  const [globalRating, setGlobalRating] = useState(null);
  const [user] = useGlobalState('user');

  const refreshData = async () => {
    const url = `/api/patch/${props.patchId}`;
    const res = await RestUtilities.get(url);
    res.json().then(patch => {
      const userRating = patch.ratings.find(r => r.appUserId === user.id);
      const userRatingValue = userRating ? userRating.value : null;
      const globalRating = patch.ratings.reduce((p, c) => p + c.value, 0) / patch.ratings.length;
      setPatch(patch);
      setUserRating(userRatingValue);
      setGlobalRating(globalRating);
    });
  };

  useEffect(() => {
    const getData = async () => {
      refreshData();
    };
    getData();
  }, []);

  const renderFile = file => {
    return (
      <Paper className={classes.fileContainer} key={file.id}>
        <a href={`${nufFileLink}${file.attachId}`} className={classes.file}>
          <Box>
            <Box>
              <strong>Name:</strong> {file.name}
            </Box>
            <Box>
              <strong>File ID:</strong> {file.id}
            </Box>
            <Box>
              <strong>Size (bytes):</strong> {file.size}
            </Box>
            <Box>
              <strong>Version:</strong> {file.version + 1}
            </Box>
          </Box>
        </a>
      </Paper>
    );
  };

  const addRating = async newValue => {
    setUserRating(newValue);
    const url = `/api/patch/rating/${patch.id}`;
    await RestUtilities.post(url, newValue);
    refreshData();
  };

  const renderPatch = patch => {
    const mp3s = patch.patchFiles.filter(x => x.file.extension === 'mp3').map(x => x.file);
    const files = patch.patchFiles.filter(x => x.file.extension !== 'mp3').map(x => x.file);
    return (
      <Card className={classes.mainCard} key={patch.id}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item md={6} xs={12}>
              <Typography className={classes.title} color='textSecondary' gutterBottom>
                {patch.name}
              </Typography>
              <Box>
                <strong>Patch ID:</strong> {patch.id}
              </Box>
              <Box className={classes.ratingBox}>
                <strong>Overall Rating:</strong>
                <Rating name='average-rating' value={globalRating} precision={0.25} readOnly />
              </Box>
              <Box>
                <strong>Category:</strong> {patch.categoryId && categories[patch.categoryId]}
              </Box>
              <Box>
                <strong>Description:</strong> {patch.description || 'tbc'}
              </Box>
              <Box>
                <strong>Instrument Type:</strong> {patch.instrumentId && instruments[patch.instrumentId]}
              </Box>
              <Box>
                <strong>User:</strong> {patch.user && patch.user.username}
              </Box>
              <Box>
                <strong>Date Created:</strong> {patch.dateCreated ? moment(patch.dateCreated).format('Do MMM YYYY') : 'unknown'}
              </Box>
              <Box>
                <strong>Parent ID:</strong> {patch.parentPatchId}
              </Box>
              <Box>
                <strong>Link:</strong>{' '}
                <a href={patch.link} target='_blank' rel='noopener noreferrer'>
                  Click
                </a>
              </Box>
              <Box className={classes.ratingBox}>
                <strong>How would you rate this?</strong>
                <Rating
                  name='user-rating'
                  value={userRating}
                  precision={1}
                  onChange={(event, newValue) => {
                    addRating(newValue);
                  }}
                  IconContainerComponent={IconContainer}
                />
              </Box>
            </Grid>
            <Grid item md={6} xs={12}>
              <Typography className={classes.title} color='textSecondary' gutterBottom>
                Files
              </Typography>
              <Box my={3} mx={1}>
                {mp3s.map(mp3 => {
                  if (!mp3) return null;
                  const link = mp3.isBlob ? `${blobUrl}/mp3s/${mp3.name}` : `${nufFileLink}${mp3.attachId}`;
                  return <FullPlayer src={link} key={mp3.id} duration progress filename={mp3.name} />;
                })}
              </Box>
              <Box mt={2}>{files.map(x => renderFile(x))}</Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };

  if (!patch) return null;
  var hasVariations = patch.parent || patch.children.length > 0;
  return (
    <>
      <DialogContent>
        {renderPatch(patch)}
        {hasVariations && (
          <>
            <Typography variant='h6' className={classes.title} color='textSecondary' gutterBottom>
              Variations
            </Typography>
            {patch.parent && renderPatch(patch.parent)}
            {patch.children.length > 0 && patch.children.map(x => renderPatch(x))}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button size='small' onClick={props.onClose} color='secondary' variant='contained'>
          Close
        </Button>
      </DialogActions>
    </>
  );
};

export default PatchViewer;
