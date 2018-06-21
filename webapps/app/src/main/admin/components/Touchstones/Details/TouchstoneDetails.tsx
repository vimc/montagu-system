import {Touchstone} from "../../../../shared/models/Generated";
import * as React from "react";
import {TouchstoneVersionItem} from "./TouchstoneVersionItem";
import {AdminAppState} from "../../../reducers/adminAppReducers";
import {branch, compose, renderComponent} from "recompose";
import {LoadingElement} from "../../../../shared/partials/LoadingElement/LoadingElement";
import {connect} from "react-redux";

interface TouchstoneDetailsProps {
    touchstone: Touchstone;
}

export class TouchstoneDetailsComponent extends React.Component<TouchstoneDetailsProps, undefined> {
    render(): JSX.Element {
        const touchstone = this.props.touchstone;
        return <div className="col-xs-12 col-lg-8">
            <table className="specialColumn">
                <tbody>
                <tr>
                    <td>ID</td>
                    <td>{touchstone.id}</td>
                </tr>
                <tr>
                    <td>Description</td>
                    <td>{touchstone.description}</td>
                </tr>
                <tr>
                    <td>Comment</td>
                    <td>{touchstone.comment}</td>
                </tr>
                </tbody>
            </table>

            <h5 className="mt-5">Versions (latest first)</h5>
            <table>
                <thead>
                <tr>
                    <th>Version</th>
                    <th>Full ID</th>
                    <th>Description</th>
                    <th>Status</th>
                </tr>
                </thead>
                <tbody>
                {touchstone.versions.map(v => <TouchstoneVersionItem key={v.version} {...v} />)}
                </tbody>
            </table>
        </div>;
    }
}

function mapStateToProps(state: AdminAppState): Partial<TouchstoneDetailsProps> {
    return {
        touchstone: state.touchstones.currentTouchstone
    };
};

const enhance = compose(
    connect(mapStateToProps),
    branch((props: TouchstoneDetailsProps) => !props.touchstone, renderComponent(LoadingElement))
);

export const TouchstoneDetails = enhance(TouchstoneDetailsComponent);