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
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

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
  const isNameInvalid = name.length < 5 || name.length > 255;
  const isDescriptionInvalid = description.length > 1000;
  const isLinkInvalid = link.length > 1000;

  async function getData() {
    const url = `/api/patch/${props.patchId}`;
    const res = await RestUtilities.get(url);
    res.json().then(patch => {
      setPatch(patch);
      setName(patch.name);
      setDescription(patch.description);
      setLink(patch.link);
      setInstrumentId(patch.instrumentId);
      setCategoryId(patch.categoryId);
    });
  }
  useEffect(() => {
    getData();
  }, []);

  if (!patch) return null;
  return (
    <>
      <Card className={classes.mainCard}>
        <CardContent>
          <form className={classes.root} noValidate autoComplete='off'>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography className={classes.title} color='textSecondary' gutterBottom>
                  Edit : {patch.name}
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
                <Select fullWidth labelId='instrumentLabel' id='instrumentId' value={instrumentId} onChange={event => setInstrumentId(event.target.value)}>
                  <MenuItem value={1}>Sample</MenuItem>
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
                <Select fullWidth labelId='categoryLabel' id='instrumentId' value={categoryId} onChange={event => setCategoryId(event.target.value)}>
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
              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  id='tags-standard'
                  size='medium'
                  options={top100Films.map(option => option.title)}
                  defaultValue={[top100Films[0].title]}
                  freeSolo
                  renderTags={(value, getTagProps) => value.map((option, index) => <Chip variant='outlined' label={option} {...getTagProps({ index })} />)}
                  renderInput={params => (
                    <TextField {...params} variant='standard' label='Tags (temp list of movies!)' placeholder='Type tag and press return' fullWidth />
                  )}
                />
              </Grid>
            </Grid>
          </form>
        </CardContent>
        <CardActions>
          <Button size='small' color='primary' variant='contained' onClick={() => console.log('clicked')}>
            Update
          </Button>
        </CardActions>
      </Card>
    </>
  );
};

const top100Films = [
  { title: 'The Shawshank Redemption', year: 1994 },
  { title: 'The Godfather', year: 1972 },
  { title: 'The Godfather: Part II', year: 1974 },
  { title: 'The Dark Knight', year: 2008 },
  { title: '12 Angry Men', year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: 'Pulp Fiction', year: 1994 },
  { title: 'The Lord of the Rings: The Return of the King', year: 2003 },
  { title: 'The Good, the Bad and the Ugly', year: 1966 },
  { title: 'Fight Club', year: 1999 },
  { title: 'The Lord of the Rings: The Fellowship of the Ring', year: 2001 },
  { title: 'Star Wars: Episode V - The Empire Strikes Back', year: 1980 },
  { title: 'Forrest Gump', year: 1994 },
  { title: 'Inception', year: 2010 },
  { title: 'The Lord of the Rings: The Two Towers', year: 2002 },
  { title: "One Flew Over the Cuckoo's Nest", year: 1975 },
  { title: 'Goodfellas', year: 1990 },
  { title: 'The Matrix', year: 1999 },
  { title: 'Seven Samurai', year: 1954 },
  { title: 'Star Wars: Episode IV - A New Hope', year: 1977 },
  { title: 'City of God', year: 2002 },
  { title: 'Se7en', year: 1995 },
  { title: 'The Silence of the Lambs', year: 1991 },
  { title: "It's a Wonderful Life", year: 1946 },
  { title: 'Life Is Beautiful', year: 1997 },
  { title: 'The Usual Suspects', year: 1995 },
  { title: 'Léon: The Professional', year: 1994 },
  { title: 'Spirited Away', year: 2001 },
  { title: 'Saving Private Ryan', year: 1998 },
  { title: 'Once Upon a Time in the West', year: 1968 },
  { title: 'American History X', year: 1998 },
  { title: 'Interstellar', year: 2014 },
  { title: 'Casablanca', year: 1942 },
  { title: 'City Lights', year: 1931 },
  { title: 'Psycho', year: 1960 },
  { title: 'The Green Mile', year: 1999 },
  { title: 'The Intouchables', year: 2011 },
  { title: 'Modern Times', year: 1936 },
  { title: 'Raiders of the Lost Ark', year: 1981 },
  { title: 'Rear Window', year: 1954 },
  { title: 'The Pianist', year: 2002 },
  { title: 'The Departed', year: 2006 },
  { title: 'Terminator 2: Judgment Day', year: 1991 },
  { title: 'Back to the Future', year: 1985 },
  { title: 'Whiplash', year: 2014 },
  { title: 'Gladiator', year: 2000 },
  { title: 'Memento', year: 2000 },
  { title: 'The Prestige', year: 2006 },
  { title: 'The Lion King', year: 1994 },
  { title: 'Apocalypse Now', year: 1979 },
  { title: 'Alien', year: 1979 },
  { title: 'Sunset Boulevard', year: 1950 },
  { title: 'Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb', year: 1964 },
  { title: 'The Great Dictator', year: 1940 },
  { title: 'Cinema Paradiso', year: 1988 },
  { title: 'The Lives of Others', year: 2006 },
  { title: 'Grave of the Fireflies', year: 1988 },
  { title: 'Paths of Glory', year: 1957 },
  { title: 'Django Unchained', year: 2012 },
  { title: 'The Shining', year: 1980 },
  { title: 'WALL·E', year: 2008 },
  { title: 'American Beauty', year: 1999 },
  { title: 'The Dark Knight Rises', year: 2012 },
  { title: 'Princess Mononoke', year: 1997 },
  { title: 'Aliens', year: 1986 },
  { title: 'Oldboy', year: 2003 },
  { title: 'Once Upon a Time in America', year: 1984 },
  { title: 'Witness for the Prosecution', year: 1957 },
  { title: 'Das Boot', year: 1981 },
  { title: 'Citizen Kane', year: 1941 },
  { title: 'North by Northwest', year: 1959 },
  { title: 'Vertigo', year: 1958 },
  { title: 'Star Wars: Episode VI - Return of the Jedi', year: 1983 },
  { title: 'Reservoir Dogs', year: 1992 },
  { title: 'Braveheart', year: 1995 },
  { title: 'M', year: 1931 },
  { title: 'Requiem for a Dream', year: 2000 },
  { title: 'Amélie', year: 2001 },
  { title: 'A Clockwork Orange', year: 1971 },
  { title: 'Like Stars on Earth', year: 2007 },
  { title: 'Taxi Driver', year: 1976 },
  { title: 'Lawrence of Arabia', year: 1962 },
  { title: 'Double Indemnity', year: 1944 },
  { title: 'Eternal Sunshine of the Spotless Mind', year: 2004 },
  { title: 'Amadeus', year: 1984 },
  { title: 'To Kill a Mockingbird', year: 1962 },
  { title: 'Toy Story 3', year: 2010 },
  { title: 'Logan', year: 2017 },
  { title: 'Full Metal Jacket', year: 1987 },
  { title: 'Dangal', year: 2016 },
  { title: 'The Sting', year: 1973 },
  { title: '2001: A Space Odyssey', year: 1968 },
  { title: "Singin' in the Rain", year: 1952 },
  { title: 'Toy Story', year: 1995 },
  { title: 'Bicycle Thieves', year: 1948 },
  { title: 'The Kid', year: 1921 },
  { title: 'Inglourious Basterds', year: 2009 },
  { title: 'Snatch', year: 2000 },
  { title: '3 Idiots', year: 2009 },
  { title: 'Monty Python and the Holy Grail', year: 1975 }
];

export default PatchViewer;
