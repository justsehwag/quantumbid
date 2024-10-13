import TableMui from '@mui/material/Table';
import TableHeader from './TableHeader';
import TableBody from '../common/TableBody';

const Table = ({ columns, data }) => {
  return (
    <TableMui>
      <TableHeader columns={columns} />
      <TableBody columns={columns} data={data} />
    </TableMui>
  );
};

export default Table;
