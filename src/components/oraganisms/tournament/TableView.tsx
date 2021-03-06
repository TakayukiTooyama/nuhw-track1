import moment from 'moment';
import React, { FC, useMemo } from 'react';
import { Column, useSortBy, useTable } from 'react-table';

import { Round, TournamentMenu } from '../../../models/users';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../common/TableStyle';

type Props = {
  menus: TournamentMenu[];
  hide: boolean;
};

type Data = {
  round: Round;
  record: string;
  wind: string;
  date: string;
  tournamentName?: string;
};

const TableView: FC<Props> = ({ menus, hide }) => {
  const name = menus[0].competitionName;
  const { records } = menus[0];

  // 入力された文字列をタイム表記に変換
  const formatTimeNotationAtInput = (input: string) => {
    const len = input.length;
    if (len > 2 && len < 5)
      return `${input.slice(0, len - 2)}"${input.slice(len - 2, len)}`;
    if (len > 4 && len < 7)
      return `${input.slice(0, len - 4)}'${input.slice(
        len - 4,
        len - 2
      )}"${input.slice(len - 2, len)}`;
    return input;
  };

  // データを動的に生成
  const tableData = () => {
    const dataAry: Data[] = [];
    menus.map((menu) => {
      const formatDate = moment(String(menu.competitionDay)).format(
        'YYYY/MM/DD'
      );
      const tournamentName = menu.data.name;
      menu.records?.forEach((record) => {
        dataAry.push({
          date: formatDate,
          round: record.round,
          record: formatTimeNotationAtInput(record.value),
          wind: record.wind,
          tournamentName,
        });
      });
    });
    return dataAry;
  };

  const DATA: Data[] = [...tableData()];

  const COLUMNS1: Column<Data>[] = [
    {
      Header: `${name}`,
      accessor: 'date',
    },
    {
      Header: 'ラウンド',
      accessor: 'round',
    },
    {
      Header: '記録',
      accessor: 'record',
    },
    {
      Header: '風速',
      accessor: 'wind',
    },
    {
      Header: '大会名',
      accessor: 'tournamentName',
    },
  ];

  const COLUMNS2: Column<Omit<Data, 'wind'>>[] = [
    {
      Header: `${name}`,
      accessor: 'date',
    },
    {
      Header: 'ラウンド',
      accessor: 'round',
    },
    {
      Header: '記録',
      accessor: 'record',
    },
    {
      Header: '大会名',
      accessor: 'tournamentName',
    },
  ];

  const COLUMNS3: Column<Omit<Data, 'tournamentName'>>[] = [
    {
      Header: `${name}`,
      accessor: 'date',
    },
    {
      Header: 'ラウンド',
      accessor: 'round',
    },
    {
      Header: '記録',
      accessor: 'record',
    },
    {
      Header: '風速',
      accessor: 'wind',
    },
  ];

  const COLUMNS4: Column<Omit<Data, 'tournamentName'>>[] = [
    {
      Header: `${name}`,
      accessor: 'date',
    },
    {
      Header: 'ラウンド',
      accessor: 'round',
    },
    {
      Header: '記録',
      accessor: 'record',
    },
  ];
  const COLUMNS5: Column<Pick<Data, 'date' | 'round'>>[] = [
    {
      Header: `${name}`,
      accessor: 'date',
    },
    {
      Header: 'まだ記録が追加されていません',
      accessor: 'round',
    },
  ];
  const data = useMemo(() => DATA, [menus]);

  const judgRecord = menus.some((menu) => menu.records?.length);

  const changeColumn = () => {
    if (judgRecord) {
      const ary: string[] = [];
      records?.forEach((record) => {
        if (record.wind !== '') {
          ary.push(record.wind);
        }
      });
      if (hide) {
        if (ary.length) {
          // 大会なし、風速あり
          return useMemo(() => COLUMNS3, [menus, hide]);
        }
        // 大会なし、風速なし
        return useMemo(() => COLUMNS4, [menus, hide]);
      }
      if (ary.length) {
        // 大会あり、風速あり
        return useMemo(() => COLUMNS1, [menus, hide]);
      }
      // 大会あり、風速なし
      return useMemo(() => COLUMNS2, [menus, hide]);
    }
    // まだ記録が登録されていない
    return useMemo(() => COLUMNS5, [menus, hide]);
  };
  const columns: any = changeColumn();

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

export default TableView;
