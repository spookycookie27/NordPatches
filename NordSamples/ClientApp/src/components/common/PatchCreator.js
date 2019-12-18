import React from 'react';
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
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { dispatch } from '../../State';
import { categories, instruments } from '../../Constants';
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
  }
}));

const PatchCreator = props => {
  const classes = useStyles();
  const [name, setName] = React.useState('');
  const [link, setLink] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [instrumentId, setInstrumentId] = React.useState('');
  const [categoryId, setCategoryId] = React.useState('');
  const [tags, setTags] = React.useState('');
  const [patchFiles, setPatchFiles] = React.useState([]);
  const [files, setFiles] = React.useState([]);
  const [parentPatchId, setParentPatchId] = React.useState('');
  const isNameInvalid = name.length < 5 || name.length > 255;
  const isDescriptionInvalid = description.length > 1000;
  // const isLinkInvalid = link.length > 1000;

  const handleInsert = async () => {
    const newPatch = {
      name,
      link,
      description,
      instrumentId,
      categoryId,
      parentPatchId,
      tags
    };
    const url = `/api/patch/`;
    await RestUtilities.post(url, newPatch);
    dispatch({
      type: 'insertPatch',
      patch: newPatch
    });
    // next handle files upload
    props.onClose();
  };

  const renderOptions = entity => {
    return Object.entries(entity).map(([key, value]) => (
      <MenuItem key={key} value={key}>
        {value}
      </MenuItem>
    ));
  };

  const onUploadFiles = files => {
    setFiles(files);
    var pf = [];
    files.forEach(file => {
      pf.push({ file, fileId: file.id });
    });
    setPatchFiles(pf);
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
                    Create Patch
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    autoFocus
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
                    helperText={isNameInvalid && !!name && 'Must be less than 255 characters'}
                  />
                </Grid>
                <Grid item xs={6}>
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
                <Grid item xs={6}>
                  <InputLabel id='typeLabel' className={classes.label}>
                    Type
                  </InputLabel>
                  <Select fullWidth id='instrumentId' value={instrumentId ? instrumentId : 1} onChange={event => setInstrumentId(event.target.value)} required>
                    {renderOptions(instruments)}
                  </Select>
                </Grid>
                <Grid item xs={6}>
                  <InputLabel id='categoryLabel' className={classes.label}>
                    Category
                  </InputLabel>
                  <Select fullWidth id='instrumentId' value={categoryId ? categoryId : 0} onChange={event => setCategoryId(event.target.value)}>
                    {renderOptions(categories)}
                  </Select>
                </Grid>
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
                <Grid item xs={6}>
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
                <Grid item xs={6}>
                  <TextField
                    minLength={0}
                    maxLength={1000}
                    value={link}
                    fullWidth
                    id='link'
                    label='Web Link'
                    name='link'
                    onChange={event => setLink(event.target.value)}
                  />
                </Grid>
              </Grid>
            </form>
          </CardContent>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography className={classes.title} color='textSecondary' gutterBottom>
                  Add Nord Files and Mp3s
                </Typography>
                <UploadDropZone onAccept={onUploadFiles} auto />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </DialogContent>

      <DialogActions>
        <Button size='small' color='primary' variant='contained' onClick={handleInsert}>
          Create
        </Button>
        <Button size='small' onClick={props.onClose} color='secondary' variant='contained'>
          Close
        </Button>
      </DialogActions>
    </>
  );
};

export default PatchCreator;
