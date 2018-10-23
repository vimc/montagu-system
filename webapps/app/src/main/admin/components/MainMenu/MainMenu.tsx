import * as React from "react";

import {PageArticle} from "../../../shared/components/PageWithHeader/PageArticle";
import {PageProperties} from "../../../shared/components/PageWithHeader/PageProperties";
import {ButtonLink} from "../../../shared/components/ButtonLink";

import "./MainMenu.scss"

export class MainMenu extends React.Component<PageProperties<undefined>> {

    static title: string = "Main menu";

    render(): JSX.Element {
        return <PageArticle title={MainMenu.title}>
            Please select which area of Montagu you would like to manage:
            <ol className="admin-menu">
                <li>
                    <ButtonLink href="/modelling-groups/">Modelling groups</ButtonLink>
                </li>
                <li>
                    <ButtonLink href="/touchstones/">Touchstones</ButtonLink>
                </li>
                <li>
                    <ButtonLink href="/users/">Users and permissions</ButtonLink>
                </li>
            </ol>
        </PageArticle>;
    }
}