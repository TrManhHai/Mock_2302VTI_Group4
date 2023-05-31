import * as types from "../constants";

const initialState = {
  groups: [],

  // paging
  page: 1,
  size: 5,
  totalElement: 0,

  // sorting
  sortField: null,
  sortType: null,

  // search
  search: undefined,

  // filter
  minTotalMember: undefined,
  maxTotalMember: undefined,

  // selected rows
  selectedRows: [],

  isLoading: false
};

export default function reducer(state = initialState, actions) {
  switch (actions.type) {
    case types.GET_LIST_GROUP:
      return {
        ...state,
        groups: actions.payload.groups,
        // paging
        page: actions.payload.page,
        totalElement: actions.payload.totalElement,
        // sorting
        sortField: actions.payload.sortField,
        sortType: actions.payload.sortType,
        // search
        search: actions.payload.search,
        // filter
        minTotalMember: actions.payload.minTotalMember,
        maxTotalMember: actions.payload.maxTotalMember,
        // selected rows
        selectedRows: [],

        isLoading: false
      };
    case types.GET_LIST_GROUP_SELECTED_ROWS:
      return {
        ...state,
        selectedRows: actions.payload
      }
    default:
      return state;
  }
}