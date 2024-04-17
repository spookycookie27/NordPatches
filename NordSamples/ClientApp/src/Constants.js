import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
export const nufFileLink = 'https://www.norduserforum.com/download/file.php?id=';
export const blobUrl = 'https://nordsounds.blob.core.windows.net';
export const siteName = 'Nord User Sounds';
//export const regexEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,}$/;
export const regexEx = /^.{6,}$/;

export const categories = {
  23: 'Acoustic',
  22: 'Arpeggio',
  6: 'Bass',
  21: 'Clavinet',
  10: 'FX',
  20: 'EPiano',
  12: 'Ethnic',
  19: 'Fantasy',
  18: 'Grand',
  7: 'Guitar',
  2: 'Lead',
  24: 'Nature',
  13: 'Organ',
  5: 'Pads',
  17: 'Pluck',
  3: 'Strings',
  1: 'Synth',
  16: 'Upright',
  15: 'Vocal',
  14: 'Wind',
  25: 'Song (Mixed)'
};

export const categoriesLu = [
  { key: 23, value: 'Acoustic' },
  { key: 22, value: 'Arpeggio' },
  { key: 6, value: 'Bass' },
  { key: 21, value: 'Clavinet' },
  { key: 20, value: 'EPiano' },
  { key: 12, value: 'Ethnic' },
  { key: 19, value: 'Fantasy' },
  { key: 10, value: 'FX' },
  { key: 18, value: 'Grand' },
  { key: 26, value: 'Harpsi' },
  { key: 2, value: 'Lead' },
  { key: 13, value: 'Organ' },
  { key: 5, value: 'Pads' },
  { key: 17, value: 'Pluck' },
  { key: 25, value: 'Song (Mixed)' },
  { key: 3, value: 'Strings' },
  { key: 1, value: 'Synth' },
  { key: 16, value: 'Upright' },
  { key: 15, value: 'Vocal' },
  { key: 14, value: 'Wind' }
];

export const instruments = { 1: 'Sample', 5: 'Stage 2', 6: 'Stage 3', 8:'Stage 4', 4: 'Stage 1', 3: 'Electro', 2: 'Lead' };
export const instrumentsLu = [
  { key: 1, value: 'Sample' },
  { key: 4, value: 'Stage 1' },
  { key: 5, value: 'Stage 2' },
  { key: 6, value: 'Stage 3' },
  { key: 8, value: 'Stage 4' },
  { key: 3, value: 'Electro' },
  { key: 2, value: 'Lead' }
];

export const renderOptions = (entity, includeNone) => {
  const options = [];
  if (includeNone) {
    options.push(
      <MenuItem value='0'>
        <em>None</em>
      </MenuItem>
    );
  }
  entity.map(item =>
    options.push(
      <MenuItem key={item.key} value={item.key}>
        {item.value}
      </MenuItem>
    )
  );
  return options;
};
