import * as React from "react";
import { expect } from "chai";
import { shallow, ShallowWrapper } from "enzyme";

import { RemoteContent } from "../../main/stores/RemoteContent";
import { RemoteContentComponent } from "../../main/components/RemoteContentComponent/RemoteContentComponent";

const spinner = require("../../main/components/RemoteContentComponent/spinner.gif");

interface Properties extends RemoteContent {
    ready: boolean;
    errorMessage: string;
}

class DummyComponent extends RemoteContentComponent<Properties> {
    renderContent() {
        return <span>Content</span>
    }
}

function render(props: Properties): ShallowWrapper<any, any> {
    return shallow(<DummyComponent {...props} />);
};

describe('DummyComponent', () => {
    it("renders a spinner when content is not ready", () => {
        const rendered = render({ ready: false, errorMessage: "" });
        expect(rendered.contains(<img src={ spinner } />)).to.equal(true);
    });

    it("renders the error message when one is set", () => {
        let rendered = render({ ready: false, errorMessage: "message" });
        expect(rendered.text()).to.equal("message");
        rendered = render({ ready: true, errorMessage: "message" });
        expect(rendered.text()).to.equal("message");
    });

    it("renders the content if it is ready and there is no error message", () => {
        const rendered = render({ ready: true, errorMessage: "" });
        expect(rendered.text()).to.equal("Content");
    });
});