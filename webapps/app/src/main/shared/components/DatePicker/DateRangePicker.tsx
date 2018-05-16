import * as React from "react";
import {DatePicker} from "./DatePicker";
import {CalendarIcon} from "./Calendar";

interface DateRangePickerProps {
    value: { start: Date, end: Date },
    startDate: Date,
    endDate: Date,
    timeFromSelected: (date: Date) => void;
    timeUntilSelected: (date: Date) => void;
}

export const DateRangePicker: React.StatelessComponent<DateRangePickerProps> = (props: DateRangePickerProps) => (
    <div>
        <div className="d-inline-block date-picker">
            <div className="input-group">
                <div className="input-group-prepend">
                <span className="input-group-text">
                    <CalendarIcon/>
                </span>
                </div>
                <DatePicker
                    onChange={props.timeFromSelected}
                    value={props.value.start}
                    fromMonth={props.startDate}
                    toMonth={props.endDate}
                />
            </div>
        </div>
        <span className="px-2">to</span>
        <div className="d-inline-block date-picker">
            <div className="input-group picker-on-right">
                <div className="input-group-prepend">
                <span className="input-group-text">
                    <CalendarIcon/>
                </span>
                </div>
                <DatePicker
                    onChange={props.timeUntilSelected}
                    value={props.value.end}
                    fromMonth={props.startDate}
                    toMonth={props.endDate}
                />
            </div>
        </div>
    </div>
);