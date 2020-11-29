import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import { Column } from 'react-table';

type Data = {
  distance?: ReactJSXElement;
  recode1: string;
  recode2: string;
  recode3: string;
  recode4: string;
  recode5: string;
};

export const COLUMNS: Column<Data>[] = [
  {
    Header: '150m',
    accessor: 'distance',
  },
  {
    Header: '1本目',
    accessor: 'recode1',
  },
  {
    Header: '2本目',
    accessor: 'recode2',
  },
  {
    Header: '3本目',
    accessor: 'recode3',
  },
  {
    Header: '4本目',
    accessor: 'recode4',
  },
  {
    Header: '5本目',
    accessor: 'recode5',
  },
];
