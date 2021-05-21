import * as React from "react";
import {ResponsibilityListItem} from "./ResponsibilityListItem";
import {AnnotatedResponsibility} from "../../../models/AnnotatedResponsibility";

interface ResponsibilityListProps {
    responsibilities: AnnotatedResponsibility[];
    selectResponsibility: (responsibility: AnnotatedResponsibility) => void
}

export const ResponsibilityList: React.FunctionComponent<ResponsibilityListProps> = (props: ResponsibilityListProps) => {
    return <table>
        <thead>
        <tr>
            <th>Scenario</th>
            <th>Disease</th>
            <th>Status</th>
            <th>Latest estimate set</th>
            <th>Comment</th>
        </tr>
        </thead>
        <tbody>
        {props.responsibilities.map(r => <ResponsibilityListItem responsibility={r} selectResponsibility={props.selectResponsibility} key={r.scenario.id}/>)}
        </tbody>
    </table>;
};