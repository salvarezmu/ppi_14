import React from "react";
import "./SideBarComponent.css";
import {ModuleNamesConstants} from "../../constants/ModuleNamesConstants";
import {RoutesConstants} from "../../constants/RoutesConstants";
import {Link} from "react-router-dom";
import {Button} from "@mui/material";
import {GenericUtils} from "../../utils/GenericUtils";
import {LocalStorageConstants} from "../../constants/LocalStorageConstants";

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
        }
    ]

    logout = (e: any) => {
        e.preventDefault();
        localStorage.removeItem(LocalStorageConstants.USER);
        localStorage.removeItem(LocalStorageConstants.ACCESS_TOKEN);
        window.location.reload();
    }

    render() {
        const login = GenericUtils.resolveLogin();
        return (
            <div className={"sidebar"}>
                <h1 className={"sidebar-tittle"}>TRON Pulse</h1>
                <div>
                    {
                        this.modules.map(m => {
                            const button_class = m.to === window.location.pathname ? 'current-sidebar-button' : 'sidebar-button';
                            return (
                                <Link to={m.to} key={m.name} className={"sidebar-button-container"}>
                                    <input type={"button"} className={button_class} value={m.name}/>
                                </Link>
                            )
                        })
                    }</div>
                <div className={"sidebar-footer"}>
                    {!login.isLogged ?
                        <>
                            <Link to={RoutesConstants.LOGIN} className={"auth-buttons"}>
                                <Button variant="contained">Login</Button>
                            </Link>
                            <Link to={RoutesConstants.REGISTER} className={"auth-buttons"}>
                                <Button variant="contained">Sign up</Button>
                            </Link>
                        </>
                        :
                        <Button variant="contained" className={"auth-buttons"} onClick={this.logout}>Log out</Button>}
                </div>
            </div>
        );
    }
}

export default SideBarComponent;