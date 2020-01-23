import React, { useEffect, useState } from 'react';
import RestUtilities from '../../services/RestUtilities';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Chip from '@material-ui/core/Chip';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InlineError from '../common/InlineError';
import Paper from '@material-ui/core/Paper';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import { nufFileLink } from './Common';
import Box from '@material-ui/core/Box';
import FullPlayer from '../common/FullPlayer';
import { makeStyles } from '@material-ui/core/styles';
import { categoriesLu, instrumentsLu, blobUrl, renderOptions } from '../../Constants';
import UploadDropZone from './UploadDropZone';
import { Store } from '../../state/Store';

const useStyles = makeStyles(theme => ({
  grow: {
    flexGrow: 1
  },
  title: {
    fontSize: '20px',
    marginTop: theme.spacing(1)
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
  },
  trash: { textAlign: 'right' }
}));

function useForceUpdate() {
  // eslint-disable-next-line no-unused-vars
  const [value, setValue] = useState(0); // integer state
  return () => setValue(value => ++value); // update the state to force render
}

const PatchViewer = props => {
  const { state, dispatch } = React.useContext(Store);
  const classes = useStyles();
  const [patch, setPatch] = useState(null);
  const [name, setName] = useState('');
  const [link, setLink] = useState('');
  const [description, setDescription] = useState('');
  const [instrumentId, setInstrumentId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [tags, setTags] = useState(null);
  const [tagOptions, setTagOptions] = useState([]);
  const [removed, setRemoved] = useState(false);
  const [parentPatchId, setParentPatchId] = useState('');
  const [showSpinner, setShowSpinner] = useState(false);
  const [disableUpdate, setDisableUpdate] = useState(false);
  const [acceptedFiles] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [errors, setErrors] = useState(null);
  const isNameInvalid = name.length < 1 || name.length > 255;
  const isDescriptionInvalid = description.length > 1000;
  const isLinkInvalid = link.length > 1000;

  const forceUpdate = useForceUpdate();

  const getExtension = file => {
    const regex = /(?:\.([^.]+))?$/;
    const type = file.type;
    const actualExtension = regex.exec(file.name)[1];
    return type.startsWith('audio') ? 'mp3' : actualExtension;
  };

  const onAccept = files => {
    files.forEach(x => {
      acceptedFiles.push(x);
    });
    forceUpdate();
  };

  const uploadFiles = async () => {
    const url = `/api/File/${props.patchId}`;
    acceptedFiles.forEach((file, i) => {
      const formData = new FormData();
      formData.append('File', file);
      formData.append('PatchId', props.patchId);
      formData.append('AppUserId', state.user.id);
      formData.append('NufUserId', state.user.nufUserId);
      formData.append('Extension', getExtension(file));
      RestUtilities.postFormData(url, formData).then(response => {
        if (response.ok) {
          response.json().then(file => {
            patch.patchFiles.push({
              file,
              patchId: props.patchId,
              fileId: file.id
            });
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

  const toggleRemoveFile = file => {
    file.removed = !file.removed;
    forceUpdate();
    putFile(file);
  };

  const putFile = async file => {
    const url = `/api/file/${file.id}`;
    await RestUtilities.put(url, file);
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
    if (tagOptions.length === 0) {
      const tagUrl = '/api/tag';
      RestUtilities.get(tagUrl).then(resTags => {
        resTags.json().then(t => {
          setTagOptions(t);
        });
      });
    }
  }, [tagOptions]);

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

  const renderFile = file => {
    return (
      <Paper className={classes.fileContainer} key={file.id} elevation={1}>
        <a href={`${nufFileLink}${file.attachId}`} className={classes.file}>
          <Box m={1}>
            <Box>
              <strong>Name:</strong> {file.name}
            </Box>
            <Box>
              <strong>File ID:</strong> {file.id}
            </Box>
            <Box>
              <strong>Size (bytes):</strong> {file.size}
            </Box>
          </Box>
        </a>
        <Box display='flex' justifyContent='flex-end'>
          <FormControlLabel
            value='end'
            control={
              <Switch
                color='primary'
                checked={file.removed}
                onChange={() => {
                  toggleRemoveFile(file);
                }}
                size='small'
              />
            }
            label='Hide this file'
            labelPlacement='end'
            size='small'
          />
        </Box>
      </Paper>
    );
  };

  return (
    <form noValidate autoComplete='off'>
      <Grid container spacing={2} direction='row'>
        <Grid container item lg={8} md={12} spacing={2} alignItems='flex-start' alignContent='flex-start'>
          <Grid container item md={6} spacing={2} direction='row' alignItems='flex-start' alignContent='flex-start'>
            <Grid item xs={12}>
              <Typography className={classes.title} color='textSecondary' gutterBottom>
                Details
              </Typography>
            </Grid>
            <Grid item xs={12}>
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
            <Grid item xs={12}>
              <TextField
                minLength={0}
                maxLength={1000}
                value={link}
                fullWidth
                id='link'
                label='Web Link'
                name='link'
                placeholder='https://www.'
                onChange={event => setLink(event.target.value)}
                error={isLinkInvalid && !!link}
                helperText={isLinkInvalid && !!link && 'Must be less than 1000 characters'}
              />
            </Grid>
            <Grid item xs={12}>
              <InputLabel id='instrumentLabel' className={classes.label}>
                Type
              </InputLabel>
              <Select fullWidth id='instrumentId' value={instrumentId} onChange={event => setInstrumentId(event.target.value)}>
                {renderOptions(instrumentsLu)}
              </Select>
            </Grid>
            <Grid item xs={12}>
              <InputLabel id='categoryLabel' className={classes.label}>
                Category
              </InputLabel>
              <Select fullWidth id='categoryId' value={categoryId ? categoryId : ''} onChange={event => setCategoryId(event.target.value)}>
                {renderOptions(categoriesLu)}
              </Select>
            </Grid>
            <Grid item xs={12}>
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
            {tags ? (
              <Grid item xs={12}>
                <InputLabel id='categoryLabel' className={classes.label}>
                  Tags
                </InputLabel>
                <Autocomplete
                  multiple
                  id='tags-standard'
                  size='medium'
                  value={tags}
                  freeSolo
                  options={tagOptions.map(option => option.name)}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => <Chip variant='default' size='small' label={option} color='secondary' {...getTagProps({ index })} />)
                  }
                  renderInput={params => <TextField {...params} placeholder='Start typing tag select from list or press enter' fullWidth />}
                  onChange={(_event, value) => {
                    setTags(value);
                  }}
                />
              </Grid>
            ) : null}
            <Grid item xs={12}>
              <TextField
                value={parentPatchId}
                fullWidth
                type='number'
                id='parentPatchId'
                label='Parent Sound ID'
                name='parentPatchId'
                onChange={event => setParentPatchId(event.target.value)}
              />
            </Grid>
          </Grid>
          <Grid container item md={6} spacing={2} direction='row' alignItems='flex-start' alignContent='flex-start'>
            <Grid item xs={12}>
              <Typography className={classes.title} color='textSecondary'>
                Add new files
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Box>
                <UploadDropZone patchId={patch.id} onAccept={onAccept} showSpinner={showSpinner} filesAdded={acceptedFiles} />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box display='flex' justifyContent='flex-end'>
                <FormControlLabel
                  value='end'
                  control={<Switch color='primary' checked={removed} onChange={() => setRemoved(!removed)} />}
                  label='Hide this sound'
                  labelPlacement='end'
                />
                <Button size='small' color='primary' variant='contained' onClick={handleUpdateClick} disabled={disableUpdate}>
                  Update Details and add files
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Typography component='p'>{feedback}</Typography>
              <InlineError field='name' errors={errors} />
              <InlineError field='description' errors={errors} />
              <InlineError field='categoryId' errors={errors} />
            </Grid>
          </Grid>
        </Grid>
        <Grid container item lg={4} md={12} spacing={2} alignItems='flex-start' alignContent='flex-start'>
          <Grid item xs={12}>
            <Typography className={classes.title} color='textSecondary'>
              Existing Files
            </Typography>
          </Grid>
          <Grid item lg={12} md={6} sm={12}>
            {files.map(x => renderFile(x))}
          </Grid>
          <Grid item lg={12} md={6} sm={12}>
            {mp3s.map(mp3 => {
              if (!mp3) return null;
              const link = mp3.isBlob ? `${blobUrl}/mp3s/${mp3.name}` : `${nufFileLink}${mp3.attachId}`;
              return (
                <Paper className={classes.fileContainer} key={mp3.id} elevation={1}>
                  <Box m={2}>
                    <FullPlayer src={link} filename={mp3.name} key={mp3.id} duration progress id={mp3.id} context='patchEditor' />
                  </Box>
                  <Box mt={3} display='flex' justifyContent='flex-end'>
                    <FormControlLabel
                      value='end'
                      control={
                        <Switch
                          color='primary'
                          checked={mp3.removed}
                          onChange={() => {
                            toggleRemoveFile(mp3);
                          }}
                          size='small'
                        />
                      }
                      label='Hide this file'
                      labelPlacement='end'
                      size='small'
                    />
                  </Box>
                </Paper>
              );
            })}
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
};

export default PatchViewer;
