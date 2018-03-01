import * as React from "react";

interface DatePickerMonthYearFormProps {
    date: Date;
    localeUtils: any;
    onChange: (date: Date) => void;
    fromMonth: Date;
    toMonth: Date;
}

export const DatePickerMonthYearForm : React.StatelessComponent<DatePickerMonthYearFormProps> = (props: DatePickerMonthYearFormProps) => {
    const months = props.localeUtils.getMonths();

    const years = [];
    for (let i = props.fromMonth.getFullYear(); i <= props.toMonth.getFullYear(); i += 1) {
        years.push(i);
    }

    const handleChange = function handleChange(e: any) {
        const { year, month } = e.target.form;
        props.onChange(new Date(year.value, month.value));
    };

    return (
        <form className="DayPicker-Caption">
            <select name="month" onChange={handleChange} value={props.date.getMonth()}>
                {months.map((month: any, i: any) => (
                    <option key={month} value={i}>
                        {month}
                    </option>
                ))}
            </select>
            <select name="year" onChange={handleChange} value={props.date.getFullYear()}>
                {years.map(year => (
                    <option key={year} value={year}>
                        {year}
                    </option>
                ))}
            </select>
        </form>
    );
}
