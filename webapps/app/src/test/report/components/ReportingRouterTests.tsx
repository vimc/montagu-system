import * as React from "react";
import { expect } from "chai";
import { render } from "enzyme";
import { Provider } from "react-redux";
import { createMemoryHistory } from 'history';

import "../../helper";
import { ReportingRouter } from "../../../main/report/components/ReportingRouter";
import {createReportStore} from "../../../main/report/stores/createReportStore";

describe("ReportingRouter", () => {
   it("does normal routing when logged in", () => {
       const history = createMemoryHistory({initialEntries: [ '/asd' ]});
       const store = createReportStore(history);

       const rendered = render( <Provider store={store}><ReportingRouter loggedIn={ true } history={history} /></Provider>);

       expect(rendered.find("div.page__title")).has.length(1);
       expect(rendered.find("div.page__title").text()).is.equal("Page not found");
   });

    it("renders LoginPage when logged out", () => {
        const history = createMemoryHistory({initialEntries: ['/']});
        const store = createReportStore(history);

        const rendered = render(<Provider store={store}><ReportingRouter loggedIn={false}
                                                                         history={history}/></Provider>);
        expect(rendered.find("div.page__title")).has.length(1);
        expect(rendered.find("div.page__title").text()).is.equal("Log in");
    });
});