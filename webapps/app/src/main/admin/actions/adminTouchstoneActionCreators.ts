import {Dispatch} from "redux";
import {
    ResponsibilitySetWithComments,
    ResponsibilitySetWithExpectations,
    Touchstone
} from "../../shared/models/APITypes";
import {AdminAppState} from "../reducers/adminAppReducers";
import {TouchstonesService} from "../../shared/services/TouchstonesService";
import {
    AllTouchstonesFetched,
    NewTouchstoneCreated,
    ResponsibilitiesForTouchstoneVersionFetched,
    ResponsibilityCommentsForTouchstoneVersionFetched,
    SetCreateTouchstoneError,
    TouchstoneTypes
} from "../../shared/actionTypes/TouchstonesTypes";
import {TouchstoneCreation} from "../components/Touchstones/Create/CreateTouchstoneForm";
import {AnnotatedResponsibility, AnnotatedResponsibilitySet} from "../models/AnnotatedResponsibility";

export const adminTouchstoneActionCreators = {
    getAllTouchstones() {
        return async (dispatch: Dispatch<AdminAppState>, getState: () => AdminAppState) => {
            const touchstones: Touchstone[] = await (new TouchstonesService(dispatch, getState)).getAllTouchstones();
            dispatch({
                type: TouchstoneTypes.ALL_TOUCHSTONES_FETCHED,
                data: touchstones
            } as AllTouchstonesFetched);
        }
    },

    getResponsibilitiesForTouchstoneVersion(touchstoneVersion: string) {
        return async (dispatch: Dispatch<AdminAppState>, getState: () => AdminAppState) => {
            const responsibilitySets: ResponsibilitySetWithExpectations[] = await (new TouchstonesService(dispatch, getState))
                .getResponsibilitiesForTouchstoneVersion(touchstoneVersion);
            dispatch({
                type: TouchstoneTypes.RESPONSIBILITIES_FOR_TOUCHSTONE_VERSION_FETCHED,
                data: responsibilitySets
            } as ResponsibilitiesForTouchstoneVersionFetched);
        }
    },

    setCurrentTouchstoneResponsibility(responsibility: AnnotatedResponsibility) {
        return {
            type: TouchstoneTypes.SET_CURRENT_TOUCHSTONE_RESPONSIBILITY,
            data: responsibility
        };
    },

    setCurrentTouchstoneResponsibilitySet(responsibilitySet: AnnotatedResponsibilitySet) {
        return {
            type: TouchstoneTypes.SET_CURRENT_TOUCHSTONE_RESPONSIBILITY_SET,
            data: responsibilitySet
        };
    },

    getResponsibilityCommentsForTouchstoneVersion(touchstoneVersion: string) {
        return async (dispatch: Dispatch<AdminAppState>, getState: () => AdminAppState) => {
                const responsibilityCommentSets: ResponsibilitySetWithComments[] = await (new TouchstonesService(dispatch, getState))
                        .getResponsibilityCommentsForTouchstoneVersion(touchstoneVersion);
                dispatch({
                        type: TouchstoneTypes.RESPONSIBILITY_COMMENTS_FOR_TOUCHSTONE_VERSION_FETCHED,
                        data: responsibilityCommentSets
                } as ResponsibilityCommentsForTouchstoneVersionFetched);
            }
    },

    addResponsibilityComment(touchstoneVersion: string, modellingGroupId: string, scenarioId: string, comment: string) {
        return async (dispatch: Dispatch<AdminAppState>, getState: () => AdminAppState) => {
            const service = new TouchstonesService(dispatch, getState);
            const result = await service.addResponsibilityComment(touchstoneVersion, modellingGroupId, scenarioId, comment);
            if (result) {
                service.clearCacheForTouchstoneResponsibilityComments(touchstoneVersion);
                await dispatch(this.getResponsibilityCommentsForTouchstoneVersion(touchstoneVersion));
            }
        }
    },

    addResponsibilitySetComment(touchstoneVersion: string, modellingGroupId: string, comment: string) {
        return async (dispatch: Dispatch<AdminAppState>, getState: () => AdminAppState) => {
            const service = new TouchstonesService(dispatch, getState);
            const result = await service.addResponsibilitySetComment(touchstoneVersion, modellingGroupId, comment);
            if (result) {
                service.clearCacheForTouchstoneResponsibilityComments(touchstoneVersion);
                await dispatch(this.getResponsibilityCommentsForTouchstoneVersion(touchstoneVersion));
            }
        }
    },

    createTouchstone(newTouchstone: TouchstoneCreation) {
        return (dispatch: Dispatch<AdminAppState>, getState: () => AdminAppState) => {
            if (getState().touchstones.touchstones.map(t => t.id)
                    .indexOf(newTouchstone.id) > -1) {

                dispatch({
                    type: TouchstoneTypes.SET_CREATE_TOUCHSTONE_ERROR,
                    data: [{
                        code: "error",
                        message: `Touchstone with id ${newTouchstone.id} already exists. Please choose a unique id.`
                    }]
                } as SetCreateTouchstoneError)
            }

            else {
                // TODO actually create touchstone
                const touchstone: Touchstone = {...newTouchstone, versions: []};
                dispatch({
                    type: TouchstoneTypes.NEW_TOUCHSTONE_CREATED,
                    data: touchstone
                } as NewTouchstoneCreated)
            }
        }
    }
};