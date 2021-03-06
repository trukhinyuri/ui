/* @flow */

import { push } from 'react-router-redux';
import cookie from 'react-cookies';

import type { Dispatch, GetState, ThunkAction } from '../../types';
import {
  CREATE_DOMAIN_REQUESTING,
  CREATE_DOMAIN_SUCCESS,
  CREATE_DOMAIN_FAILURE
} from '../../constants/serviceConstants/createDomain';
import { webApi, routerLinks } from '../../config';

const createDomainRequest = () => ({
  type: CREATE_DOMAIN_REQUESTING,
  isFetching: true
});

const createDomainSuccess = (data, status, idSrv) => ({
  type: CREATE_DOMAIN_SUCCESS,
  isFetching: false,
  data,
  status,
  idSrv
});

const createDomainFailure = (err, status, idSrv) => ({
  type: CREATE_DOMAIN_FAILURE,
  isFetching: false,
  err,
  status,
  idSrv
});

const createDomainInvalidToken = () => ({
  type: 'GET_INVALID_TOKEN'
});

export const fetchCreateDomain = (
  idName: string,
  dataDomain: Object,
  axios: any,
  URL: string = webApi
): ThunkAction => async (dispatch: Dispatch) => {
  const accessToken = cookie.load('accessToken');
  const browser = cookie.load('browser');

  const currentData = {
    name: dataDomain.domainName,
    // owner: dataDomain.uid,
    rules: [
      {
        host: dataDomain.domainName,
        path: [
          {
            path: `/${dataDomain.domainPath}`,
            service_name: dataDomain.currentService.name,
            service_port: dataDomain.currentPort.port
          }
        ]
      }
    ]
  };
  if (dataDomain.isEnabledSSL) {
    currentData.rules[0].tls_secret = dataDomain.currentService.name;
  }
  dispatch(createDomainRequest());

  let idSrv = idName;
  const response = await axios.post(
    `${URL}/namespaces/${idName}/ingresses`,
    currentData,
    {
      headers: {
        'User-Client': browser,
        'User-Token': accessToken
      },
      validateStatus: status => status >= 200 && status <= 505
    }
  );
  const { status, data } = response;
  switch (status) {
    case 201: {
      idSrv = `Domain ${dataDomain.domainName}`;
      dispatch(createDomainSuccess(data, status, idSrv));
      dispatch(push(routerLinks.namespaceDomainsLink(idName)));
      break;
    }
    case 400: {
      if (data.message === 'invalid token received') {
        dispatch(createDomainInvalidToken());
      } else if (data.message === 'invalid request body format') {
        dispatch(push(routerLinks.login));
      } else dispatch(createDomainFailure(data.message, status, idSrv));
      break;
    }
    default: {
      dispatch(createDomainFailure(data.message, status, idSrv));
    }
  }
};

export const fetchCreateDomainIfNeeded = (
  idName: string,
  data: Object
): ThunkAction => (dispatch: Dispatch, getState: GetState, axios: any) =>
  dispatch(fetchCreateDomain(idName, data, axios));
