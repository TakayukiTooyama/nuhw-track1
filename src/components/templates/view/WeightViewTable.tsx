import moment from 'moment';
import React, { useMemo, VFC } from 'react';
import { Column, useSortBy, useTable } from 'react-table';
import { useRecoilValue } from 'recoil';

import { WeightMenu } from '../../../models/users';
import { NumberToDisplay } from '../../../recoil/users/user';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../oraganisms/common/TableStyle';

type WeightViewData = WeightMenu & {
  user: {
    id: string;
    username: string;
  };
};

type Props = {
  menus: WeightViewData[];
  label: string;
  format?: (input: string) => string;
};

type Data = {
  [key: string]: string;
};

const ViewTable: VFC<Props> = ({ menus, label = '', format }) => {
  const displayNumber = useRecoilValue(NumberToDisplay);

  // データを動的に生成
  const tableData = () => {
    const tableDataAry: {
      date: string;
      name: string;
      [key: string]: string;
    }[] = [];
    menus.length &&
      menus.forEach((menu) => {
        if (!menu) return;
        const strDateId = String(menu.dateId);
        const formatDate = moment(strDateId).format('YYYY/MM/DD');

        const obj: Data = {};
        menu.records?.forEach((record, idx) => {
          const key = `record${idx + 1}`;
          const { value } = record;
          if (format) {
            obj[key] = format(value);
          } else {
            obj[key] = value;
          }
        });
        tableDataAry.push({
          date: formatDate,
          name: menu.user.username,
          ...obj,
        });
      });
    return tableDataAry;
  };
  const DATA: Data[] = [...tableData()];

  // 先頭の見出しを動的に生成
  const columnData = (number: number) => {
    const ary: number[] = [];
    const len = number;
    for (let i = 0; i < len; i++) {
      ary.push(Math.random());
    }
    const selectedNumberList: any = [];
    ary.forEach((_Record, idx) => {
      selectedNumberList.push({
        Header: `${idx + 1}${label}`,
        accessor: `record${idx + 1}`,
      });
    });
    return selectedNumberList;
  };

  const COLUMNS: Column<Data>[] = [
    {
      Header: '日付',
      accessor: 'date',
    },
    {
      Header: '名前',
      accessor: 'name',
    },
    ...columnData(Number(displayNumber)),
  ];

  const data = useMemo(() => DATA, [menus]);
  const columns = useMemo(() => COLUMNS, [menus, displayNumber]);
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
              <TableHeader
                {...column.getHeaderProps(column.getSortByToggleProps())}
              >
                {column.render('Header')}
                <span>
                  {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                </span>
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
              {row.cells.map((cell) => (
                <TableCell {...cell.getCellProps()}>
                  {cell.render('Cell')}
                </TableCell>
              ))}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default ViewTable;
