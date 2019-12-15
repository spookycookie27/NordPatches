import React, { useEffect } from 'react';
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

const PatchViewer = props => {
  const classes = useStyles();
  const [patch, setPatch] = React.useState(null);
  const [name, setName] = React.useState('');
  const [link, setLink] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [instrumentId, setInstrumentId] = React.useState('');
  const [categoryId, setCategoryId] = React.useState('');
  const [parentPatchId, setParentPatchId] = React.useState('');
  const [tags, setTags] = React.useState(null);
  const isNameInvalid = name.length < 5 || name.length > 255;
  const isDescriptionInvalid = description.length > 1000;
  const isLinkInvalid = link.length > 1000;

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
      setParentPatchId(patch.parentPatchId);
      setTags(patch.tags.map(x => x.name));
    });
  };

  const handleUpdate = async () => {
    const patchTags = tags.map(x => {
      return { patchId: props.patchId, name: x };
    });
    const updatedPatch = patch;
    updatedPatch.name = name;
    updatedPatch.link = link;
    updatedPatch.description = description;
    updatedPatch.instrumentId = instrumentId;
    updatedPatch.categoryId = categoryId;
    updatedPatch.parentPatchId = parentPatchId;
    updatedPatch.tags = patchTags;
    const url = `/api/patch/${props.patchId}`;
    await RestUtilities.put(url, updatedPatch);
    dispatch({
      type: 'updatePatch',
      patch: updatedPatch
    });
    props.onClose();
  };

  useEffect(() => {
    getData();
  }, []);

  if (!patch) return null;
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
                  </Grid>
                </Grid>
                <Grid item xs={6}>
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
                  <InputLabel id='instrumentLabel' className={classes.label}>
                    Type
                  </InputLabel>
                  <Select fullWidth id='instrumentId' value={instrumentId} onChange={event => setInstrumentId(event.target.value)}>
                    <MenuItem value={1}>User Sample</MenuItem>
                    <MenuItem value={2}>Lead</MenuItem>
                    <MenuItem value={3}>Electro</MenuItem>
                    <MenuItem value={4}>Stage 1</MenuItem>
                    <MenuItem value={5}>Stage 2</MenuItem>
                    <MenuItem value={6}>Stage 3</MenuItem>
                  </Select>
                </Grid>
                <Grid item xs={6}>
                  <InputLabel id='categoryLabel' className={classes.label}>
                    Category
                  </InputLabel>
                  <Select fullWidth id='instrumentId' value={categoryId} onChange={event => setCategoryId(event.target.value)}>
                    <MenuItem value={23}>Acoustic</MenuItem>
                    <MenuItem value={22}>Arpeggio</MenuItem>
                    <MenuItem value={6}>Bass</MenuItem>
                    <MenuItem value={4}>Brass</MenuItem>
                    <MenuItem value={21}>Clavinet</MenuItem>
                    <MenuItem value={8}>Drums</MenuItem>
                    <MenuItem value={10}>Effects</MenuItem>
                    <MenuItem value={11}>Electronic</MenuItem>
                    <MenuItem value={20}>EPiano</MenuItem>
                    <MenuItem value={12}>Ethnic</MenuItem>
                    <MenuItem value={19}>Fantasy</MenuItem>
                    <MenuItem value={18}>Grand</MenuItem>
                    <MenuItem value={7}>Guitar</MenuItem>
                    <MenuItem value={2}>Lead</MenuItem>
                    <MenuItem value={24}>Nature</MenuItem>
                    <MenuItem value={13}>Organ</MenuItem>
                    <MenuItem value={5}>Pads</MenuItem>
                    <MenuItem value={9}>Percussion</MenuItem>
                    <MenuItem value={17}>Pluck</MenuItem>
                    <MenuItem value={3}>Strings</MenuItem>
                    <MenuItem value={1}>Synth</MenuItem>
                    <MenuItem value={16}>Upright</MenuItem>
                    <MenuItem value={15}>Vocal</MenuItem>
                    <MenuItem value={14}>Wind</MenuItem>
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
                      onChange={(event, value) => {
                        setTags(value);
                      }}
                    />
                  </Grid>
                ) : null}
              </Grid>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
      <DialogActions>
        <Button size='small' color='primary' variant='contained' onClick={handleUpdate}>
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
