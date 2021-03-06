/* @flow */

import { push } from 'react-router-redux';
import cookie from 'react-cookies';

import type { Dispatch, GetState, ThunkAction } from '../../types';
import {
  DELETE_DEPLOYMENT_REQUESTING,
  DELETE_DEPLOYMENT_SUCCESS,
  DELETE_DEPLOYMENT_FAILURE
} from '../../constants/deploymentConstants/deleteDeployment';
import { routerLinks, webApi } from '../../config';

const deleteDeploymentRequest = () => ({
  type: DELETE_DEPLOYMENT_REQUESTING,
  isFetching: true
});

const deleteDeploymentSuccess = (data, status, method, idDep) => ({
  type: DELETE_DEPLOYMENT_SUCCESS,
  isFetching: false,
  data,
  status,
  method,
  idDep
});

const deleteDeploymentFailure = (err, status, idDep) => ({
  type: DELETE_DEPLOYMENT_FAILURE,
  isFetching: false,
  err,
  status,
  idDep
});

const deleteDeploymentInvalidToken = () => ({
  type: 'GET_INVALID_TOKEN'
});

export const fetchDeleteDeployment = (
  idName: string,
  idDep: string,
  axios: any,
  URL: string = webApi
): ThunkAction => async (dispatch: Dispatch) => {
  const browser = cookie.load('browser');
  const accessToken = cookie.load('accessToken');

  dispatch(deleteDeploymentRequest());

  const response = await axios.delete(
    `${URL}/namespaces/${idName}/deployments/${idDep}`,
    {
      headers: {
        'User-Client': browser,
        'User-Token': accessToken
      },
      validateStatus: status => status >= 200 && status <= 505
    }
  );
  const { data, status, config } = response;
  switch (status) {
    case 202: {
      dispatch(deleteDeploymentSuccess(data, status, config.method, idDep));
      break;
    }
    case 400: {
      if (data.message === 'invalid token received') {
        dispatch(deleteDeploymentInvalidToken());
      } else if (data.message === 'invalid request body format') {
        dispatch(push(routerLinks.login));
      } else dispatch(deleteDeploymentFailure(data.message, status, idDep));
      break;
    }
    default: {
      dispatch(deleteDeploymentFailure(data.message, status, idDep));
    }
  }
};

export const fetchDeleteDeploymentIfNeeded = (
  idName: string,
  idDep: string
): ThunkAction => (dispatch: Dispatch, getState: GetState, axios: any) =>
  dispatch(fetchDeleteDeployment(idName, idDep, axios));
