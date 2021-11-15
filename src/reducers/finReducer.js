import {
  GET_FINANCIALS,
} from '../actions/types';

const initialState = {
  financials: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    // case 'GET_GROUPS':
    //   return Object.assign({}, state, { groups: action.payload });
    // case 'GET_ORDERS':
    //   return Object.assign({}, state, { orders: action.payload });
    case GET_FINANCIALS:
      return {
        ...state,
        financials: action.payload,
      };
    default:
      return state;
  }
}
