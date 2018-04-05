/* @flow */

// import { push } from 'react-router-redux';
import cookie from 'react-cookies';

import type { Dispatch, GetState, ThunkAction } from '../types';
import {
  CONFIRM_SIGNUP_REQUESTING,
  CONFIRM_SIGNUP_SUCCESS,
  CONFIRM_SIGNUP_FAILURE
} from '../constants/confirmSignUpConstants';
import { webApiLogin } from '../config';

// const isServer = typeof window === 'undefined';
// const ReactGA = isServer ? require('react-ga') : null;

const confirmSignUpRequest = hashParam => ({
  type: CONFIRM_SIGNUP_REQUESTING,
  isFetching: true,
  hashParam
});

const confirmSignUpSuccess = data => ({
  type: CONFIRM_SIGNUP_SUCCESS,
  isFetching: false,
  data
});

const confirmSignUpFailure = err => ({
  type: CONFIRM_SIGNUP_FAILURE,
  isFetching: false,
  err
});

export const fetchConfirmSignUp = (
  hashParam: string,
  axios: any,
  URL: string = webApiLogin
): ThunkAction => async (dispatch: Dispatch) => {
  dispatch(confirmSignUpRequest(hashParam));
  const browser = cookie.load('browser') ? cookie.load('browser') : null;

  const response = await axios.post(
    `${URL}/user/activation`,
    { link: hashParam },
    {
      headers: {
        'User-Client': browser
      },
      validateStatus: status => status >= 200 && status <= 505
    }
  );
  const { data, status } = response;
  const { access_token: accessToken, refresh_token: refreshToken } = data;
  switch (status) {
    case 200: {
      cookie.save('accessToken', accessToken, { path: '/' });
      cookie.save('refreshToken', refreshToken, { path: '/' });
      cookie.save('lastTimeToRefresh', Date.parse(new Date()), { path: '/' });
      dispatch(confirmSignUpSuccess(data));
      if (typeof window !== 'undefined') {
        window.location.replace('/dashboard');
      }
      break;
    }
    default: {
      cookie.remove('token', { path: '/' });
      cookie.remove('accessToken', { path: '/' });
      cookie.remove('refreshToken', { path: '/' });
      cookie.remove('lastTimeToRefresh', { path: '/' });
      dispatch(confirmSignUpFailure('Hash is not valid'));
    }
  }
};

export const fetchConfirmSignUpIfNeeded = (hashParam: string): ThunkAction => (
  dispatch: Dispatch,
  getState: GetState,
  axios: any
) => {
  dispatch(fetchConfirmSignUp(hashParam, axios));
};
