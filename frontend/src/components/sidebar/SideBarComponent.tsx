import React from "react";
import "./SideBarComponent.css";
import {ModuleNamesConstants} from "../../constants/ModuleNamesConstants";
import {RoutesConstants} from "../../constants/RoutesConstants";
import {Link} from "react-router-dom";

type Module = {
    name: ModuleNamesConstants | string;
    to: RoutesConstants;
}


export class SideBarComponent extends React.Component {
    private readonly modules: Array<Module> = [
        {
            name: ModuleNamesConstants.HOME,
            to: RoutesConstants.HOME_PAGE
        },
        {
            name: ModuleNamesConstants.BLOCK_TRANSACTIONS,
            to: RoutesConstants.BLOCK_TRANSACTIONS,
        },
        {
            name: ModuleNamesConstants.HISTORY_BLOCKS,
            to: RoutesConstants.HISTORY_BLOCKS,
        }
    ]

    render() {
        return (
            <div className={"sidebar"}>
                <h1 className={"sidebar-tittle"}>TRON Pulse</h1>
                {
                    this.modules.map(m => {
                        console.log(m, window.location.pathname);
                        const button_class = m.to === window.location.pathname ? 'current-sidebar-button' : 'sidebar-button';
                        return (
                            <Link to={m.to} key={m.name} className={"sidebar-button-container"}>
                                <input type={"button"} className={button_class} value={m.name}/>
                            </Link>
                        )
                    })
                }
            </div>
        );
    }
}

export default SideBarComponent;