import * as React from "react";

import {PageArticle} from "../../../shared/components/PageWithHeader/PageArticle";
import {PageProperties} from "../../../shared/components/PageWithHeader/PageProperties";
import {ButtonLink} from "../../../shared/components/ButtonLink";

const menuStyles = require("./MainMenu.css");

export class MainMenuNew extends React.Component<PageProperties<undefined>> {

    static title: string = "Main menu";

    render(): JSX.Element {
        return <PageArticle title={MainMenuNew.title}>
            Please select which area of Montagu you would like to manage:
            <ol className={menuStyles.menu}>
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