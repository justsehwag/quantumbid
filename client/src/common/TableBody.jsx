import TableBodyMui from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

const TableBody = ({ columns, data }) => {
  const renderCellText = (item, column) => {
    if (column.content) return column.content(item);

    return item[column.path];
  };

  const createKey = (item, column) => item._id + (column.path || column.key);

  return (
    <TableBodyMui>
      {data.map((item) => {
        return (
          <TableRow hover key={item._id}>
            {columns.map((column) => (
              <TableCell key={createKey(item, column)}>
                {renderCellText(item, column)}
              </TableCell>
            ))}
          </TableRow>
        );
      })}
    </TableBodyMui>
  );
};

export default TableBody;
