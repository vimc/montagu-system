import * as React from "react";
import { expect } from "chai";
import { shallow, ShallowWrapper } from "enzyme";

import { RemoteContent } from "../../../main/shared/models/RemoteContent";
import { RemoteContentComponent } from "../../../main/shared/components/RemoteContentComponent/RemoteContentComponent";

const spinner = require("../../../main/shared/components/RemoteContentComponent/spinner.gif");

class DummyComponent extends RemoteContentComponent<RemoteContent> {
    renderContent() {
        return <span>Content</span>
    }
}

function render(props: RemoteContent): ShallowWrapper<any, any> {
    return shallow(<DummyComponent {...props} />);
};

describe('DummyComponent', () => {
    it("renders a spinner when content is not ready", () => {
        const rendered = render({ ready: false });
        expect(rendered.contains(<img src={ spinner } />)).to.equal(true);
    });

    it("renders the content if it is ready", () => {
        const rendered = render({ ready: true });
        expect(rendered.text()).to.equal("Content");
    });
});