import * as React from "react";
import {compose} from "recompose";
import {connect} from "react-redux";
import {CoverageUploadMetadata} from "../../../../shared/models/Generated";
import {UncontrolledAlert} from "reactstrap";
import {longTimestamp} from "../../../../shared/Helpers";
import {AdminAppState} from "../../../reducers/adminAppReducers";

interface CoverageProgressProps {
    metadataEntries: CoverageUploadMetadata[]
}

const CoverageProgressComponent: React.FunctionComponent<CoverageProgressProps> = (props: CoverageProgressProps) => {
    return <div>{props.metadataEntries.map(v => <UncontrolledAlert>A coverage set for {v.vaccine}
        was uploaded on {longTimestamp(new Date(v.uploaded_on))} by {v.uploaded_by}</UncontrolledAlert>)}
    </div>
};

export const mapStateToProps = (state: AdminAppState): CoverageProgressProps => {
    return {
        metadataEntries: state.coverage.coverageUploadMetadata
    }
};

export const CoverageProgress = compose(
    connect(mapStateToProps)
)(CoverageProgressComponent);
