import { shallow, ShallowWrapper } from "enzyme";
import { expect } from "chai";
import {
    ChooseActionContentComponent,
    ChooseActionContentProps
} from "../../../../main/contrib/components/Group/ChooseActionContent";
import { mockModellingGroup, mockTouchstone } from "../../../mocks/mockModels";
import * as React from "react";
import { TouchstoneList } from "../../../../main/contrib/components/Group/TouchstoneList";
import { GroupList } from "../../../../main/contrib/components/Group/GroupList";
import { ButtonLink } from "../../../../main/shared/components/ButtonLink";

function render(props: ChooseActionContentProps): ShallowWrapper<any, any> {
    return shallow(<ChooseActionContentComponent { ...props } />);
}
function makeProps(properties: any) {
    return Object.assign({
        ready: true,
        touchstones: null,
        chosenTouchstone: null,
        chosenGroup: null,
        groups: null
    }, properties);
}

function checkButton(expectEnabled: boolean, props: ChooseActionContentProps): ShallowWrapper<any, any> {
    const rendered = render(props);
    const button = rendered.find(ButtonLink);
    expect(button.prop("disabled")).to.equal(!expectEnabled);
    if (!expectEnabled) {
        expect(button.prop("href")).to.be.null;
    }
    return button;
}

describe("ChooseGroupContentComponent", () => {
    it("renders TouchstoneList", () => {
        const touchstones = [ mockTouchstone(), mockTouchstone() ];
        const props = makeProps({
            touchstones: touchstones,
            chosenTouchstone: touchstones[0]
        });
        const rendered = render(props);
        const list = rendered.find(TouchstoneList);
        expect(list.length).to.equal(1);
        expect(list.props()).to.eql({
            touchstones: touchstones,
            selected: touchstones[0],
            ready: true
        });
    });

    it("renders GroupList when there are some groups", () => {
        const groups = [ mockModellingGroup(), mockModellingGroup() ];
        const props = makeProps({});

        let rendered = render(props);
        expect(rendered.find(GroupList).length).to.equal(0);

        props.groups = groups;
        props.chosenGroup = groups[1];
        rendered = render(props);
        const list = rendered.find(GroupList);
        expect(list.length).to.equal(1, "Expected to find a GroupList");
        expect(list.props()).to.eql({
            groups: groups,
            selected: groups[1],
            ready: true
        });
    });

    it("button is enabled when group and touchstone have been chosen", () => {
        checkButton(false, makeProps({}));
        checkButton(false, makeProps({ chosenTouchstone: mockTouchstone() }));
        checkButton(false, makeProps({ chosenGroup: mockModellingGroup() }));
        const enabledButton = checkButton(true, makeProps({
            chosenTouchstone: mockTouchstone({ id: "tId" }),
            chosenGroup: mockModellingGroup({ id: "gId" })
        }));
        expect(enabledButton.prop("href")).to.equal("/gId/responsibilities/tId/");
    });
});