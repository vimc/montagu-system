import * as React from "react";
import { shallow} from "enzyme";
import { expect } from "chai";
import { Store } from "redux";

import {ContribAppState} from "../../../../main/contrib/reducers/contribAppReducers";
import {mockDemographicDataset} from "../../../mocks/mockModels";
import {RecursivePartial} from "../../../mocks/mockStates";
import {
    DemographicOptions,
    DemographicOptionsComponent
} from "../../../../main/shared/components/Demographics/DemographicOptions";
import {createMockContribStore} from "../../../mocks/mockStore";
import {Sandbox} from "../../../Sandbox";
import {LoadingElement} from "../../../../main/shared/partials/LoadingElement/LoadingElement";
import {demographicActionCreators} from "../../../../main/shared/actions/demographicActionCreators";
import {GenderControl} from "../../../../main/shared/components/Demographics/GenderControl";
import {RadioButtonGroupProperties} from "react-radio-button-group";
import {FormatControl} from "../../../../main/shared/components/FormatControl";
import {UncontrolledTooltip} from "reactstrap";

describe("DemographicOptions", () => {

    const testDemographicSet = mockDemographicDataset();

    const testState: RecursivePartial<ContribAppState> = {
        demographics: {
            dataSets: [testDemographicSet],
            selectedDataSet: testDemographicSet,
            selectedGender: "both",
            selectedFormat: "long",
        }
    };

    let store : Store<ContribAppState>;

    const sandbox = new Sandbox();
    beforeEach(() => {
        store = createMockContribStore(testState);
    });
    afterEach(() => sandbox.restore());

    test("renders on connect level", () => {
        const rendered = shallow(<DemographicOptions/>, {context: {store}});
        expect(rendered.props().dataSets).to.eql([testDemographicSet]);
        expect(rendered.props().selectedDataSet).to.eql(testDemographicSet);
        expect(rendered.props().selectedGender).to.eql("both");
        expect(rendered.props().selectedFormat).to.eql("long");
        expect(typeof rendered.props().onSelectDataSet).to.eql("function");
        expect(typeof rendered.props().onSelectGender).to.eql("function");
        expect(typeof rendered.props().onSelectFormat).to.eql("function");
    });

    test("renders on branch level, passes", () => {
        const rendered = shallow(<DemographicOptions/>, {context: {store}}).dive();
        expect(rendered.find(DemographicOptionsComponent).length).to.eql(1);
    });

    test("renders on branch level, not passes", () => {
        store = createMockContribStore({...testState, demographics: {...testState.demographics, dataSets: []}});
        const rendered = shallow(<DemographicOptions/>, {context: {store}}).dive().dive();
        expect(rendered.find(LoadingElement).length).to.eql(1);
    });

    test("renders on component level, renders data sets selection", () => {
        const rendered = shallow(<DemographicOptions/>, {context: {store}}).dive().dive();
        const dataSetSelect = rendered.find('select.form-control');
        expect(dataSetSelect.length).to.equal(1);
        expect(dataSetSelect.props().value).to.equal(testDemographicSet.id);
        const options = dataSetSelect.children();
        expect(options.at(0).props().value).to.equal("");
        expect(options.at(0).props().children).to.equal("- Select -");
        expect(options.at(1).props().value).to.equal(testDemographicSet.id);
        expect(options.at(1).props().children).to.equal(testDemographicSet.name);
    });

    test(
        "renders on component level, on data sets selection, triggers actions",
        () => {
            const rendered = shallow(<DemographicOptions/>, {context: {store}}).dive().dive();
            const dataSetSelect = rendered.find('select.form-control');
            const setDataSetStub = sandbox.setStubReduxAction(demographicActionCreators, "setDataSet");
            dataSetSelect.simulate('change', { target: {value: testDemographicSet.id} });
            expect(setDataSetStub.called).to.equal(true);
            expect(setDataSetStub.getCall(0).args[0]).to.equal(testDemographicSet.id);
        }
    );

    test(
        "renders on component level, renders gender selection component and its props",
        () => {
            const rendered = shallow(<DemographicOptions/>, {context: {store}}).dive().dive();
            const genderControl = rendered.find(GenderControl);
            expect(genderControl.length).to.equal(1);
            expect(genderControl.props().dataSet).to.eql(testDemographicSet);
            expect(genderControl.props().value).to.eql("both");
            expect(typeof genderControl.props().onSelectGender).to.eql("function");
        }
    );

    test(
        "renders on component level, renders gender selection disabled, if no set selected",
        () => {
            store = createMockContribStore({...testState, demographics: {...testState.demographics, selectedDataSet: null}});
            const rendered = shallow(<DemographicOptions/>, {context: {store}}).dive().dive();
            const genderControl = rendered.find(GenderControl);
            expect(genderControl.dive().text()).to.equal("Gender is not applicable / no gender options available");
        }
    );

    test(
        "renders on component level, renders gender selection enabled, if set selected",
        () => {
            const rendered = shallow(<DemographicOptions/>, {context: {store}}).dive().dive();
            const genderControl = rendered.find(GenderControl);
            const genderControlProps = genderControl.dive().props() as RadioButtonGroupProperties;
            expect(genderControlProps.options.length).to.equal(3);
            expect(genderControlProps.options).to.eql([
                { value: 'both', label: 'Both' },
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' }
            ]);
        }
    );

    test(
        "renders on component level, on gender selection, triggers actions",
        () => {
            const rendered = shallow(<DemographicOptions/>, {context: {store}}).dive().dive();
            const genderControlRadioGroup = rendered.find(GenderControl).dive();
            const setGenderStub = sandbox.setStubReduxAction(demographicActionCreators, "setGender");
            const genderControlRadioGroupItems = genderControlRadioGroup.dive();
            const genderControlRadioGroupItems1 = genderControlRadioGroupItems.find('ReactRadioButton').at(0);
            genderControlRadioGroupItems1.simulate('change', { target: {value: "both"} });
            expect(setGenderStub.called).to.equal(true);
            expect(setGenderStub.getCall(0).args[0]).to.equal("both");
        }
    );

    test(
        "renders on component level, renders format selection component and its props",
        () => {
            const rendered = shallow(<DemographicOptions/>, {context: {store}}).dive().dive();
            const formatControl = rendered.find(FormatControl);
            expect(formatControl.length).to.equal(1);
            expect(formatControl.props().value).to.eql(testState.demographics.selectedFormat);
            expect(typeof formatControl.props().onSelectFormat).to.eql("function");
        }
    );

    test("renders on component level, renders format items", () => {
        const rendered = shallow(<DemographicOptions/>, {context: {store}}).dive().dive();
        const formatControl = rendered.find(FormatControl);
        const formatControlProps = formatControl.dive().props() as RadioButtonGroupProperties;
        expect(formatControlProps.options.length).to.equal(2);
        expect(formatControlProps.options).to.eql([
            { value: 'long', label: 'Long' },
            { value: 'wide', label: 'Wide' }
        ]);
    });

    test("renders on component level, renders format tooltip", () => {
        const rendered = shallow(<DemographicOptions/>, {context: {store}}).dive().dive();
        const tooltip = rendered.find(UncontrolledTooltip);
        expect(tooltip.props().target).to.equal("format-tooltip");
    });

    test(
        "renders on component level, on format selection, triggers actions",
        () => {
            const rendered = shallow(<DemographicOptions/>, {context: {store}}).dive().dive();
            const formatControlRadioGroup = rendered.find(FormatControl).dive();
            const setFormatStub = sandbox.setStubReduxAction(demographicActionCreators, "setFormat");
            const formatControlRadioGroupItems = formatControlRadioGroup.dive();
            const formatControlRadioGroupItems1 = formatControlRadioGroupItems.find('ReactRadioButton').at(0);
            formatControlRadioGroupItems1.simulate('change', { target: {value: "long"} });
            expect(setFormatStub.called).to.equal(true);
            expect(setFormatStub.getCall(0).args[0]).to.equal("long");
        }
    );
});