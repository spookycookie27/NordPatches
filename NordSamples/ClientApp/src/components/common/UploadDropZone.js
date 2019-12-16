import React from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import { useDropzone } from 'react-dropzone';
import { makeStyles } from '@material-ui/core/styles';
import RootRef from '@material-ui/core/RootRef';

const useStyles = makeStyles(theme => ({
  baseStyle: {
    flex: 1,
    minHeight: '100px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out'
  },
  spinner: {
    display: 'flex',
    '& > * + *': {
      marginLeft: theme.spacing(2)
    }
  }
}));

const UploadDropZone = props => {
  const { acceptedFiles, getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    accept: props.accept
  });
  const [disableButton, setDisableButton] = React.useState(false);
  const { ref, ...rootProps } = getRootProps();
  const classes = useStyles();

  const files = acceptedFiles.map(file => (
    <Box key={file.path}>
      {file.path} - {file.size} bytes
    </Box>
  ));

  const handleUpload = () => {
    setDisableButton(true);
    props.onAccept(acceptedFiles);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <RootRef rootRef={ref}>
          <Box justifyContent='center' className={classes.baseStyle} {...rootProps}>
            <input {...getInputProps()} />
            {isDragAccept && <p>This file is OK</p>}
            {isDragReject && <p>This file is not the correct type</p>}
            {acceptedFiles.length > 0 ? <>{files}</> : !isDragActive && <p>Drop some files here ...</p>}
          </Box>
        </RootRef>
        <Box my={0.5}>{props.showSpinner && <LinearProgress color='secondary' />}</Box>
      </Grid>
      {files[0] && (
        <Grid item xs={12}>
          <Button size='small' color='secondary' variant='contained' onClick={handleUpload} disabled={disableButton}>
            Use this file
          </Button>
        </Grid>
      )}
    </Grid>
  );
};

export default UploadDropZone;
