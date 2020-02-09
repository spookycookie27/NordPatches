import React from 'react';
import { useParams } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import PatchViewer from '../common/PatchViewer';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({}));

const ViewSound = () => {
  const classes = useStyles();
  const { id } = useParams();
  return (
    <div>
      <Container maxWidth='lg'>
        <Card className={classes.mainCard}>
          <CardContent>
            <PatchViewer patchId={id} />
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};
export default ViewSound;
