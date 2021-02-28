import Router from 'next/router';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { Column, useSortBy, useTable } from 'react-table';
import { useSetRecoilState } from 'recoil';

import { TournamentData } from '../../../models/users';
import { selectedTournamentDataState } from '../../../recoil/users/user';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../common/TableStyle';

type Props = {
  dataList: TournamentData[];
};

type Data = {
  date: string;
  name: string;
};

// YYYY/MM/DDに変換
const format1 = (date: string) =>
  `${date.slice(0, 4)}/${date.slice(4, 6)}/${date.slice(6, 8)}`;

// MM/DDに変換
const format2 = (date: string) => `${date.slice(4, 6)}/${date.slice(6, 8)}`;

const TournamentDataTable: FC<Props> = ({ dataList }) => {
  // Global State
  const setSelectedData = useSetRecoilState(selectedTournamentDataState);

  // Local State
  const [routeId, setRouteId] = useState('');

  // データを動的に生成
  const tableData = () => {
    const tableDataList: { date: string; name: string }[] = [];
    dataList.length > 0 &&
      dataList.forEach((data) => {
        const date = `${format1(data.startDate)} 〜 ${format2(data.endDate)}`;
        const { name } = data;
        tableDataList.push({ date, name });
      });
    return tableDataList;
  };
  const DATA: Data[] = [...tableData()];

  const COLUMNS: Column<Data>[] = [
    {
      Header: '期間',
      accessor: 'date',
    },
    {
      Header: '大会名',
      accessor: 'name',
    },
  ];

  const data = useMemo(() => DATA, [dataList]);
  const columns = useMemo(() => COLUMNS, [dataList]);
  const tableInstance = useTable({ columns, data }, useSortBy);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableInstance;

  const selectTableRow = (values: Data) => {
    const filterList = dataList.filter(
      (data) =>
        `${format1(data.startDate)} 〜 ${format2(data.endDate)}${data.name}` ===
        `${values.date}${values.name}`
    );
    setSelectedData(filterList[0]);
    setRouteId(filterList[0].id);
  };

  useEffect(() => {
    if (routeId !== '') {
      Router.push(`/tournament`);
      setRouteId('');
    }
  }, [routeId]);

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
            <TableRow
              {...row.getRowProps()}
              onClick={() => selectTableRow(row.original)}
            >
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

export default TournamentDataTable;
