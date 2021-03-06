/* @flow */

import { push } from 'react-router-redux';
import cookie from 'react-cookies';

import type { Dispatch, GetState, ThunkAction } from '../../types';
import {
  GET_IMAGES_TOKEN_REQUESTING,
  GET_IMAGES_TOKEN_SUCCESS,
  GET_IMAGES_TOKEN_FAILURE
} from '../../constants/webHookConstants/getImagesToken';
import { webApi, routerLinks } from '../../config';

const getImagesTokenRequest = () => ({
  type: GET_IMAGES_TOKEN_REQUESTING,
  isFetching: true
});

const getImagesTokenSuccess = data => ({
  type: GET_IMAGES_TOKEN_SUCCESS,
  isFetching: false,
  data
});

const getImagesTokenFailure = err => ({
  type: GET_IMAGES_TOKEN_FAILURE,
  isFetching: false,
  err
});

const getImagesTokenInvalidToken = () => ({
  type: 'GET_INVALID_TOKEN'
});

export const fetchGetImagesToken = (
  axios: any,
  URL: string = webApi
): ThunkAction => async (dispatch: Dispatch) => {
  const browser = cookie.load('browser');

  dispatch(getImagesTokenRequest());

  const response = await axios.get(`${URL}/api/set_image_tokens`, {
    headers: {
      'User-Client': browser,
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control':
        'no-cache, no-store, must-revalidate, max-age=-1, private'
    },
    validateStatus: status => status >= 200 && status <= 505
  });
  const { status, data } = response;
  switch (status) {
    case 200: {
      dispatch(getImagesTokenSuccess(data));
      break;
    }
    case 400: {
      if (data.message === 'invalid token received') {
        dispatch(getImagesTokenInvalidToken());
      } else if (data.message === 'invalid request body format') {
        dispatch(push(routerLinks.login));
      } else dispatch(getImagesTokenFailure(data.message));
      break;
    }
    default: {
      dispatch(getImagesTokenFailure(data.message));
    }
  }
};

export const fetchGetImagesTokenIfNeeded = (): ThunkAction => (
  dispatch: Dispatch,
  getState: GetState,
  axios: any
) => dispatch(fetchGetImagesToken(axios));
