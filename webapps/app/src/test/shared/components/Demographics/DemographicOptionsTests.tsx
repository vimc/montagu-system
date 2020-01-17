import * as React from "react";
import { shallow} from "enzyme";

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

    it("renders on connect level", () => {
        const rendered = shallow(<DemographicOptions/>, {context: {store}});
        expect(rendered.props().dataSets).toEqual([testDemographicSet]);
        expect(rendered.props().selectedDataSet).toEqual(testDemographicSet);
        expect(rendered.props().selectedGender).toEqual("both");
        expect(rendered.props().selectedFormat).toEqual("long");
        expect(typeof rendered.props().onSelectDataSet).toEqual("function");
        expect(typeof rendered.props().onSelectGender).toEqual("function");
        expect(typeof rendered.props().onSelectFormat).toEqual("function");
    });

    it("renders on branch level, passes", () => {
        const rendered = shallow(<DemographicOptions/>, {context: {store}}).dive();
        expect(rendered.find(DemographicOptionsComponent).length).toEqual(1);
    });

    it("renders on branch level, not passes", () => {
        store = createMockContribStore({...testState, demographics: {...testState.demographics, dataSets: []}});
        const rendered = shallow(<DemographicOptions/>, {context: {store}}).dive().dive();
        expect(rendered.find(LoadingElement).length).toEqual(1);
    });

    it("renders on component level, renders data sets selection", () => {
        const rendered = shallow(<DemographicOptions/>, {context: {store}}).dive().dive();
        const dataSetSelect = rendered.find('select.form-control');
        expect(dataSetSelect.length).toEqual(1);
        expect(dataSetSelect.props().value).toEqual(testDemographicSet.id);
        const options = dataSetSelect.children();
        expect(options.at(0).props().value).toEqual("");
        expect(options.at(0).props().children).toEqual("- Select -");
        expect(options.at(1).props().value).toEqual(testDemographicSet.id);
        expect(options.at(1).props().children).toEqual(testDemographicSet.name);
    });

    it(
        "renders on component level, on data sets selection, triggers actions",
        () => {
            const rendered = shallow(<DemographicOptions/>, {context: {store}}).dive().dive();
            const dataSetSelect = rendered.find('select.form-control');
            const setDataSetStub = sandbox.setStubReduxAction(demographicActionCreators, "setDataSet");
            dataSetSelect.simulate('change', { target: {value: testDemographicSet.id} });
            expect(setDataSetStub.called).toEqual(true);
            expect(setDataSetStub.getCall(0).args[0]).toEqual(testDemographicSet.id);
        }
    );

    it(
        "renders on component level, renders gender selection component and its props",
        () => {
            const rendered = shallow(<DemographicOptions/>, {context: {store}}).dive().dive();
            const genderControl = rendered.find(GenderControl);
            expect(genderControl.length).toEqual(1);
            expect(genderControl.props().dataSet).toEqual(testDemographicSet);
            expect(genderControl.props().value).toEqual("both");
            expect(typeof genderControl.props().onSelectGender).toEqual("function");
        }
    );

    it(
        "renders on component level, renders gender selection disabled, if no set selected",
        () => {
            store = createMockContribStore({...testState, demographics: {...testState.demographics, selectedDataSet: null}});
            const rendered = shallow(<DemographicOptions/>, {context: {store}}).dive().dive();
            const genderControl = rendered.find(GenderControl);
            expect(genderControl.dive().text()).toEqual("Gender is not applicable / no gender options available");
        }
    );

    it(
        "renders on component level, renders gender selection enabled, if set selected",
        () => {
            const rendered = shallow(<DemographicOptions/>, {context: {store}}).dive().dive();
            const genderControl = rendered.find(GenderControl);
            const genderControlProps = genderControl.dive().props() as RadioButtonGroupProperties;
            expect(genderControlProps.options.length).toEqual(3);
            expect(genderControlProps.options).toEqual([
                { value: 'both', label: 'Both' },
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' }
            ]);
        }
    );

    it(
        "renders on component level, on gender selection, triggers actions",
        () => {
            const rendered = shallow(<DemographicOptions/>, {context: {store}}).dive().dive();
            const genderControlRadioGroup = rendered.find(GenderControl).dive();
            const setGenderStub = sandbox.setStubReduxAction(demographicActionCreators, "setGender");
            const genderControlRadioGroupItems = genderControlRadioGroup.dive();
            const genderControlRadioGroupItems1 = genderControlRadioGroupItems.find('ReactRadioButton').at(0);
            genderControlRadioGroupItems1.simulate('change', { target: {value: "both"} });
            expect(setGenderStub.called).toEqual(true);
            expect(setGenderStub.getCall(0).args[0]).toEqual("both");
        }
    );

    it(
        "renders on component level, renders format selection component and its props",
        () => {
            const rendered = shallow(<DemographicOptions/>, {context: {store}}).dive().dive();
            const formatControl = rendered.find(FormatControl);
            expect(formatControl.length).toEqual(1);
            expect(formatControl.props().value).toEqual(testState.demographics.selectedFormat);
            expect(typeof formatControl.props().onSelectFormat).toEqual("function");
        }
    );

    it("renders on component level, renders format items", () => {
        const rendered = shallow(<DemographicOptions/>, {context: {store}}).dive().dive();
        const formatControl = rendered.find(FormatControl);
        const formatControlProps = formatControl.dive().props() as RadioButtonGroupProperties;
        expect(formatControlProps.options.length).toEqual(2);
        expect(formatControlProps.options).toEqual([
            { value: 'long', label: 'Long' },
            { value: 'wide', label: 'Wide' }
        ]);
    });

    it("renders on component level, renders format tooltip", () => {
        const rendered = shallow(<DemographicOptions/>, {context: {store}}).dive().dive();
        const tooltip = rendered.find(UncontrolledTooltip);
        expect(tooltip.props().target).toEqual("format-tooltip");
    });

    it(
        "renders on component level, on format selection, triggers actions",
        () => {
            const rendered = shallow(<DemographicOptions/>, {context: {store}}).dive().dive();
            const formatControlRadioGroup = rendered.find(FormatControl).dive();
            const setFormatStub = sandbox.setStubReduxAction(demographicActionCreators, "setFormat");
            const formatControlRadioGroupItems = formatControlRadioGroup.dive();
            const formatControlRadioGroupItems1 = formatControlRadioGroupItems.find('ReactRadioButton').at(0);
            formatControlRadioGroupItems1.simulate('change', { target: {value: "long"} });
            expect(setFormatStub.called).toEqual(true);
            expect(setFormatStub.getCall(0).args[0]).toEqual("long");
        }
    );
});