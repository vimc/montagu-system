import * as sinon from 'sinon';
import {mount, MountRendererProps, ReactWrapper} from "enzyme";

import { ReactElement } from "react";
import { alt } from "../main/shared/alt";
import fetcher from "../main/shared/sources/Fetcher";

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

    fetcherSpy(): sinon.SinonSpy {
        return this.sinon.spy(fetcher.fetcher, "fetch");
    }

    stubFetch(obj: any, method: string): sinon.SinonStub {
        return this.sinon.stub(obj, method).returns(Promise.resolve(true));
    }

    setSpy(obj: any, method: string): sinon.SinonSpy {
        return this.sinon.spy(obj, method);
    }

    setStub(obj: any, method: string): sinon.SinonStub {
        return this.sinon.stub(obj, method);
    }

    createSpy(): sinon.SinonSpy {
        return this.sinon.spy();
    }
}