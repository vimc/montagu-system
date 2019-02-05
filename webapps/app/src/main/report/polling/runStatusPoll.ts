import { createPollingActions, getPollingState } from 'redux-polling';
import { reportActionCreators } from '../actionCreators/reportActionCreators';
import {Dispatch} from "redux";
import {ReportAppState} from "../reducers/reportAppReducers";

const pollingInterval = 5000;
const historyLength = 2;

async function doPoll(dispatch: Dispatch<ReportAppState>, runningKey: string){
    await dispatch(reportActionCreators.pollRunStatus(runningKey));

    //we need to return something here or polling breaks
    return {}
}

export const RunStatusPoll = createPollingActions('runStatusPolling', doPoll, pollingInterval, historyLength);
