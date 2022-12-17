import { IAggFunc } from 'ag-grid-community/dist/lib/entities/colDef';

export interface DefType {
  label: string;
  hide: boolean;
  colId: string;
}

export interface ColumnState {
  colId: string;
  hide?: boolean;
  aggFunc?: string | IAggFunc | null;
  width?: number;
  pivotIndex?: number | null;
  pinned?: boolean | string | 'left' | 'right';
  rowGroupIndex?: number | null;
  isAutoCol?: boolean;
}
