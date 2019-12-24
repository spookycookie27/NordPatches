import React from 'react';
import Container from '@material-ui/core/Container';
import PatchBrowser from '../common/PatchBrowser';

const AddPatch = () => {
  return (
    <div className='MyPatches'>
      <Container maxWidth='lg'>
        <PatchBrowser myPatches />
      </Container>
    </div>
  );
};
export default AddPatch;
