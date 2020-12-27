import React, { FC, useMemo } from 'react';
import { useGlobalFilter, useSortBy, useTable } from 'react-table';
import { Column } from 'react-table';
import moment from 'moment';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../oraganisms/common/TableStyle';
import { Round, TournamentMenu } from '../../../models/users';
import { GlobalFilter } from '../../oraganisms';
import { Box } from '@chakra-ui/react';

type TournamenViewData = TournamentMenu & {
  user: {
    id: string;
    username: string;
    grade: string;
  };
};

type Props = {
  menus: TournamenViewData[];
  hide: boolean;
  toggleSearch: boolean;
};
type Data = {
  username: string;
  grade: string;
  date: string;
  round: Round;
  recode: string;
  wind: string;
};

const TournamentViewTable: FC<Props> = ({ menus, hide, toggleSearch }) => {
  const name = menus[0].competitionName;
  const recodes = menus[0].recodes;

  //入力された文字列をタイム表記に変換
  const insertStr = (input: string) => {
    const len = input.length;
    if (len > 2 && len < 5)
      return input.slice(0, len - 2) + '"' + input.slice(len - 2, len);
    if (len > 4 && len < 7)
      return (
        input.slice(0, len - 4) +
        "'" +
        input.slice(len - 4, len - 2) +
        '"' +
        input.slice(len - 2, len)
      );
    return input;
  };

  //データを動的に生成
  const tableData = () => {
    let dataAry: Data[] = [];
    menus.map((menu) => {
      const formatDate = moment(String(menu.competitionDay)).format(
        'YYYY/MM/DD'
      );
      const username = menu.user.username;
      const grade = menu.user.grade;
      menu.recodes.forEach((recode) => {
        dataAry.push({
          username: username,
          grade: grade,
          date: formatDate,
          round: recode.round,
          recode: insertStr(recode.value),
          wind: recode.wind,
        });
      });
    });
    return dataAry;
  };

  const DATA: Data[] = [...tableData()];

  const COLUMNS1: Column<Data>[] = [
    {
      Header: `${name}`,
      accessor: 'username',
    },
    {
      Header: '日付',
      accessor: 'date',
    },
    {
      Header: '学年',
      accessor: 'grade',
    },
    {
      Header: 'ラウンド',
      accessor: 'round',
    },
    {
      Header: '記録',
      accessor: 'recode',
    },
    {
      Header: '風速',
      accessor: 'wind',
    },
  ];

  const COLUMNS2: Column<Omit<Data, 'wind'>>[] = [
    {
      Header: `${name}`,
      accessor: 'username',
    },
    {
      Header: '日付',
      accessor: 'date',
    },
    {
      Header: '学年',
      accessor: 'grade',
    },
    {
      Header: 'ラウンド',
      accessor: 'round',
    },
    {
      Header: '記録',
      accessor: 'recode',
    },
  ];

  const COLUMNS3: Column<Omit<Data, 'tournamentName'>>[] = [
    {
      Header: `${name}`,
      accessor: 'username',
    },
    {
      Header: 'ラウンド',
      accessor: 'round',
    },
    {
      Header: '記録',
      accessor: 'recode',
    },
    {
      Header: '風速',
      accessor: 'wind',
    },
  ];

  const COLUMNS4: Column<Omit<Data, 'tournamentName'>>[] = [
    {
      Header: `${name}`,
      accessor: 'username',
    },
    {
      Header: 'ラウンド',
      accessor: 'round',
    },
    {
      Header: '記録',
      accessor: 'recode',
    },
  ];
  const COLUMNS5: Column<Pick<Data, 'username' | 'round'>>[] = [
    {
      Header: `${name}`,
      accessor: 'username',
    },
    {
      Header: 'まだ記録が追加されていません',
      accessor: 'round',
    },
  ];
  const data = useMemo(() => DATA, [menus]);

  const changeColumn = () => {
    if (recodes.length) {
      let ary: string[] = [];
      recodes.forEach((recode) => {
        if (recode.wind !== '') {
          ary.push(recode.wind);
        }
      });
      if (hide) {
        if (ary.length) {
          //大会なし、風速あり
          return useMemo(() => COLUMNS3, [menus, hide]);
        }
        //大会なし、風速なし
        return useMemo(() => COLUMNS4, [menus, hide]);
      } else {
        if (ary.length) {
          //大会なし、風速あり
          return useMemo(() => COLUMNS1, [menus, hide]);
        }
        //大会なし、風速なし
        return useMemo(() => COLUMNS2, [menus, hide]);
      }
    }
    //まだ記録が登録されていない
    return useMemo(() => COLUMNS5, [menus, hide]);
  };
  const columns: any = changeColumn();

  const tableInstance = useTable({ columns, data }, useGlobalFilter, useSortBy);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    setGlobalFilter,
  } = tableInstance;

  const { globalFilter } = state;

  return (
    <>
      {toggleSearch ? (
        <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
      ) : null}
      <Box mb={4} />
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
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ''}
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
                // onClick={() => selectTableRow(row.original)}
              >
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
    </>
  );
};

export default TournamentViewTable;
