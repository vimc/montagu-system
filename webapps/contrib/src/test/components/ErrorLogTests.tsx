import { setupVirtualDOM } from "../JSDomHelpers";
setupVirtualDOM();
import * as React from "react";
import { shallow } from "enzyme";
import { expect } from "chai";

import { ErrorLog } from "../../main/components/ErrorLog/ErrorLog";

describe("ErrorLog", () => {
   it("is hidden when there are no errors", () => {
       const rendered = shallow(<ErrorLog errors={ [] } />);
       expect(rendered.text()).to.be.empty;
   });

   it("it renders each error", () => {
       const errors = [ "a", "b" ];
       const rendered = shallow(<ErrorLog errors={ errors } />);
       const items = rendered.find("li");
       expect(items).to.have.length(2);
       expect(items.at(0).text()).to.equal("a");
       expect(items.at(1).text()).to.equal("b");
   });
});