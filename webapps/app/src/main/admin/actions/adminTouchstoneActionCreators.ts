import {Dispatch} from "redux";
import {ResponsibilitySetWithExpectations, Touchstone} from "../../shared/models/Generated";
import {AdminAppState} from "../reducers/adminAppReducers";
import {TouchstonesService} from "../../shared/services/TouchstonesService";
import {
    AllTouchstonesFetched, NewTouchstoneCreated, ResponsibilitiesForTouchstoneVersionFetched, SetCreateTouchstoneError,
    TouchstoneTypes
} from "../../shared/actionTypes/TouchstonesTypes";
import {TouchstoneCreation} from "../components/Touchstones/Create/CreateTouchstoneForm";

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