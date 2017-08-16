import axios from 'axios';
import { browserHistory } from 'react-router';

import {
    SUPPORT_REQUEST,
    SUPPORT_SUCCESS,
    SUPPORT_FAILURE
} from '../../constants/SupportConstants';

export function sendSupport(data) {
    return dispatch => {
        dispatch(requestGetCreateDeployment());
        return axios.post(
            'http://web.containerum.io/omnidesk',
            data,
            {
                headers: {
                    'Accept': '*/*',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'X-Requested-With'
                },
                validateStatus: (status) => status >= 200 && status <= 505
            }
        )
        .then(response => {
            if (response.status === 200) {
                console.log(response.data);
                dispatch(receiveGetCreateDeployment(response.data));
                browserHistory.push('/SuccessTicket?num=' + response.data.case.case_id);
            } else {
                console.log(response.data.message);
                dispatch(failGetCreateDeployment(response.data.message));
            }
        }).catch(err => console.log(err));
    };
}

function requestGetCreateDeployment() {
    return {
        type: SUPPORT_REQUEST,
        isFetching: true
    };
}

function receiveGetCreateDeployment(data) {
    return {
        type: SUPPORT_SUCCESS,
        isFetching: false,
        data
    };
}

function failGetCreateDeployment(error) {
    return {
        type: SUPPORT_FAILURE,
        isFetching: false,
        error
    };
}
