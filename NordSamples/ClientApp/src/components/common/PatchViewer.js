import React, { useEffect } from 'react';
import RestUtilities from '../../services/RestUtilities';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
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
  const [patch, setPatch] = React.useState(null);

  async function getData() {
    const url = `/api/patch/${props.patchId}`;
    const res = await RestUtilities.get(url);
    res.json().then(patch => {
      setPatch(patch);
    });
  }
  useEffect(() => {
    getData();
  }, []);

  function renderFile(file) {
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
  }

  function renderPatch(patch) {
    const mp3s = patch.patchFiles.filter(x => x.file.extension === 'mp3').map(x => x.file);
    const files = patch.patchFiles.filter(x => x.file.extension !== 'mp3').map(x => x.file);
    return (
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography className={classes.title} color='textSecondary' gutterBottom>
            {patch.name}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Box m={2}>
            {mp3s.map(mp3 => {
              if (!mp3) return null;
              return <FullPlayer src={`${nufFileLink}${mp3.attachId}`} key={mp3.id} duration progress />;
            })}
          </Box>
        </Grid>
        <Grid item xs={6}>
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
            <strong>Category:</strong> {patch.category ? patch.category.name : ''}
          </Box>
          <Box>
            <strong>Description:</strong> {patch.description || 'tbc'}
          </Box>
          <Box>
            <strong>Instrument Type:</strong> {patch.instrument && patch.instrument.name}
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
          <Box>{files.map(x => renderFile(x))}</Box>
        </Grid>
      </Grid>
    );
  }

  if (!patch) return null;
  return (
    <Card className={classes.mainCard}>
      <CardContent>{renderPatch(patch)}</CardContent>
      <CardContent>
        <Typography variant='h6' className={classes.title} color='textSecondary' gutterBottom>
          Variations
        </Typography>
        {patch.parent && renderPatch(patch.parent)}
        {patch.children.map(x => renderPatch(x))}
      </CardContent>
    </Card>
  );
};

export default PatchViewer;
