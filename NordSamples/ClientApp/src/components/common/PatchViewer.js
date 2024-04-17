import React, { useEffect, useState } from 'react';
import RestUtilities from '../../services/RestUtilities';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Rating from '@material-ui/lab/Rating';
import Tooltip from '@material-ui/core/Tooltip';
import { categories, instruments, blobUrl, nufFileLink } from '../../Constants';
import FullPlayer from '../common/FullPlayer';
import moment from 'moment';
import { makeStyles } from '@material-ui/core/styles';
import { Store } from '../../state/Store';
import File from './File';

const useStyles = makeStyles((theme) => ({
  title: {
    fontSize: '18px',
  },
  mainCard: {
    marginBottom: theme.spacing(2),
  },
  audio: {
    width: '100%',
  },
  ratingBox: {
    display: 'flex',
    alignItems: 'center',
  },
}));

const labels = {
  1: 'Useless',
  2: 'Poor',
  3: 'Ok',
  4: 'Good',
  5: 'Excellent',
};

function IconContainer(props) {
  const { value, ...other } = props;
  return (
    <Tooltip title={labels[value] || ''}>
      <span {...other} />
    </Tooltip>
  );
}

const PatchViewer = (props) => {
  const classes = useStyles();
  const [patch, setPatch] = useState(null);
  const [userRating, setUserRating] = useState(null);
  const [globalRating, setGlobalRating] = useState(null);
  const { state } = React.useContext(Store);

  const refreshData = async () => {
    const url = `/api/patch/${props.patchId}`;
    const res = await RestUtilities.get(url);
    res.json().then((patch) => {
      if (state.user) {
        const userRating = patch.ratings.find((r) => r.appUserId === state.user.id);
        const userRatingValue = userRating ? userRating.value : null;
        setUserRating(userRatingValue);
      }
      const globalRating = patch.ratings.reduce((p, c) => p + c.value, 0) / patch.ratings.length;
      setPatch(patch);

      setGlobalRating(globalRating);
    });
  };

  useEffect(() => {
    const getData = async () => {
      refreshData();
    };
    getData();
  }, []);

  const addRating = async (newValue) => {
    setUserRating(newValue);
    const url = `/api/patch/rating/${patch.id}`;
    await RestUtilities.post(url, newValue);
    refreshData();
  };

  const renderPatch = (thisPatch, renderRating) => {
    const mp3s = thisPatch.patchFiles.filter((x) => x.file.extension === 'mp3' && !x.file.removed).map((x) => x.file);
    const files = thisPatch.patchFiles.filter((x) => x.file.extension !== 'mp3' && !x.file.removed).map((x) => x.file);
    return (
      <Grid container spacing={2}>
        <Grid item md={6} sm={12}>
          <Typography className={classes.title} color='textSecondary' gutterBottom>
            {thisPatch.name}
          </Typography>
          <Box>
            <strong>Sound ID:</strong> {thisPatch.id}
          </Box>
          {renderRating && (
            <Box className={classes.ratingBox}>
              <strong>Overall Rating:</strong>
              <Rating name='average-rating' value={globalRating} precision={0.25} readOnly />({thisPatch.ratings.length})
            </Box>
          )}
          <Box>
            <strong>Category:</strong> {thisPatch.categoryId && categories[thisPatch.categoryId]}
          </Box>
          <Box>
            <strong>Description:</strong> {thisPatch.description || 'tbc'}
          </Box>
          <Box>
            <strong>Instrument Type:</strong> {thisPatch.instrumentId && instruments[thisPatch.instrumentId]}
          </Box>
          <Box>
            <strong>User:</strong> {thisPatch.user && thisPatch.user.username}
          </Box>
          <Box>
            <strong>Date Created:</strong> {thisPatch.dateCreated ? moment(thisPatch.dateCreated).format('Do MMM YYYY') : 'unknown'}
          </Box>
          <Box>
            <strong>Parent ID:</strong> {thisPatch.parentPatchId}
          </Box>
          {thisPatch.link && (
            <Box>
              <strong>Link:</strong>{' '}
              <a href={thisPatch.link} target='_blank' rel='noopener noreferrer'>
                Click
              </a>
            </Box>
          )}
        </Grid>
        <Grid item md={6} sm={12}>
          <Typography className={classes.title} color='textSecondary' gutterBottom>
            Click to download files
          </Typography>

          {mp3s.map((mp3) => {
            if (!mp3) return null;
            const link = mp3.isBlob ? `${blobUrl}/mp3s/${mp3.name}` : `${nufFileLink}${mp3.attachId}`;
            return (
              <Box my={3} mx={1} key={mp3.id} className={classes.file}>
                <FullPlayer src={link} duration progress filename={mp3.name} id={mp3.id} context='patchViewer' />
              </Box>
            );
          })}

          <Box mt={2}>
            {files.map((x) => (
              <File file={x} key={x.id} />
            ))}
          </Box>

          {renderRating && state.user && (
            <Box className={classes.ratingBox}>
              <strong>How would you rate this sound? (click a star rating)</strong>
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
          )}
        </Grid>
        <Grid item md={12}>
          <Box>
            You can share this sound/page in NordUserForum by referencing the Sound ID <span>{patch.id}</span> in your forum post. Look for the new
            NordUserSounds feature on the right side of the message toolbar.
          </Box>
        </Grid>
      </Grid>
    );
  };

  if (!patch) return null;
  var hasVariations = (patch.parent && !patch.parent.removed) || patch.children.some((x) => !x.removed);

  return (
    <>
      {renderPatch(patch, true)}
      {hasVariations && (
        <Box mt={2}>
          <Typography variant='h6' className={classes.title} color='textSecondary' gutterBottom>
            Variations
          </Typography>
          {patch.parent && renderPatch(patch.parent, false)}
          {patch.children.length > 0 && patch.children.map((x) => renderPatch(x, false))}
        </Box>
      )}
    </>
  );
};

export default PatchViewer;
