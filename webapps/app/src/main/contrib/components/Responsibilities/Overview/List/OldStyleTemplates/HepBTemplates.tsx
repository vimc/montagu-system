import * as React from "react"

export const CDARazavi = (templatePath: string) => {
    return <ul className="list-unstyled">
        <li>
            <a href={`${templatePath}98-countries-central_burden_template_HepB-CDA-Razavi.csv`}>all 98 countries
                - central</a>
        </li>
        <li>
            <a href={`${templatePath}98-countries-stochastic_burden_template_HepB-CDA-Razavi.csv`}>all 98
                countries - stochastic</a>
        </li>
        <li>
            <a href={`${templatePath}19-countries-central_burden_template_HepB-CDA-Razavi.csv`}>non-gavi with
                current BD_facility - central</a>
        </li>
        <li>
            <a href={`${templatePath}19-countries-stochastic_burden_template_HepB-CDA-Razavi.csv`}>non-gavi with
                current BD_facility - stochastic</a>
        </li>
        <li>
            <a href={`${templatePath}79-countries-central_burden_template_HepB-CDA-Razavi.csv`}>gavi + non-gavi
                without BD_facility - central</a>
        </li>
        <li>
            <a href={`${templatePath}79-countries-stochastic_burden_template_HepB-CDA-Razavi.csv`}>gavi +
                non-gavi without BD_facility - stochastic</a>
        </li>
        <li>
            <a href={`${templatePath}92-countries-central_burden_template_HepB-CDA-Razavi.csv`}>gavi + non-gavi
                with current BD_facility - central</a>
        </li>
        <li>
            <a href={`${templatePath}92-countries-stochastic_burden_template_HepB-CDA-Razavi.csv`}>gavi +
                non-gavi with current BD_facility - stochastic</a>
        </li>
        <li>
            <a href={`${templatePath}73-countries-central_burden_template_HepB-CDA-Razavi.csv`}>gavi countries -
                central</a>
        </li>
        <li>
            <a href={`${templatePath}73-countries-stochastic_burden_template_HepB-CDA-Razavi.csv`}>gavi
                countries - stochastic</a>
        </li>
    </ul>
};

export const ICHallett = (templatePath: string) => {

        return <ul className="list-unstyled">
            <li>
                <a href={`${templatePath}98-countries-central_burden_template_HepB-IC-Hallett.csv`}>all 98 countries
                    - central</a>
            </li>
            <li>
                <a href={`${templatePath}98-countries-stochastic_burden_template_HepB-IC-Hallett.csv`}>all 98
                    countries - stochastic</a>
            </li>
            <li>
                <a href={`${templatePath}19-countries-central_burden_template_HepB-IC-Hallett.csv`}>non-gavi with
                    current BD_facility - central</a>
            </li>
            <li>
                <a href={`${templatePath}19-countries-stochastic_burden_template_HepB-IC-Hallett.csv`}>non-gavi with
                    current BD_facility - stochastic</a>
            </li>
            <li>
                <a href={`${templatePath}79-countries-central_burden_template_HepB-IC-Hallett.csv`}>gavi + non-gavi
                    without BD_facility - central</a>
            </li>
            <li>
                <a href={`${templatePath}79-countries-stochastic_burden_template_HepB-IC-Hallett.csv`}>gavi +
                    non-gavi without BD_facility - stochastic</a>
            </li>
            <li>
                <a href={`${templatePath}92-countries-central_burden_template_HepB-IC-Hallett.csv`}>gavi + non-gavi
                    with current BD_facility - central</a>
            </li>
            <li>
                <a href={`${templatePath}92-countries-stochastic_burden_template_HepB-IC-Hallett.csv`}>gavi +
                    non-gavi with current BD_facility - stochastic</a>
            </li>
            <li>
                <a href={`${templatePath}73-countries-central_burden_template_HepB-IC-Hallett.csv`}>gavi countries -
                    central</a>
            </li>
            <li>
                <a href={`${templatePath}73-countries-stochastic_burden_template_HepB-IC-Hallett.csv`}>gavi
                    countries - stochastic</a>
            </li>
        </ul>
};

export const LI = (templatePath: string) => {
    return <ul className="list-unstyled">
        <li>
            <a href={`${templatePath}98-countries-central_burden_template_HepB-Li.csv`}>98 countries central
                estimates</a>
        </li>
        <li>
            <a href={`${templatePath}98-countries-stochastic_burden_template_HepB-Li.csv`}>98 countries
                stochastic
                estimates</a>
        </li>
    </ul>
};