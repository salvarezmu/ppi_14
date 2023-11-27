import React from "react";
import './LoginPage.css';
import {Backdrop, Button, CircularProgress, TextField} from "@mui/material";
import {AxiosUtils} from "../../utils/AxiosUtils";
import {LoginRes} from "../../types/responses/LoginRes";
import {BackendConstants} from "../../constants/BackendConstants";
import {LocalStorageConstants} from "../../constants/LocalStorageConstants";
import {GenericUtils} from "../../utils/GenericUtils";
import {Navigate} from 'react-router';
import {RoutesConstants} from "../../constants/RoutesConstants";

interface State {
    loading: boolean;
    redirect: boolean;
}

class LoginPage extends React.Component<unknown, State> {
    constructor(props: unknown) {
        super(props);
        this.state = {
            loading: false,
            redirect: false,
        }
    }

    login = async (e: any) => {
        e.preventDefault();
        const email: string = e.target.email.value;
        const password: string = e.target.password.value;
        this.setState({loading: true});
        try {
            const body = {email: email.toLowerCase(), password}
            const loginResponse: LoginRes = await AxiosUtils.post<LoginRes>(BackendConstants.LOGIN, body);
            localStorage.setItem(LocalStorageConstants.ACCESS_TOKEN, loginResponse.data.access_token);
            localStorage.setItem(LocalStorageConstants.USER, JSON.stringify(loginResponse.data.user));
            this.setState({loading: false, redirect: true});
        } catch (e: any) {
            console.log(e);
            this.setState({loading: false});
            const message: string = GenericUtils.resolveError(e);
            window.alert(message);
        }
    }

    render() {
        return (
            <div className={"login-page-father"}>
                <form className={"login-page-form"} onSubmit={this.login}>
                    <h2>Iniciar sesión</h2>
                    <TextField className={"login-page-input"}
                               required
                               id="login-page-email"
                               label="Correo"
                               name={"email"}
                               type={"email"}
                    />
                    <TextField className={"login-page-input"}
                               required
                               name={"password"}
                               id="login-page-password"
                               label="Contraseña"
                    />
                    <Button variant="contained" className={"login-page-input"} type={"submit"}>Aceptar</Button>
                </form>
                <Backdrop
                    sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                    open={this.state.loading}
                >
                    <CircularProgress color="inherit"/>
                </Backdrop>

                {this.state.redirect && (<Navigate to={RoutesConstants.HOME}/>)}
            </div>
        );
    }
}

export default LoginPage;