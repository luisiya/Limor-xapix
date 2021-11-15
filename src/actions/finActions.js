import axios from 'axios';
import { GET_FINANCIALS, GET_GROUPS, GET_ORDERS } from './types';

export const getFinancials = () => async (dispatch) => {
  const res = await axios.get('https://fake-api-ap.herokuapp.com/financials');
  dispatch({
    type: GET_FINANCIALS,
    payload: res.data,
  });
};
export const getOrders = () => async (dispatch) => {
  const res = await axios.get('https://fake-api-ap.herokuapp.com/orders');
  dispatch({
    type: GET_ORDERS,
    payload: res.data,
  });
};

export const getGroups = () => async (dispatch) => {
  const res = await axios.get('https://fake-api-ap.herokuapp.com/financial_groups');
  dispatch({
    type: GET_GROUPS,
    payload: res.data,
  });
};
