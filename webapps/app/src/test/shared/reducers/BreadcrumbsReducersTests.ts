import { expect } from "chai";

import {breadcrumbsReducer} from "../../../main/shared/reducers/breadcrumbsReducer";
import {BreadcrumbsTypes} from "../../../main/shared/actionTypes/BreadrumbsTypes";

describe('Breadcrumb reducer tests', () => {
    it('sets breadcrumb', () => {
        const breadcrumbs = [{name: "A", url: "a"}]
        expect(breadcrumbsReducer(undefined, {
            type: BreadcrumbsTypes.BREADCRUMBS_RECEIVED,
            data: breadcrumbs
        })).to.eql({
            breadcrumbs
        })
    })
})