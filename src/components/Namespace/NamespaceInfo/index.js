import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import n from '../../../images/n.png';
import { deleteNamespace } from "../../../actions/NamespaceActions/deleteNamespaceAction";
import Notification from '../../Notification';
import DeleteModal from '../../CustomerModal/DeleteModal';
import NavLink from '../../../containers/NavLink';

class NamespaceInfo extends Component {
    constructor() {
        super();
        this.state = {
            isOpened: false,
            NSName: ''
        }
    }
    handleClickDeletingNamespace(idName) {
        this.setState({
            isOpened: true,
            NSName: idName
        });
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.DeleteNamespaceReducer) {
            this.setState({
                ...this.state,
                NSName: '',
                isOpened: false
            });
        }
        if (nextProps.DeleteNamespaceReducer.isFetching === false &&
	        nextProps.DeleteNamespaceReducer.status === 202 &&
	        nextProps.DeleteNamespaceReducer.idName &&
	        nextProps.DeleteNamespaceReducer.idName !==
	        this.props.DeleteNamespaceReducer.idName) {
	        browserHistory.push('/Namespaces');
        }
    }
    render() {
        // const NamespacesReducer = this.props.NamespacesReducer.data ? this.props.NamespacesReducer.data : [];

	    let isFetchingNamespaceInfo = '';
	    if (!this.props.NamespacesReducer.isFetching &&
		    !this.props.DeleteNamespaceReducer.isFetching) {
		    const currentNSArr = this.props.NamespacesReducer.data.find(item => {
			    if (item.name === this.props.idName) {
				    return item;
			    }
		    });
		    if (typeof currentNSArr === 'undefined') {
		       browserHistory.push('/Namespaces');
		    }
		    const NSname = currentNSArr ? currentNSArr.name : '';
		    const NSmemory = currentNSArr ? currentNSArr.memory : '';
		    const NSmemoryLimit = currentNSArr ? currentNSArr.memory_limit : '';
		    const NScpu = currentNSArr ? currentNSArr.cpu : '';
		    const NScpuLimit = currentNSArr ? currentNSArr.cpu_limit : '';
		    let volumeSize = '-';
		    let volumeUsed = '-';
		    if (currentNSArr) {
			    if (currentNSArr.volume_size || currentNSArr.volume_used) {
				    volumeSize = currentNSArr.volume_size;
				    volumeUsed = currentNSArr.volume_used;
			    }
		    }
		    isFetchingNamespaceInfo =
                <div className="content-block-container content-block_common-statistic container">
                    <div className="content-block-header">
                        <div className="content-block-header-label">
                            <div className="content-block-header-label__text content-block-header-label_main">{NSname}</div>
                            <div className="content-block-header-label__descript">namespace</div>
                        </div>
                        <div className="content-block-header-extra-panel">
                            <div className="content-block-header-extra-panel dropdown no-arrow">
                                <i
                                    className="content-block-header__more ion-more dropdown-toggle"
                                    data-toggle="dropdown"
                                    aria-haspopup="true"
                                    aria-expanded="false"
                                > </i>
                                <ul className="dropdown-menu dropdown-menu-right" role="menu">
                                    <NavLink
                                        className="dropdown-item"
                                        to={`/Namespaces/${this.props.idName}/Resize`}
                                    >Resize</NavLink>
                                    <button
                                        className="dropdown-item text-danger"
                                        onClick={name => this.handleClickDeletingNamespace(this.props.idName)}
                                    >Delete</button>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="content-block-content">
                        <div className="content-block__r-img"><img src={n} /></div>
                        <div className="content-block__info-item">
                            <div className="content-block__info-name">RAM ( Usage / Total ) : </div>
                            <div className="content-block__info-text">{NSmemory} / {NSmemoryLimit} MB</div>
                        </div>
                        <div className="content-block__info-item">
                            <div className="content-block__info-name">CPU ( Usage / Total ) : </div>
                            <div className="content-block__info-text">{NScpu} / {NScpuLimit} m</div>
                        </div>
                        <div className="content-block__info-item">
                            <div className="content-block__info-name">Volume ( Usage / Total ) :</div>
                            <div className="content-block__info-text">{volumeUsed} / {volumeSize} {volumeSize !== '-' ? 'GB': ''}</div>
                        </div>
                    </div>
                </div>
	    } else {
		    isFetchingNamespaceInfo =
                <div
                    className="container"
                    style={{
                        padding: '0',
                        marginTop: '17px',
                        marginBottom: '30px',
                        backgroundColor: 'transparent'
                    }}>
                    <img src={require('../../../images/ns-dep.svg')} style={{width: '100%'}}/>
                </div>;
	    }
        return (
            <div>
                <Notification
                    status={this.props.DeleteNamespaceReducer.status}
                    name={this.props.DeleteNamespaceReducer.idName}
                    errorMessage={this.props.DeleteNamespaceReducer.errorMessage}
                />
                <div className="content-block">
                    { isFetchingNamespaceInfo }
                </div>

                <DeleteModal
                    type="Namespace"
                    name={this.state.NSName}
                    isOpened={this.state.isOpened}
                    onHandleDelete={this.props.onDeleteNamespace}
                />
            </div>
        );
    }
}

NamespaceInfo.propTypes = {
    params: PropTypes.object
};

function mapStateToProps(state) {
    return {
        NamespacesReducer: state.NamespacesReducer,
        DeleteNamespaceReducer: state.DeleteNamespaceReducer
    };

}

const mapDispatchToProps = (dispatch) => {
    return {
        onDeleteNamespace: (idName) => {
            dispatch(deleteNamespace(idName));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(NamespaceInfo);
