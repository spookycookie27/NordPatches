import React from 'react';
import Container from '@material-ui/core/Container';
import PatchCreator from '../common/PatchCreator';

const AddPatch = () => {
  return (
    <div className='Home'>
      <Container maxWidth='md'>
        <PatchCreator />
      </Container>
    </div>
  );
};
export default AddPatch;
