import {shallow} from "enzyme";
import * as React from "react";

import {MainMenuList} from "../../../main/admin/components/MainMenu/MainMenu";
import {createMockStore} from "../../mocks/mockStore";
import {mockAdminState, mockAuthState} from "../../mocks/mockStates";
import {ButtonLink} from "../../../main/shared/components/ButtonLink";
import {AuthState} from "../../../main/shared/reducers/authReducer";


describe("Admin main menu tests", () => {

    function createStoreWithAuth(auth: Partial<AuthState>) {
        return createMockStore(mockAdminState({
            auth: mockAuthState(auth)
        }));
    }

    it("does not show buttons if user does not have permissions", () => {

        const store = createMockStore(mockAdminState());
        const rendered = shallow(<MainMenuList/>, {context: {store}})
            .dive();
        expect(rendered.find(ButtonLink).length).toEqual(0);

    });

    it("show touchstone button if user has permission", () => {

        const store = createStoreWithAuth({canViewTouchstones: true});

        const rendered = shallow(<MainMenuList/>, {context: {store}})
            .dive();
        const buttons = rendered.find(ButtonLink);
        expect(buttons.length).toEqual(1);
        expect(buttons.first().prop("href")).toEqual("/touchstones/");

    });

    it("show users button if user has permission", () => {

        const store = createStoreWithAuth({canViewUsers: true});

        const rendered = shallow(<MainMenuList/>, {context: {store}})
            .dive(); const buttons = rendered.find(ButtonLink);
        expect(buttons.length).toEqual(1);
        expect(buttons.first().prop("href")).toEqual("/users/");

    });

    it("show groups button if user has permission", () => {

        const store = createStoreWithAuth({canViewGroups: true});

        const rendered = shallow(<MainMenuList/>, {context: {store}})
            .dive();
        const buttons = rendered.find(ButtonLink);
        expect(buttons.length).toEqual(1);
        expect(buttons.first().prop("href")).toEqual("/modelling-groups/");

    });

});
