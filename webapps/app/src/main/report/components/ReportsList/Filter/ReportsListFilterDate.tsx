import * as React from "react";

import {ReportsFilterFields} from "../../../actionTypes/ReportsActionsTypes";
import {DatePicker} from "../../../../shared/components/DatePicker/DatePicker";
import {CalendarIcon} from "../Calendar";

interface ReportsListFilterProps {
    filterData: ReportsFilterFields;
    timeFromSelected: (date: Date) => void;
    timeUntilSelected: (date: Date) => void;
}

const fromMonth = new Date("2017-03-01T00:00:00");
const toMonth = new Date;

export const ReportsListFilterDate: React.StatelessComponent<ReportsListFilterProps> = (props: ReportsListFilterProps) => (
    <div className={"col-12 col-lg-6"}>
        <div className="report-time-filters">
            <div className={"row"}>
                <div className="col">
                    <label className={"mb-0 small font-weight-bold"}>From</label>
                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                        <span className="input-group-text">
                            <CalendarIcon/>
                        </span>
                        </div>
                        <DatePicker
                            onChange={props.timeFromSelected}
                            value={props.filterData.timeFrom ? new Date(props.filterData.timeFrom) : fromMonth}
                            fromMonth={fromMonth}
                            toMonth={toMonth}
                        />
                    </div>
                </div>
                <div className="col">
                    <label className={"mb-0 small font-weight-bold"}> Until</label>
                    <div className="input-group mb-3 picker-on-right">
                        <div className="input-group-prepend">
                        <span className="input-group-text">
                            <CalendarIcon/>
                        </span>
                        </div>
                        <DatePicker
                            onChange={props.timeUntilSelected}
                            value={props.filterData.timeUntil ? new Date(props.filterData.timeUntil) : toMonth}
                            fromMonth={fromMonth}
                            toMonth={toMonth}
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
);
