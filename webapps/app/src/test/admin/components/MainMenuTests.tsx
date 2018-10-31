import {shallow} from "enzyme";
import * as React from "react";
import {expect} from "chai";
import {MainMenuList} from "../../../main/admin/components/MainMenu/MainMenu";
import {createMockStore} from "../../mocks/mockStore";
import {mockAdminState, mockAuthState} from "../../mocks/mockStates";
import {ButtonLink} from "../../../main/shared/components/ButtonLink";


describe("Admin main menu tests", () => {
    
    function createStoreWithPermissions(permissions: string[]) {
        return createMockStore(mockAdminState({
            auth: mockAuthState({
                permissions: permissions
            })
        }));
    }

    it("does not show buttons if user does not have permissions", () => {

        const store = createMockStore(mockAdminState());
        const rendered = shallow(<MainMenuList/>, {context: {store}})
            .dive();
        expect(rendered.find(ButtonLink).length).to.eq(0);

    });

    it("show touchstone button if user has permission", () => {

        const store = createStoreWithPermissions(["*/touchstones.read"]);

        const rendered = shallow(<MainMenuList/>, {context: {store}})
            .dive();
        const buttons = rendered.find(ButtonLink);
        expect(buttons.length).to.eq(1);
        expect(buttons.first().prop("href")).to.eq("/touchstones/");

    });

    it("show users button if user has permission", () => {

        const store = createStoreWithPermissions(["*/users.read"]);

        const rendered = shallow(<MainMenuList/>, {context: {store}})
            .dive(); const buttons = rendered.find(ButtonLink);
        expect(buttons.length).to.eq(1);
        expect(buttons.first().prop("href")).to.eq("/users/");

    });

    it("show groups button if user has permission", () => {

        const store = createStoreWithPermissions(["*/modelling-groups.read"]);

        const rendered = shallow(<MainMenuList/>, {context: {store}})
            .dive();
        const buttons = rendered.find(ButtonLink);
        expect(buttons.length).to.eq(1);
        expect(buttons.first().prop("href")).to.eq("/modelling-groups/");

    });

});