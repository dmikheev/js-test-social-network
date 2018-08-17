export interface ISearchPageState extends Readonly<ISearchPageStateMutable> {}
interface ISearchPageStateMutable {
  didInvalidate: boolean;
  foundUsers?: string[];
  isFetching: boolean;
  itemsPerPage?: number;
  pageNum: number;
  totalItemsCount?: number;
}
