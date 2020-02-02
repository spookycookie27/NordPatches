import React, { useState, useEffect } from 'react';
import RestUtilities from '../../services/RestUtilities';
import { withRouter } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Chip from '@material-ui/core/Chip';
import Autocomplete from '@material-ui/lab/Autocomplete';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import InlineError from '../common/InlineError';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles';
import { categoriesLu, instrumentsLu, renderOptions } from '../../Constants';
import UploadDropZone from './UploadDropZone';
import { CardActions } from '@material-ui/core';
import { Store } from '../../state/Store';

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(1)
  },
  title: {
    fontSize: '16px'
  },
  tagLabel: { fontSize: '12px' },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

const getExtension = file => {
  const regex = /(?:\.([^.]+))?$/;
  const type = file.type;
  const actualExtension = regex.exec(file.name)[1];
  return type.startsWith('audio') ? 'mp3' : actualExtension;
};

function useForceUpdate() {
  // eslint-disable-next-line no-unused-vars
  const [value, setValue] = useState(0); // integer state
  return () => setValue(value => ++value); // update the state to force render
}

const PatchCreator = props => {
  const classes = useStyles();
  const { state, dispatch } = React.useContext(Store);
  const user = state.user;
  const [name, setName] = useState('');
  const [link, setLink] = useState('');
  const [description, setDescription] = useState('');
  const [instrumentId, setInstrumentId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [tags, setTags] = useState([]);
  const [tagOptions, setTagOptions] = useState([]);
  const [files] = useState([]);
  const [parentPatchId, setParentPatchId] = useState('');
  const [showSpinner, setShowSpinner] = useState(false);
  const [disable, setDisable] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [errors, setErrors] = useState(null);

  const isNameInvalid = name.length < 4 || name.length > 255;
  const isDescriptionInvalid = description.length > 1000;
  const isLinkInvalid = link.length > 1000;
  const isCategoryInvalid = categoryId < 1;
  const isInstrumentInvalid = instrumentId < 1;
  const isFormInvalid = isNameInvalid || isDescriptionInvalid || isLinkInvalid || isCategoryInvalid || isInstrumentInvalid;

  const forceUpdate = useForceUpdate();

  const handleInsert = async () => {
    if (isFormInvalid) {
      setShowSpinner(false);
      setFeedback('Fields marked with * are mandatory. There may be some errors in red.');
      return;
    }
    setErrors(null);
    setShowSpinner(true);
    setDisable(true);
    const patchTags = tags.map(x => {
      return { name: x };
    });
    const newPatch = {
      name,
      link,
      description,
      instrumentId,
      categoryId,
      parentPatchId,
      tags: patchTags,
      user
    };
    const url = `/api/patch/`;
    const response = await RestUtilities.post(url, newPatch);
    if (response.ok) {
      const insertedPatch = await response.json();
      if (files.length > 0) {
        const url = `/api/File/${insertedPatch.id}`;
        files.forEach(async (file, i) => {
          const formData = new FormData();
          formData.append('File', file);
          formData.append('PatchId', insertedPatch.id);
          formData.append('AppUserId', user.id);
          formData.append('NufUserId', user.nufUserId);
          formData.append('Extension', getExtension(file));
          var response = await RestUtilities.postFormData(url, formData);
          if (response.ok) {
            response.json().then(file => {
              insertedPatch.patchFiles.push({
                file,
                patchId: insertedPatch.id,
                fileId: file.id
              });
              if (i === files.length - 1) {
                const url = `/api/patch/${insertedPatch.id}`;
                RestUtilities.put(url, insertedPatch);
                dispatch({
                  type: 'insertPatch',
                  patch: insertedPatch
                });
                setShowSpinner(false);
                setFeedback('Your sound was added successfully');
                setErrors(null);
                props.history.push('/sounds');
              }
            });
          }
        });
      } else {
        setShowSpinner(false);
        setFeedback('Your sound was added successfully');
        setErrors(null);
        props.history.push('/sounds');
      }
    } else if (response.status === 400) {
      response.json().then(res => {
        setErrors(res.errors ? res.errors : res);
        setFeedback('There were errors:');
        setDisable(false);
        setShowSpinner(false);
      });
    } else {
      setFeedback('There was a server error, please try again.');
      setDisable(false);
      setShowSpinner(false);
    }
  };

  const onUploadFiles = acceptedFiles => {
    acceptedFiles.forEach(x => {
      files.push(x);
    });
    forceUpdate();
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

  return (
    <Card className={classes.mainCard}>
      <CardContent>
        <form className={classes.root} noValidate autoComplete='off'>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography className={classes.title} color='textSecondary' gutterBottom>
                Create Sound
              </Typography>
            </Grid>
            <Grid item sm={6} xs={12}>
              <TextField
                minLength={5}
                maxLength={255}
                value={name}
                required
                fullWidth
                id='name'
                label='Name'
                name='name'
                onChange={event => setName(event.target.value)}
                error={isNameInvalid && !!name}
                helperText={isNameInvalid && !!name && 'Must be more than 5 and less than 255 characters'}
              />
            </Grid>
            <Grid item sm={6} xs={12}>
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
            <Grid item sm={6} xs={12}>
              <FormControl fullWidth error={instrumentId !== '' && isInstrumentInvalid} required>
                <InputLabel id='typeLabel'>Type</InputLabel>
                <Select fullWidth id='instrumentId' value={instrumentId} onChange={event => setInstrumentId(event.target.value)} required>
                  {renderOptions(instrumentsLu, false)}
                </Select>
                <FormHelperText>{instrumentId !== '' && isInstrumentInvalid ? 'Please choose the type of sound' : ''}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item sm={6} xs={12}>
              <FormControl error={categoryId !== '' && isCategoryInvalid} fullWidth required>
                <InputLabel id='categoryLabel'>Category</InputLabel>
                <Select fullWidth id='categoryId' value={categoryId} onChange={event => setCategoryId(event.target.value)} required>
                  {renderOptions(categoriesLu, false)}
                </Select>
                <FormHelperText>{categoryId !== '' && isCategoryInvalid ? 'Please choose a primary category' : ''}</FormHelperText>
              </FormControl>
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

            <Grid item xs={12}>
              <InputLabel id='categoryLabel' className={classes.tagLabel}>
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
            {user.role === 'administrator' && (
              <Grid item sm={6} xs={12}>
                <TextField
                  value={parentPatchId}
                  fullWidth
                  type='number'
                  id='parentPatchId'
                  label='Variation ?'
                  name='parentPatchId'
                  placeholder='Parent Sound ID'
                  onChange={event => setParentPatchId(event.target.value)}
                />
              </Grid>
            )}
          </Grid>
        </form>
      </CardContent>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography className={classes.title} color='textSecondary' gutterBottom>
              Add Nord Files and Mp3s
            </Typography>
            <UploadDropZone onAccept={onUploadFiles} auto showSpinner={showSpinner} filesAdded={files} />
          </Grid>
          <Grid item xs={12}>
            <Typography component='p'>{feedback}</Typography>
            <InlineError field='name' errors={errors} />
            <InlineError field='description' errors={errors} />
            <InlineError field='categoryId' errors={errors} />
          </Grid>
        </Grid>
      </CardContent>
      <CardActions>
        <Button color='secondary' variant='contained' onClick={handleInsert} disabled={disable} startIcon={<AddIcon />}>
          Create
        </Button>
      </CardActions>
    </Card>
  );
};

export default withRouter(PatchCreator);
