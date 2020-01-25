import React from 'react';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { makeStyles } from '@material-ui/core/styles';
import InsertDriveFileRoundedIcon from '@material-ui/icons/InsertDriveFileRounded';
import { blobUrl, nufFileLink } from '../../Constants';

const useStyles = makeStyles(theme => ({
  fileContainer: {
    padding: theme.spacing(1),
    marginBottom: theme.spacing(2),
    backgroundColor: '#f9f9f9'
  },
  file: {
    color: 'inherit',
    textDecoration: 'none',
    display: 'flex'
  },
  icon: {
    margin: theme.spacing(1)
  }
}));

const File = props => {
  const classes = useStyles();
  const { file, toggleRemoveFile } = props;
  if ((file.removed || file.isNord) && !toggleRemoveFile) return null;
  const link = file.isBlob ? `${blobUrl}/mp3s/${file.name}` : `${nufFileLink}${file.attachId}`;
  return (
    <Paper className={classes.fileContainer} key={file.id}>
      <a href={link} className={classes.file}>
        <Box xs={2} sm={1} lg={2} className={classes.icon}>
          <InsertDriveFileRoundedIcon fontSize='large' />
        </Box>
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
      {props.toggleRemoveFile && (
        <Box display='flex' justifyContent='flex-end'>
          <FormControlLabel
            value='end'
            control={<Switch color='primary' checked={file.removed} onChange={() => toggleRemoveFile(file)} size='small' />}
            label='Hide this file'
            labelPlacement='end'
            size='small'
          />
        </Box>
      )}
    </Paper>
  );
};

export default File;
