/* @flow */

import { push } from 'react-router-redux';
import cookie from 'react-cookies';

import type { Dispatch, GetState, ThunkAction } from '../../types/index';
import {
  DELETE_VOLUME_REQUESTING,
  DELETE_VOLUME_SUCCESS,
  DELETE_VOLUME_FAILURE
} from '../../constants/volumeConstants/deleteVolume';
import { webApi } from '../../config';

const deleteVolumeRequest = () => ({
  type: DELETE_VOLUME_REQUESTING,
  isFetching: true
});

const deleteVolumeSuccess = (data, status, method, idVol) => ({
  type: DELETE_VOLUME_SUCCESS,
  isFetching: false,
  data,
  status,
  method,
  idVol
});

const deleteVolumeFailure = (err, status, idVol) => ({
  type: DELETE_VOLUME_FAILURE,
  isFetching: false,
  err,
  status,
  idVol
});

export const fetchDeleteVolume = (
  idVol: string,
  axios: any,
  URL: string = webApi
): ThunkAction => async (dispatch: Dispatch) => {
  const token = cookie.load('token') ? cookie.load('token') : null;
  const browser = cookie.load('browser') ? cookie.load('browser') : null;
  // console.log(token);

  dispatch(deleteVolumeRequest());

  const response = await axios.delete(`${URL}/api/volumes/${idVol}`, {
    headers: {
      Authorization: token,
      'User-Client': browser,
      'Content-Type': 'application/x-www-form-urlencode',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control':
        'no-cache, no-store, must-revalidate, max-age=-1, private'
    },
    validateStatus: status => status >= 200 && status <= 505
  });
  const { data, status, config } = response;
  switch (status) {
    case 202: {
      dispatch(deleteVolumeSuccess(data, status, config.method, idVol));
      break;
    }
    case 401: {
      dispatch(deleteVolumeFailure(data.message, status, idVol));
      dispatch(push('/login'));
      break;
    }
    default: {
      dispatch(deleteVolumeFailure(data.message, status, idVol));
    }
  }
};

export const fetchDeleteVolumeIfNeeded = (idVol: string): ThunkAction => (
  dispatch: Dispatch,
  getState: GetState,
  axios: any
) => dispatch(fetchDeleteVolume(idVol, axios));
