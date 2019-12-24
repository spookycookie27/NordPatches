import React from 'react';
import Container from '@material-ui/core/Container';
import PatchBrowser from '../common/PatchBrowser';

const AddPatch = () => {
  return (
    <div className='AllPatches'>
      <Container maxWidth='lg'>
        <PatchBrowser />
      </Container>
    </div>
  );
};
export default AddPatch;
