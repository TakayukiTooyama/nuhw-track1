import { ChevronDownIcon } from '@chakra-ui/icons';
import { IconButton, useDisclosure } from '@chakra-ui/react';
import React, { useMemo } from 'react';
import { useSortBy, useTable } from 'react-table';
import { COLUMNS } from './colmuns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './Table';

const Test = () => {
  const { isOpen, onToggle } = useDisclosure();

  const data = useMemo(
    () => [
      {
        distance: (
          <IconButton
            aria-label="down-icon"
            variant="outline"
            icon={<ChevronDownIcon />}
            onClick={onToggle}
          />
        ),
        recode1: '17"00',
        recode2: '17"00',
        recode3: '17"00',
        recode4: '17"00',
        recode5: '17"00',
      },
    ],
    []
  );
  const columns = useMemo(() => COLUMNS, []);
  const tableInstance = useTable({ columns, data }, useSortBy);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableInstance;

  return (
    <Table {...getTableProps()}>
      <TableHead>
        {headerGroups.map((headerGroup) => (
          <TableRow {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <TableHeader {...column.getHeaderProps()}>
                {column.render('Header')}
              </TableHeader>
            ))}
          </TableRow>
        ))}
      </TableHead>
      <TableBody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <TableRow {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return (
                  <TableCell {...cell.getCellProps()}>
                    {cell.render('Cell')}
                  </TableCell>
                );
              })}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default Test;
