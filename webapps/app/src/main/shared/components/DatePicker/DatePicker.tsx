import * as React from "react";
import DayPickerInput from 'react-day-picker/DayPickerInput';
import {
    formatDate,
    parseDate,
} from 'react-day-picker/moment';

import * as moment from "moment";
import {DatePickerMonthYearForm} from "./DatePickerMonthYearForm";

const currentYear = new Date().getFullYear();

interface DatePickerProps {
    onChange: (a: any) => void;
    value: any;
    format?: string;
    showPicker?: boolean;
    fromMonth?: Date;
    toMonth?: Date;
}

interface DatePickerState {
    displayMonthDate: Date;
}

export class DatePicker extends React.Component<DatePickerProps, DatePickerState> {
    constructor() {
        super();
        this.state = {
            displayMonthDate: new Date()
        }
        this.setdisplayMonthDate = this.setdisplayMonthDate.bind(this);
    }

    public static defaultProps: Partial<DatePickerProps> = {
        format: "ll",
        showPicker: false,
        fromMonth: new Date(currentYear - 2, 0),
        toMonth: new Date(currentYear + 2, 0),
    }

    // Fix for the bug of defocusing, should be fixed in future versions
    updateInputRef(ref:any) {
        if (ref) {
            ref.input.focus = function () {}
        }
    }

    setdisplayMonthDate(date: Date) {
        this.setState({
            displayMonthDate: date
        });
    }

    render() :JSX.Element {
        return <DayPickerInput
            ref={this.updateInputRef}
            format={this.props.format}
            onDayChange={this.props.onChange}
            formatDate={formatDate}
            parseDate={parseDate}
            showOverlay={this.props.showPicker}
            dayPickerProps={{
                firstDayOfWeek: 1,
                month: this.state.displayMonthDate,
                fromMonth: this.props.fromMonth,
                toMonth: this.props.toMonth,
                captionElement: (params: any) => {
                    const {date, localeUtils} = params;
                    return <DatePickerMonthYearForm
                        date={date}
                        localeUtils={localeUtils}
                        onChange={this.setdisplayMonthDate}
                        fromMonth={this.props.fromMonth}
                        toMonth={this.props.toMonth}
                    />
                }
            }}
            value={moment(this.props.value).format(this.props.format)}
            inputProps={{className: "form-control-sm form-control"}}
        />;
    }
}

