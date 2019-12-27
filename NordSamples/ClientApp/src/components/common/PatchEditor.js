import React, { useEffect, useState } from 'react';
import RestUtilities from '../../services/RestUtilities';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Chip from '@material-ui/core/Chip';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InlineError from '../common/InlineError';
import Paper from '@material-ui/core/Paper';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import { nufFileLink } from './Common';
import Box from '@material-ui/core/Box';
import FullPlayer from '../common/FullPlayer';
import { makeStyles } from '@material-ui/core/styles';
import { dispatch, useGlobalState } from '../../State';
import { categories, instruments, blobUrl } from '../../Constants';
import UploadDropZone from './UploadDropZone';

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(1)
  },
  title: {
    fontSize: '16px'
  },
  label: { fontSize: '12px' },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
  fileContainer: {
    padding: theme.spacing(1),
    marginBottom: theme.spacing(2)
  },
  file: {
    color: 'inherit',
    textDecoration: 'none'
  }
}));

const PatchViewer = props => {
  const classes = useStyles();
  const [user] = useGlobalState('user');
  const [patch, setPatch] = useState(null);
  const [name, setName] = useState('');
  const [link, setLink] = useState('');
  const [description, setDescription] = useState('');
  const [instrumentId, setInstrumentId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [tags, setTags] = useState(null);
  const [removed, setRemoved] = useState(false);
  const [parentPatchId, setParentPatchId] = useState('');
  const [showSpinner, setShowSpinner] = useState(false);
  const [disableUpdate, setDisableUpdate] = useState(false);
  const [acceptedFiles, setAcceptedFiles] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [errors, setErrors] = useState(null);
  const isNameInvalid = name.length < 1 || name.length > 255;
  const isDescriptionInvalid = description.length > 1000;
  const isLinkInvalid = link.length > 1000;

  const getExtension = file => {
    const regex = /(?:\.([^.]+))?$/;
    const type = file.type;
    const actualExtension = regex.exec(file.name)[1];
    return type.startsWith('audio') ? 'mp3' : actualExtension;
  };

  const onAccept = files => {
    setAcceptedFiles(files);
  };

  const uploadFiles = async () => {
    const url = `/api/File/${props.patchId}`;
    acceptedFiles.forEach((file, i) => {
      const formData = new FormData();
      formData.append('File', file);
      formData.append('PatchId', props.patchId);
      formData.append('AppUserId', user.id);
      formData.append('NufUserId', user.nufUserId);
      formData.append('Extension', getExtension(file));
      RestUtilities.postFormData(url, formData).then(response => {
        if (response.ok) {
          response.json().then(file => {
            patch.patchFiles.push({ file, patchId: props.patchId, fileId: file.id });
            if (i === acceptedFiles.length - 1) {
              handleUpdate(patch);
              setShowSpinner(false);
            }
          });
        } else if (response.status === 400) {
          response.json().then(res => {
            setErrors(res.errors ? res.errors : res);
            setFeedback('There were errors:');
            setDisableUpdate(false);
            setShowSpinner(false);
          });
        } else {
          setFeedback('There was a server error, please try again.');
          setDisableUpdate(false);
          setShowSpinner(false);
        }
      });
    });
  };

  const handleUpdateClick = () => {
    setDisableUpdate(true);
    if (acceptedFiles.length > 0) {
      setShowSpinner(true);
      uploadFiles();
    } else {
      handleUpdate(patch);
    }
  };

  const handleUpdate = async updatedPatch => {
    const patchTags = tags.map(x => {
      return { patchId: props.patchId, name: x };
    });
    updatedPatch.name = name;
    updatedPatch.link = link;
    updatedPatch.description = description;
    updatedPatch.instrumentId = instrumentId;
    updatedPatch.categoryId = categoryId ? categoryId : '';
    updatedPatch.parentPatchId = parentPatchId;
    updatedPatch.tags = patchTags;
    updatedPatch.removed = removed;
    const url = `/api/patch/${props.patchId}`;
    var response = await RestUtilities.put(url, updatedPatch);
    if (response.ok) {
      dispatch({
        type: 'updatePatch',
        patch: updatedPatch
      });
      props.onClose();
    } else if (response.status === 400) {
      response.json().then(res => {
        setErrors(res.errors ? res.errors : res);
        setFeedback('There were errors:');
        setDisableUpdate(false);
        setShowSpinner(false);
      });
    } else {
      setFeedback('There was a server error, please try again.');
      setDisableUpdate(false);
      setShowSpinner(false);
    }
  };

  useEffect(() => {
    const getData = async () => {
      const url = `/api/patch/${props.patchId}`;
      const res = await RestUtilities.get(url);
      res.json().then(patch => {
        setPatch(patch);
        setName(patch.name);
        setDescription(patch.description);
        setLink(patch.link);
        setInstrumentId(patch.instrumentId);
        setCategoryId(patch.categoryId);
        setParentPatchId(patch.parentPatchId || '');
        setTags(patch.tags.map(x => x.name));
        setRemoved(patch.removed);
      });
    };
    getData();
  }, [props]);

  if (!patch) return null;
  const mp3s = patch.patchFiles.filter(x => x.file.extension === 'mp3').map(x => x.file);
  const files = patch.patchFiles.filter(x => x.file.extension !== 'mp3').map(x => x.file);

  const renderOptions = (entity, includeNone) => {
    const options = [];
    if (includeNone) {
      options.push(
        <MenuItem value='0'>
          <em>None</em>
        </MenuItem>
      );
    }
    Object.entries(entity).map(([key, value]) =>
      options.push(
        <MenuItem key={key} value={key}>
          {value}
        </MenuItem>
      )
    );
    return options;
  };
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

  return (
    <>
      <DialogContent dividers>
        <Card className={classes.mainCard}>
          <CardContent>
            <form className={classes.root} noValidate autoComplete='off'>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography className={classes.title} color='textSecondary' gutterBottom>
                    Edit Patch ID: {patch.id}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    <Grid item sm={6} xs={12}>
                      <TextField
                        autoFocus
                        maxLength={255}
                        value={name}
                        required
                        fullWidth
                        id='name'
                        label='Name'
                        name='name'
                        onChange={event => setName(event.target.value)}
                        error={isNameInvalid && !!name}
                        helperText={isNameInvalid && !!name && 'Must be less than 255 characters'}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item sm={6} xs={12}>
                  <TextField
                    minLength={0}
                    maxLength={1000}
                    value={link}
                    fullWidth
                    id='link'
                    label='Link'
                    name='link'
                    onChange={event => setLink(event.target.value)}
                    error={isLinkInvalid && !!link}
                    helperText={isLinkInvalid && !!link && 'Must be less than 1000 characters'}
                  />
                </Grid>
                <Grid item sm={6} xs={12}>
                  <TextField
                    multiline
                    rowsMax='2'
                    minLength={0}
                    maxLength={1000}
                    value={description}
                    fullWidth
                    id='description'
                    label='Description'
                    name='description'
                    onChange={event => setDescription(event.target.value)}
                    error={isDescriptionInvalid && !!description}
                    helperText={isDescriptionInvalid && !!description && 'Must be less than 1000 characters'}
                  />
                </Grid>
                <Grid item sm={6} xs={12}>
                  <InputLabel id='instrumentLabel' className={classes.label}>
                    Type
                  </InputLabel>
                  <Select fullWidth id='instrumentId' value={instrumentId} onChange={event => setInstrumentId(event.target.value)}>
                    {renderOptions(instruments)}
                  </Select>
                </Grid>
                <Grid item sm={6} xs={12}>
                  <InputLabel id='categoryLabel' className={classes.label}>
                    Category
                  </InputLabel>
                  <Select fullWidth id='categoryId' value={categoryId ? categoryId : ''} onChange={event => setCategoryId(event.target.value)}>
                    {renderOptions(categories)}
                  </Select>
                </Grid>
                {tags ? (
                  <Grid item xs={12}>
                    <InputLabel id='categoryLabel' className={classes.label}>
                      Tags
                    </InputLabel>
                    <Autocomplete
                      autoHighlight={false}
                      autoComplete={true}
                      multiple
                      id='tags-standard'
                      size='medium'
                      value={tags}
                      freeSolo
                      renderTags={(value, getTagProps) => value.map((option, index) => <Chip variant='outlined' label={option} {...getTagProps({ index })} />)}
                      renderInput={params => <TextField {...params} placeholder='Type tag and press return' fullWidth />}
                      onChange={(_event, value) => {
                        setTags(value);
                      }}
                    />
                  </Grid>
                ) : null}
                <Grid item sm={6} xs={12}>
                  <TextField
                    value={parentPatchId}
                    fullWidth
                    type='number'
                    id='parentPatchId'
                    label='Parent PatchID'
                    name='parentPatchId'
                    onChange={event => setParentPatchId(event.target.value)}
                  />
                </Grid>
                <Grid item sm={6} xs={12}>
                  <FormControlLabel
                    value='end'
                    control={<Switch color='primary' checked={removed} onChange={() => setRemoved(!removed)} />}
                    label='Remove'
                    labelPlacement='end'
                  />
                </Grid>
              </Grid>
            </form>
          </CardContent>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item sm={6} xs={12}>
                <Typography className={classes.title} color='textSecondary'>
                  Existing Files
                </Typography>
                {mp3s.map(mp3 => {
                  if (!mp3) return null;
                  const link = mp3.isBlob ? `${blobUrl}/mp3s/${mp3.name}` : `${nufFileLink}${mp3.attachId}`;
                  return (
                    <Box m={3} key={mp3.id}>
                      <FullPlayer src={link} filename={mp3.name} key={mp3.id} duration progress />
                    </Box>
                  );
                })}
                <Box mt={2}>{files.map(x => renderFile(x))}</Box>
              </Grid>
              <Grid item sm={6} xs={12}>
                <Typography className={classes.title} color='textSecondary'>
                  Add Files
                </Typography>
                <Box my={2}>
                  <UploadDropZone patchId={patch.id} onAccept={onAccept} showSpinner={showSpinner} />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Typography component='p'>{feedback}</Typography>
                <InlineError field='name' errors={errors} />
                <InlineError field='description' errors={errors} />
                <InlineError field='categoryId' errors={errors} />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </DialogContent>

      <DialogActions>
        <Button size='small' color='primary' variant='contained' onClick={handleUpdateClick} disabled={disableUpdate}>
          Update
        </Button>
        <Button size='small' onClick={props.onClose} color='secondary' variant='contained'>
          Close
        </Button>
      </DialogActions>
    </>
  );
};

export default PatchViewer;
