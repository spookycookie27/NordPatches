import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
// import Link from '@material-ui/core/Link';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import theme from '../../theme';

const useStyles = makeStyles({
  root: {
    width: '100%',
    overflowX: 'auto',
    margin: theme.spacing(3)
  },
  table: {
    minWidth: 650
  },
  link: {
    textDecoration: 'underline'
  }
});

const Home = () => {
  const classes = useStyles();
  return (
    <div className='Home'>
      <Container maxWidth='md'>
        <Typography variant='h2' gutterBottom>
          Unoffical User Sample Collection
        </Typography>
        <Typography variant='body1' gutterBottom>
          This website is for Nord lovers everywhere to come together and build the best user library of Nord sounds and samples on the net. Most of the sounds
          from Nord User Forum have been added to this library as a starting point. We need help in categorising and editing the metadata and mp3s for the
          exisiting sounds. This site is written and maintained by 'SpookyCookie' from the Nord User Forum. If you have any questions PM me directly.
        </Typography>
        <Typography variant='body1' gutterBottom>
          The library is organised into Patches and Files. The term "Patches" is deliberately ambiguous!
        </Typography>
        <Typography variant='h4' gutterBottom>
          Login
        </Typography>
        <Typography variant='body1' gutterBottom>
          To register, you will need to provide Email, Username, Password and an optional Activation Code which you can find in the NUF user form user control
          panel. This code is unique to your user account and cannot be guessed easily. Using this code will mean you have the ability to to edit your old
          patches previously uploaded to the NUF forum. This is because using the code will prove that you are the same user. We strongly encourage you to take
          the time to retrieve the code before registering on NordSamples.com.
        </Typography>
        <Typography variant='h4' gutterBottom>
          What is a 'Patch'
        </Typography>
        <Typography variant='body1' gutterBottom>
          A 'patch' is an entry or item in the library. It might be a Nord Stage2 program with user samples and mp3s (files) for example. Or it might simply be
          a single User Sample. It will have searchable metadata such as category, tags, comments etc. I have used the word 'patch' to avoid confusion over
          programs and samples. It's both! I have included the database spec initially as I know some are interested. This will probably be removed later.
        </Typography>
        <Typography variant='h4' gutterBottom>
          What is a 'File'
        </Typography>
        <Typography variant='body1' gutterBottom>
          Speaks for itself really. Its a single file that will be used in 1 or more patches. These are included for reference only. The files are accessed by
          browsing the patches. There are 2 IDs, one for this database, and one that reflects the attachment ID in the NUF database.
        </Typography>
        <Typography variant='h4' gutterBottom>
          Documentation
        </Typography>
        <Typography variant='h6' gutterBottom>
          Patch spec
        </Typography>
        <Paper className={classes.root}>
          <Table className={classes.table} aria-label='simple table'>
            <TableBody>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>The ID in NordSamples library</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>The searchable name of the patch in the library</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Decription</TableCell>
                <TableCell>The searchable description of the patch in the library. We need admins to edit these to make the library more friendly.</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Link</TableCell>
                <TableCell>The link back to the original Nord User forum post</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Instrument Type</TableCell>
                <TableCell>The type of patch. [StageClassic | Stage2 | Stage3 | Sample | Lead | Electro]</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Category</TableCell>
                <TableCell>The sound category. [Strings | Brass | Grand | Electric Piano | etc]</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Tags</TableCell>
                <TableCell>
                  This is an array of keywords to help descibe a patch. Users can tag their own patches on creation. Admins can adjust tags on all patches.
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Comments</TableCell>
                <TableCell>This is an array of comments about the patch made by users.</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>NUF user</TableCell>
                <TableCell>The original NUF user who originally created the patch as referenced in the NUF form database</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>App user</TableCell>
                <TableCell>The original user as referenced in the Nord Samples database</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Date Created</TableCell>
                <TableCell>The original patch creation date</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Date Updated</TableCell>
                <TableCell>The date the patch meta data was last edited</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Parent</TableCell>
                <TableCell>This patch might be variation of a earlier patch. The parent relates to the original version</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Children</TableCell>
                <TableCell>There might be subsequent variations of a patch. These are the variations</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Paper>
      </Container>
    </div>
  );
};
export default Home;
