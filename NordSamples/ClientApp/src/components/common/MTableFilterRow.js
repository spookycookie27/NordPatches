import * as React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';
import InputAdornment from '@material-ui/core/InputAdornment';
import Tooltip from '@material-ui/core/Tooltip';
import DateFnsUtils from '@date-io/date-fns';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import { MuiPickersUtilsProvider, TimePicker, DatePicker, DateTimePicker } from '@material-ui/pickers';
import { makeStyles } from '@material-ui/core/styles';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

const useStyles = makeStyles(theme => ({
  menuItems: {
    padding: 0
  },
  common: {
    fontSize: '14px'
  }
}));

const defaultProps = {
  columns: [],
  selection: false,
  hasActions: false,
  localization: {
    filterTooltip: 'Filter'
  },
  hideFilterIcons: false
};

const MTableFilterRow = props => {
  const classes = useStyles();

  const renderFilterComponent = columnDef => {
    React.createElement(columnDef.filterComponent, { columnDef: columnDef, onFilterChanged: props.onFilterChanged });
  };

  const renderLookupArrayFilter = columnDef => {
    return (
      <FormControl style={{ width: '100%' }}>
        <InputLabel htmlFor='select-multiple-checkbox2'>{columnDef.filterPlaceholder}</InputLabel>
        <Select
          multiple
          value={columnDef.tableData.filterValue || []}
          onChange={event => props.onFilterChanged(columnDef.tableData.id, event.target.value)}
          input={<Input id='select-multiple-checkbox2' />}
          renderValue={selecteds => selecteds.map(selected => columnDef.lookupArr.find(x => x.key === selected).value).join(', ')}
          MenuProps={MenuProps}
          style={{ marginTop: '1px' }}
        >
          {columnDef.lookupArr.map(item => (
            <MenuItem key={item.key} value={item.key} className={classes.menuItems}>
              <Checkbox
                checked={columnDef.tableData.filterValue ? columnDef.tableData.filterValue.indexOf(item.key) > -1 : false}
                icon={<CheckBoxOutlineBlankIcon fontSize='small' />}
                checkedIcon={<CheckBoxIcon fontSize='small' />}
              />
              <ListItemText primary={item.value} className={classes.common} disableTypography />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };

  const renderLookupFilter = columnDef => {
    return (
      <FormControl style={{ width: '100%' }}>
        <InputLabel htmlFor='select-multiple-checkbox'>{columnDef.filterPlaceholder}</InputLabel>
        <Select
          multiple
          value={columnDef.tableData.filterValue || []}
          onChange={event => props.onFilterChanged(columnDef.tableData.id, event.target.value)}
          input={<Input id='select-multiple-checkbox' />}
          renderValue={selecteds => selecteds.map(selected => columnDef.lookup[selected]).join(', ')}
          MenuProps={MenuProps}
          style={{ marginTop: '1px' }}
        >
          {Object.keys(columnDef.lookup).map(key => (
            <MenuItem key={key} value={key} className={classes.menuItems}>
              <Checkbox
                checked={columnDef.tableData.filterValue ? columnDef.tableData.filterValue.indexOf(key.toString()) > -1 : false}
                icon={<CheckBoxOutlineBlankIcon fontSize='small' />}
                checkedIcon={<CheckBoxIcon fontSize='small' />}
              />
              <ListItemText primary={columnDef.lookup[key]} className={classes.common} disableTypography />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };

  const renderBooleanFilter = columnDef => (
    <Checkbox
      indeterminate={columnDef.tableData.filterValue === undefined}
      checked={columnDef.tableData.filterValue === 'checked'}
      onChange={() => {
        let val;
        if (columnDef.tableData.filterValue === undefined) {
          val = 'checked';
        } else if (columnDef.tableData.filterValue === 'checked') {
          val = 'unchecked';
        }

        props.onFilterChanged(columnDef.tableData.id, val);
      }}
    />
  );

  const renderDefaultFilter = columnDef => {
    const localization = { ...defaultProps.localization, ...props.localization };
    return (
      <TextField
        style={columnDef.type === 'numeric' ? { float: 'right', marginTop: 0 } : { marginTop: 0 }}
        type={columnDef.type === 'numeric' ? 'number' : 'search'}
        value={columnDef.tableData.filterValue || ''}
        placeholder={columnDef.filterPlaceholder || ''}
        onChange={event => {
          props.onFilterChanged(columnDef.tableData.id, event.target.value);
        }}
        InputProps={
          props.hideFilterIcons || columnDef.hideFilterIcon
            ? undefined
            : {
                startAdornment: (
                  <InputAdornment position='start'>
                    <Tooltip title={localization.filterTooltip}>
                      <props.icons.Filter />
                    </Tooltip>
                  </InputAdornment>
                )
              }
        }
      />
    );
  };

  const renderDateTypeFilter = columnDef => {
    let dateInputElement = null;
    const onDateInputChange = date => props.onFilterChanged(columnDef.tableData.id, date);
    if (columnDef.type === 'date') {
      dateInputElement = <DatePicker value={columnDef.tableData.filterValue || null} onChange={onDateInputChange} clearable />;
    } else if (columnDef.type === 'datetime') {
      dateInputElement = <DateTimePicker value={columnDef.tableData.filterValue || null} onChange={onDateInputChange} clearable />;
    } else if (columnDef.type === 'time') {
      dateInputElement = <TimePicker value={columnDef.tableData.filterValue || null} onChange={onDateInputChange} clearable />;
    }
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={props.localization.dateTimePickerLocalization}>
        {dateInputElement}
      </MuiPickersUtilsProvider>
    );
  };

  const getComponentForColumn = columnDef => {
    if (columnDef.filtering === false) {
      return null;
    }

    if (columnDef.field || columnDef.customFilterAndSearch) {
      if (columnDef.filterComponent) {
        return renderFilterComponent(columnDef);
      } else if (columnDef.lookupArr) {
        return renderLookupArrayFilter(columnDef);
      } else if (columnDef.lookup) {
        return renderLookupFilter(columnDef);
      } else if (columnDef.type === 'boolean') {
        return renderBooleanFilter(columnDef);
      } else if (['date', 'datetime', 'time'].includes(columnDef.type)) {
        return renderDateTypeFilter(columnDef);
      } else {
        return renderDefaultFilter(columnDef);
      }
    }
  };

  const columns = props.columns
    .filter(columnDef => !columnDef.hidden && !(columnDef.tableData.groupOrder > -1))
    .sort((a, b) => a.tableData.columnOrder - b.tableData.columnOrder)
    .map(columnDef => (
      <TableCell key={columnDef.tableData.id} style={{ ...props.filterCellStyle, ...columnDef.filterCellStyle }}>
        {getComponentForColumn(columnDef)}
      </TableCell>
    ));

  if (props.selection) {
    columns.splice(0, 0, <TableCell padding='none' key='key-selection-column' />);
  }

  if (props.hasActions) {
    if (props.actionsColumnIndex === -1) {
      columns.push(<TableCell key='key-action-column' />);
    } else {
      let endPos = 0;
      if (props.selection) {
        endPos = 1;
      }
      columns.splice(props.actionsColumnIndex + endPos, 0, <TableCell key='key-action-column' />);
    }
  }

  if (props.hasDetailPanel) {
    columns.splice(0, 0, <TableCell padding='none' key='key-detail-panel-column' />);
  }

  if (props.isTreeData > 0) {
    columns.splice(0, 0, <TableCell padding='none' key={'key-tree-data-filter'} />);
  }

  props.columns
    .filter(columnDef => columnDef.tableData.groupOrder > -1)
    .forEach(columnDef => {
      columns.splice(0, 0, <TableCell padding='checkbox' key={'key-group-filter' + columnDef.tableData.id} />);
    });

  return <TableRow style={{ height: 10 }}>{columns}</TableRow>;
};

export default MTableFilterRow;
