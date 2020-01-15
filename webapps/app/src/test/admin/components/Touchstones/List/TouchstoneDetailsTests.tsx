import {shallow} from "enzyme";
import {expect} from "chai";
import * as React from "react";
import {
    TouchstoneDetails,
    TouchstoneDetailsComponent
} from "../../../../../main/admin/components/Touchstones/Details/TouchstoneDetails";
import {createMockAdminStore} from "../../../../mocks/mockStore";
import {AdminTouchstoneState} from "../../../../../main/admin/reducers/adminTouchstoneReducer";
import {LoadingElement} from "../../../../../main/shared/partials/LoadingElement/LoadingElement";
import {mockTouchstone} from "../../../../mocks/mockModels";

describe("TouchstoneDetails", () => {
    test("renders loading element if no current touchstone", () => {
        const touchstones: Partial<AdminTouchstoneState> = {
            currentTouchstone: null
        };
        const store = createMockAdminStore({ touchstones: touchstones});
        const rendered = shallow(<TouchstoneDetails />, {context: {store}}).dive().dive();
        expect(rendered.find(LoadingElement)).to.have.length(1);
    });

    test("renders content if current touchstone", () => {
        const touchstones: Partial<AdminTouchstoneState> = {
            currentTouchstone: mockTouchstone()
        };
        const store = createMockAdminStore({ touchstones: touchstones});
        const rendered = shallow(<TouchstoneDetails />, {context: {store}}).dive();
        expect(rendered.find(TouchstoneDetailsComponent)).to.have.length(1);
    });
});