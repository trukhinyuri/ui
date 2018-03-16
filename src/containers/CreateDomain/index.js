/* @flow */

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
// import { NavLink } from 'react-router-dom';
import type { Connector } from 'react-redux';
import Helmet from 'react-helmet';
import _ from 'lodash/fp';

import * as actionGetServices from '../../actions/servicesActions/getServices';
import * as actionCreateDomain from '../../actions/serviceActions/createDomain';
import {
  GET_SERVICES_INVALID,
  GET_SERVICES_REQUESTING,
  GET_SERVICES_FAILURE,
  GET_SERVICES_SUCCESS
} from '../../constants/servicesConstants/getServices';
// import { CREATE_DOMAIN_SUCCESS } from '../../constants/serviceConstants/createDomain';
import type { Dispatch, ReduxState } from '../../types';
import NavigationHeaderItem from '../NavigationHeader';
import CreateDomainCard from '../../components/CreateDomainCard';
import LoadButton from '../../components/LoadButton';
// import InputControl from '../../components/InputControl';
import Notification from '../Notification';
// import { routerLinks } from '../../config';

type Props = {
  getServicesReducer: Object,
  createDomainReducer: Object,
  match: Object,
  // history: Object,
  fetchGetServicesIfNeeded: (idName: string) => void,
  fetchCreateDomainIfNeeded: (idName: string, data: Object) => void
};

// Export this for unit testing more easily
export class CreateDomain extends PureComponent<Props> {
  constructor(props) {
    super(props);
    this.state = {
      currentService: '',
      serviceList: []
    };
  }
  componentDidMount() {
    const { fetchGetServicesIfNeeded, match } = this.props;
    fetchGetServicesIfNeeded(match.params.idName);
  }
  componentWillUpdate(nextProps) {
    if (
      this.props.getServicesReducer.readyStatus !==
        nextProps.getServicesReducer.readyStatus &&
      nextProps.getServicesReducer.readyStatus === GET_SERVICES_SUCCESS
    ) {
      if (nextProps.getServicesReducer.data[0]) {
        this.setState({
          ...this.state,
          currentService: nextProps.getServicesReducer.data[0].name,
          serviceList: nextProps.getServicesReducer.data
        });
      }
    }
  }
  handleSubmitCreateDomain = e => {
    e.preventDefault();
    const { fetchCreateDomainIfNeeded, match } = this.props;
    console.log('Hi', match.params.idName, fetchCreateDomainIfNeeded);
    // fetchCreateDomainIfNeeded(match.params.idName, this.state);
  };
  handleChange = e => {
    this.setState({
      ...this.state,
      currentService: e.target.value
    });
  };
  renderCreateDomain = () => {
    const { getServicesReducer } = this.props;
    if (
      !getServicesReducer.readyStatus ||
      getServicesReducer.readyStatus === GET_SERVICES_INVALID ||
      getServicesReducer.readyStatus === GET_SERVICES_REQUESTING
    ) {
      return (
        <div>
          {new Array(3).fill().map(() => (
            <img
              key={_.uniqueId()}
              src={require('../../images/create-dep-serv.svg')}
              style={{
                marginTop: '-2px',
                marginBottom: '30px',
                width: '100%'
              }}
              alt="create service"
            />
          ))}
        </div>
      );
    }

    if (getServicesReducer.readyStatus === GET_SERVICES_FAILURE) {
      return <p>Oops, Failed to load data of Services!</p>;
    }

    const { currentService, serviceList } = this.state;
    return (
      <CreateDomainCard
        currentService={currentService}
        serviceList={serviceList}
      />
    );
  };

  render() {
    const { match, createDomainReducer } = this.props;
    // console.log(this.state);
    return (
      <div>
        <Helmet title={`Create Domain in ${match.params.idSrv}`} />
        <div className="container-fluid breadcrumbNavigation">
          <NavigationHeaderItem
            idName={match.params.idName}
            idService={match.params.idSrv}
            IdCreate="domain"
          />
        </div>
        <Notification
          status={createDomainReducer.status}
          name={createDomainReducer.idSrv}
          errorMessage={createDomainReducer.err}
        />
        <div className="content-block">
          <div className="container no-back">
            <div className="row pageWidth">
              <div className="col-md-3 sideMenu" />
              <div className="col-md-9 pageContent">
                <form onSubmit={e => this.handleSubmitCreateDomain(e)}>
                  {this.renderCreateDomain()}
                  <LoadButton
                    type="submit"
                    buttonText="Create domain"
                    isFetching={
                      createDomainReducer.isFetching ||
                      createDomainReducer.isFetching
                    }
                    baseClassButton="btnDeployment btnService"
                  />
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const connector: Connector<{}, Props> = connect(
  ({ getServicesReducer, createDomainReducer }: ReduxState) => ({
    getServicesReducer,
    createDomainReducer
  }),
  (dispatch: Dispatch) => ({
    fetchGetServicesIfNeeded: (idName: string) =>
      dispatch(actionGetServices.fetchGetServicesIfNeeded(idName)),
    fetchCreateDomainIfNeeded: (idName: string, data: Object) =>
      dispatch(actionCreateDomain.fetchCreateDomainIfNeeded(idName, data))
  })
);

export default connector(CreateDomain);
