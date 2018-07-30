import * as React from "react";
import { shallow } from "enzyme";
import { expect } from "chai";

import "../../../helper";
import { Sandbox } from "../../../Sandbox";
import {createMockStore} from "../../../mocks/mockStore";
import {PageArticle} from "../../../../main/shared/components/PageWithHeader/PageArticle";
import {
    ChooseActionPage,
    ChooseActionPageLocationProps
} from "../../../../main/contrib/components/ChooseAction/ChooseActionPage";
import {chooseActionPageActionCreators} from "../../../../main/contrib/actions/pages/chooseActionPageActionCreators";
import {ChooseActionContent} from "../../../../main/contrib/components/ChooseAction/ChooseActionContent";
import {mockMatch} from "../../../mocks/mocks";

describe("Choose Action Page", () => {

    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    it("renders component on component level, renders title and sub component", () => {
        let testMatch = mockMatch<ChooseActionPageLocationProps>({groupId: "g-1"});
        let store = createMockStore();
        const onLoadStub = sandbox.setStubReduxAction(chooseActionPageActionCreators, "onLoad");
        const rendered = shallow(<ChooseActionPage
            match={testMatch}
        />, {context: {store}}).dive().dive();
        const pageArticle = rendered.find('PageArticle');
        expect(onLoadStub.called).is.equal(true);
        expect(pageArticle.props().title).is.equal("What do you want to do?");
        expect(pageArticle.find(ChooseActionContent).length).is.equal(1);
    });
});

