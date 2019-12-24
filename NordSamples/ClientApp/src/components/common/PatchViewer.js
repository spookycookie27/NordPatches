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
import { categories, instruments, blobUrl } from '../../Constants';
import Button from '@material-ui/core/Button';
import { nufFileLink } from './Common';
import FullPlayer from '../common/FullPlayer';
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
  }
}));

const PatchViewer = props => {
  const classes = useStyles();
  const [patch, setPatch] = useState(null);

  useEffect(() => {
    const getData = async () => {
      const url = `/api/patch/${props.patchId}`;
      const res = await RestUtilities.get(url);
      res.json().then(patch => {
        setPatch(patch);
      });
    };
    getData();
  }, [props]);

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

  function renderPatch(patch) {
    const mp3s = patch.patchFiles.filter(x => x.file.extension === 'mp3').map(x => x.file);
    const files = patch.patchFiles.filter(x => x.file.extension !== 'mp3').map(x => x.file);
    return (
      <Card className={classes.mainCard} key={patch.id}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography className={classes.title} color='textSecondary' gutterBottom>
                {patch.name}
              </Typography>
              <Box>
                <strong>User:</strong> {patch.user && patch.user.username}
              </Box>
              <Box>
                <strong>Patch ID:</strong> {patch.id}
              </Box>
              <Box>
                <strong>Date Created:</strong> {patch.dateCreated ? moment(patch.dateCreated).format('Do MMM YYYY') : 'unknown'}
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
                <strong>Parent ID:</strong> {patch.parentPatchId}
              </Box>
              <Box>
                <strong>Link:</strong>{' '}
                <a href={patch.link} target='_blank' rel='noopener noreferrer'>
                  Click
                </a>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Typography className={classes.title} color='textSecondary' gutterBottom>
                Files
              </Typography>
              <Box m={3}>
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
  }

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
