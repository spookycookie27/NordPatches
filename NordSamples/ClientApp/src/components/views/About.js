import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
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
    minWidth: 650,
    margin: 0
  },
  link: {
    textDecoration: 'underline'
  }
});

const About = () => {
  const classes = useStyles();
  return (
    <div className='Home'>
      <Container maxWidth='md'>
        <Typography variant='h6' gutterBottom>
          Patch spec
        </Typography>
        <Paper>
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
                <TableCell>The type of patch. [StageClassic | Stage2 | Stage3 | Stage4 | Sample | Lead | Electro]</TableCell>
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
export default About;
