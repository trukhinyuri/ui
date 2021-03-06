/* @flow */

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import Helmet from 'react-helmet';
import Scrollspy from 'react-scrollspy';
import cookie from 'react-cookies';

import scrollById from '../../functions/scrollById';
import { routerLinks } from '../../config';
import * as actionGetNamespaceUsersAccess from '../../actions/namespaceActions/getNamespaceUsersAccess';
import * as actionUpdateCustomNamespace from '../../actions/namespaceActions/updateCustomNamespace';
import {
  GET_NAMESPACE_USERS_ACCESS_INVALID,
  GET_NAMESPACE_USERS_ACCESS_REQUESTING,
  GET_NAMESPACE_USERS_ACCESS_FAILURE,
  GET_NAMESPACE_USERS_ACCESS_SUCCESS
} from '../../constants/namespaceConstants/getNamespaceUsersAccess';
import { GET_PROFILE_SUCCESS } from '../../constants/profileConstants/getProfile';
// import { CREATE_CUSTOM_NAMESPACE_SUCCESS } from '../../constants/namespaceConstants/updateCustomNamespace';
import type { Dispatch, ReduxState } from '../../types';
import NavigationHeaderItem from '../NavigationHeader';
import LoadButton from '../../components/LoadButton';
import Notification from '../Notification';
import UpdateCustomNamespaceInfo from '../../components/CreateUpdateCustomNamespaceInfo';
// import Name from '../../components/UpdateNamespaceCards/Name';
import globalStyles from '../../theme/global.scss';

type Props = {
  match: Object,
  history: Object,
  getNamespaceUsersAccessReducer: Object,
  getProfileReducer: Object,
  updateCustomNamespaceReducer: Object,
  fetchGetNamespaceUsersAccessIfNeeded: (idName: string) => void,
  fetchUpdateCustomNamespaceIfNeeded: (data: Object, idName: string) => void
};

export class UpdateCustomNamespace extends PureComponent<Props> {
  constructor(props) {
    super(props);
    this.state = {
      label: '',
      cpu: '',
      memory: '',
      maxExtServices: '',
      maxIntServices: '',
      maxTraffic: ''
    };
  }
  componentWillMount() {
    const accessToken = cookie.load('accessToken');
    if (!accessToken) {
      this.props.history.push(routerLinks.login);
    }
  }
  componentDidMount() {
    const { fetchGetNamespaceUsersAccessIfNeeded, match } = this.props;
    fetchGetNamespaceUsersAccessIfNeeded(match.params.idName);
  }
  componentWillUpdate(nextProps) {
    const {
      getProfileReducer,
      getNamespaceUsersAccessReducer,
      history
    } = this.props;
    if (
      getProfileReducer.readyStatus !==
        nextProps.getProfileReducer.readyStatus &&
      nextProps.getProfileReducer.readyStatus === GET_PROFILE_SUCCESS
    ) {
      if (nextProps.getProfileReducer.data.role !== 'admin') {
        history.push(routerLinks.namespaces);
      }
    }
    if (
      getNamespaceUsersAccessReducer.readyStatus !==
        nextProps.getNamespaceUsersAccessReducer.readyStatus &&
      nextProps.getNamespaceUsersAccessReducer.readyStatus ===
        GET_NAMESPACE_USERS_ACCESS_SUCCESS
    ) {
      const {
        label,
        max_ext_service,
        max_int_service,
        max_traffic,
        resources
      } = nextProps.getNamespaceUsersAccessReducer.data;
      const { hard } = resources || { cpu: 0, memory: 0 };
      const { cpu, memory: ram } = hard;
      this.setState({
        ...this.state,
        label,
        cpu,
        memory: ram,
        maxExtServices: max_ext_service,
        maxIntServices: max_int_service,
        maxTraffic: max_traffic
      });
    }
  }
  handleSubmitUpdateCustomNamespace = e => {
    e.preventDefault();
    const { fetchUpdateCustomNamespaceIfNeeded, match } = this.props;
    fetchUpdateCustomNamespaceIfNeeded(this.state, match.params.idName);
  };
  handleChangeInput = (type, value) => {
    this.setState({
      ...this.state,
      [`${type}`]: value
    });
  };

  renderUpdateCustomNamespaceSidebar = () => {
    const arrayOfLinks = ['name', 'parameters'];
    return (
      <Scrollspy
        items={arrayOfLinks}
        onUpdate={this.handleUpdateMenu}
        style={{
          padding: '20px 0'
        }}
        currentClassName="active"
      >
        <div className="sideMenuHeader">
          <div
            onClick={() => scrollById('name')}
            onKeyPress={() => scrollById('name')}
            role="presentation"
          >
            name
          </div>
        </div>
        <div className="sideMenuHeader">
          <div
            onClick={() => scrollById('parameters')}
            onKeyPress={() => scrollById('parameters')}
            role="presentation"
          >
            parameters
          </div>
        </div>
      </Scrollspy>
    );
  };
  renderUpdateCustomNamespace = () => {
    const { getNamespaceUsersAccessReducer } = this.props;
    if (
      !getNamespaceUsersAccessReducer.readyStatus ||
      getNamespaceUsersAccessReducer.readyStatus ===
        GET_NAMESPACE_USERS_ACCESS_INVALID ||
      getNamespaceUsersAccessReducer.readyStatus ===
        GET_NAMESPACE_USERS_ACCESS_REQUESTING
    ) {
      return (
        <div className="row">
          <div
            className="col-md-12"
            style={{
              height: '370px',
              backgroundColor: '#f6f6f6'
            }}
          />
        </div>
      );
    }

    if (
      getNamespaceUsersAccessReducer.readyStatus ===
      GET_NAMESPACE_USERS_ACCESS_FAILURE
    ) {
      return <p>Oops, Failed to load data of Project!</p>;
    }

    const {
      label,
      cpu,
      memory,
      maxExtServices,
      maxIntServices,
      maxTraffic
    } = this.state;
    return (
      <UpdateCustomNamespaceInfo
        type="update"
        label={label}
        cpu={cpu}
        memory={memory}
        maxExtServices={maxExtServices}
        maxIntServices={maxIntServices}
        maxTraffic={maxTraffic}
        handleChangeInput={(type, value) => this.handleChangeInput(type, value)}
      />
    );
  };

  render() {
    const { updateCustomNamespaceReducer, match } = this.props;
    return (
      <div>
        <Helmet title="Update Custom Project" />
        <div className="container-fluid breadcrumbNavigation">
          <NavigationHeaderItem
            idName={match.params.idName}
            IdUpdate="namespace"
          />
        </div>
        <Notification
          status={updateCustomNamespaceReducer.status}
          name={updateCustomNamespaceReducer.label}
          method={updateCustomNamespaceReducer.method}
          errorMessage={updateCustomNamespaceReducer.err}
        />
        <div className={globalStyles.contentBlock}>
          <div className={`container ${globalStyles.containerNoBackground}`}>
            <div className="row pageWidth">
              <div
                className="col-md-3 sideMenu"
                style={{ padding: '20px 0px' }}
              >
                {this.renderUpdateCustomNamespaceSidebar()}
              </div>
              <div className="col-md-9 pageContent">
                <form onSubmit={e => this.handleSubmitUpdateCustomNamespace(e)}>
                  <div className="blockContainer blockAddContainerPadin">
                    <div className="col-md-12">
                      {this.renderUpdateCustomNamespace()}
                    </div>
                  </div>
                  <LoadButton
                    type="submit"
                    buttonText="Update project"
                    isFetching={updateCustomNamespaceReducer.isFetching}
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
  ({
    updateCustomNamespaceReducer,
    getNamespaceUsersAccessReducer,
    getProfileReducer
  }: ReduxState) => ({
    updateCustomNamespaceReducer,
    getNamespaceUsersAccessReducer,
    getProfileReducer
  }),
  (dispatch: Dispatch) => ({
    fetchGetNamespaceUsersAccessIfNeeded: (idName: string) =>
      dispatch(
        actionGetNamespaceUsersAccess.fetchGetNamespaceUsersAccessIfNeeded(
          idName
        )
      ),
    fetchUpdateCustomNamespaceIfNeeded: (data: Object, idName: string) =>
      dispatch(
        actionUpdateCustomNamespace.fetchUpdateCustomNamespaceIfNeeded(
          data,
          idName
        )
      )
  })
);

export default connector(UpdateCustomNamespace);
