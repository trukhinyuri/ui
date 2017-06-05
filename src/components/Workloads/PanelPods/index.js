import React, { Component } from 'react';
import TR from './TR';
import axios from 'axios';

export default class PanelPods extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageSize: 2,
            data_pods: []
        };
    }
    componentDidMount() {
        axios.get('http://web.api.containerum.io:5000/api/pods')
        .then(response => {
            this.setState({data_pods: response.data});
            console.log(this.state.data_pods)
        })
        .catch(function (error) {
            console.log(error);
        });
    }
    render() {
        const loader = (
            <tr><th>Error with data receiving</th></tr>
        );
        return (
        <div className='panel panel-default'>
            <div className='panel-heading'>
                <h3 className='panel-title'>Pods</h3>
            </div>
            <div className='panel-body'>
                <table className='table table-hover'>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Name</th>
                            <th>Status</th>
                            <th>Restarts</th>
                            <th>Age</th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.data_pods === '' ? loader : <TR data={this.state.data_pods} pageSize={this.state.pageSize}/>}
                    </tbody>
                </table>
            </div>
        </div>
        );
    }
}
