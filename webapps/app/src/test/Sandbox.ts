import * as sinon from 'sinon';
import { mount, MountRendererProps, ReactWrapper } from "enzyme";
import { ReactElement } from "react";
import { alt } from "../main/alt";

export class Sandbox {
    sinon: sinon.SinonSandbox;
    mounted: ReactWrapper<any, any>[];

    constructor() {
        this.sinon = sinon.sandbox.create();
        this.mounted = [];
    }

    private record<P, S>(element: ReactWrapper<P, any>) {
        this.mounted.push(element);
        return element;
    }

    mount<P, S>(node: ReactElement<P>, options?: MountRendererProps): ReactWrapper<P, S> {
        return this.record(mount(node, options));
    }

    restore() {
        this.sinon.restore();
        this.mounted.forEach(x => {
            x.unmount();
        });
        this.mounted = [];
        alt.recycle();
    }

    dispatchSpy(): sinon.SinonSpy {
        return this.sinon.spy(alt, "dispatch");
    }
}