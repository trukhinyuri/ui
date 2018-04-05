/* @flow */

import { push } from 'react-router-redux';
import cookie from 'react-cookies';

import type { Dispatch, GetState, ThunkAction } from '../../types/index';
import {
  GET_POD_REQUESTING,
  GET_POD_SUCCESS,
  GET_POD_FAILURE
} from '../../constants/podConstants/getPod';
// import isTokenExist from '../functions/isTokenExist';
import { webApiLogin } from '../../config/index';

const getPodRequest = () => ({
  type: GET_POD_REQUESTING,
  isFetching: true
});

const getPodSuccess = (data, status, idName, idDep, idPod) => ({
  type: GET_POD_SUCCESS,
  isFetching: false,
  data,
  status,
  idName,
  idDep,
  idPod
});

const getPodFailure = (err, status, idName, idDep, idPod) => ({
  type: GET_POD_FAILURE,
  isFetching: false,
  err,
  status,
  idName,
  idDep,
  idPod
});

export const fetchGetPod = (
  idName: string,
  idDep: string,
  idPod: string,
  axios: any,
  URL: string = webApiLogin
): ThunkAction => async (dispatch: Dispatch) => {
  const token = cookie.load('token') ? cookie.load('token') : null;
  const browser = cookie.load('browser') ? cookie.load('browser') : null;
  const accessToken = cookie.load('accessToken')
    ? cookie.load('accessToken')
    : null;

  dispatch(getPodRequest());

  const response = await axios.get(
    `${URL}/namespaces/${idName}/pods/${idPod}`,
    {
      headers: {
        Authorization: token,
        'User-Client': browser,
        'User-Token': accessToken
      },
      validateStatus: status => status >= 200 && status <= 505
    }
  );
  const { status, data } = response;
  // console.log(data);
  switch (status) {
    case 200: {
      dispatch(getPodSuccess(data, status, idName, idDep, idPod));
      break;
    }
    case 400: {
      dispatch(getPodFailure(data.message, status, idName, idDep, idPod));
      dispatch(push('/namespaces'));
      break;
    }
    case 401: {
      dispatch(getPodFailure(data.message, status, idName, idDep, idPod));
      dispatch(push('/login'));
      break;
    }
    default: {
      dispatch(getPodFailure(data.message, status, idName, idDep, idPod));
    }
  }
};

export const fetchGetPodIfNeeded = (
  idName: string,
  idDep: string,
  idPod: string
): ThunkAction => (dispatch: Dispatch, getState: GetState, axios: any) =>
  dispatch(fetchGetPod(idName, idDep, idPod, axios));
