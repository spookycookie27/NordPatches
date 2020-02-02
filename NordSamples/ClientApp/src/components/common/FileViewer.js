import React, { useState } from 'react';
import RestUtilities from '../../services/RestUtilities';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import InsertDriveFileRoundedIcon from '@material-ui/icons/InsertDriveFileRounded';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import moment from 'moment';
import Box from '@material-ui/core/Box';
import { nufFileLink } from '../../Constants';
import { makeStyles } from '@material-ui/core/styles';
import { Store } from '../../state/Store';

const useStyles = makeStyles(theme => ({
  title: {
    fontSize: '18px'
  }
}));

const getFileMetaData = file => {
  return (
    <>
      <Box>
        <strong>File ID:</strong> {file.id}
      </Box>
      <Box>
        <strong>Attach ID:</strong> {file.attachId}
      </Box>
      <Box>
        <strong>Date Created:</strong> {file.dateCreated ? moment(file.dateCreated).format('Do MMM YYYY') : 'unknown'}
      </Box>
      <Box>
        <strong>Comment:</strong> {file.comment}
      </Box>
      <Box>
        <strong>User:</strong> {file.user ? file.user.username : ''}
      </Box>
      <Box>
        <strong>Extension:</strong> {file.extension}
      </Box>
      <Box>
        <strong>Size:</strong> {file.size}
      </Box>
      <Box>
        <strong>Link:</strong>{' '}
        <a href={file.link} target='_blank' rel='noopener noreferrer'>
          {file.link}
        </a>
      </Box>
      <Box>
        <strong>Download:</strong> <a href={`${nufFileLink}${file.attachId}`}>{file.name}</a>
      </Box>
    </>
  );
};

const FileViewer = props => {
  const { file } = props;
  const { dispatch } = React.useContext(Store);
  const classes = useStyles();
  const [patchId, setPatchId] = useState('');

  const addFile = async () => {
    const patchFile = { fileId: file.id, patchId: patchId };
    const url = '/api/patchfile/';
    const response = await RestUtilities.post(url, patchFile);
    if (response.ok) {
      response.json().then(updatedPatch => {
        dispatch({
          type: 'updatePatch',
          patch: updatedPatch
        });
      });
    }
  };

  const handleAssignClick = () => {
    addFile();
  };

  return (
    <Grid container spacing={3} justify='center'>
      <Grid item xs={5}>
        <Typography className={classes.title} color='textSecondary' gutterBottom>
          {file.name}
        </Typography>
        {getFileMetaData(file)}
      </Grid>
      <Grid item xs={7}>
        <Typography className={classes.title} color='textSecondary' gutterBottom>
          Assign File to Sound
        </Typography>
        <Typography color='textSecondary' gutterBottom>
          You can add this file to an existing Sound in the collection. You will need to know the Sound ID first!
        </Typography>
        <TextField
          value={patchId}
          type='number'
          id='parentPatchId'
          label='Sound ID'
          placeholder='Enter Sound ID'
          name='parentPatchId'
          onChange={event => setPatchId(event.target.value)}
          autoFocus
        />
        <Box mt={2}>
          <Button
            variant='contained'
            color='secondary'
            className={classes.button}
            startIcon={<InsertDriveFileRoundedIcon />}
            onClick={handleAssignClick}
            size='small'
            disabled={!patchId}
          >
            Assign to Sound
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
};

export default FileViewer;
