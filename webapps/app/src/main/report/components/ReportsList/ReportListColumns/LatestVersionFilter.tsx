import * as React from "react";

import {ChangeEvent} from "react";
import {DateRangePicker} from "../../../../shared/components/DatePicker/DateRangePicker";
import {FilterProps} from "../ReportListTable";

const startDate = new Date("2017-03-01T00:00:00");
const endDate = new Date;

export interface VersionFilterValue {
    start: Date,
    end: Date,
    versionId: string
}

export const ReportLatestVersionFilter: React.SFC<FilterProps<VersionFilterValue>> = (props: FilterProps<VersionFilterValue>) => {

    const value = props.filter ? props.filter.value : {
        start: startDate,
        end: endDate,
        versionId: ""
    };

    const onTextChange = (event: ChangeEvent<HTMLInputElement>) => {
        props.onChange({
            end: value.end,
            start: value.start,
            versionId: event.target.value
        })
    };

    const onStartDateChange = (date: Date) => {
        props.onChange({
            end: value.end,
            start: date,
            versionId: value.versionId
        })
    };

    const onEndDateChange = (date: Date) => {
        props.onChange({
            end: date,
            start: value.start,
            versionId: value.versionId
        })
    };

    return <div>
        <div className={"report-date-filter"}>
        <DateRangePicker value={{end: value.end, start: value.start}}
                         startDate={startDate}
                         endDate={endDate}
                         timeFromSelected={onStartDateChange}
                         timeUntilSelected={onEndDateChange}/>
        </div>
        <input type={"text"} className={"form-control mt-1 "}
               value={value.versionId}
               placeholder="Type to filter by id..."
               onChange={onTextChange}/>
    </div>
};