import React, { useState } from "react";
import { Backdrop, Button, CircularProgress, TextField, Checkbox, FormControlLabel, Popover, Typography } from "@mui/material";
import { Navigate } from "react-router";
import { RoutesConstants } from "../../constants/RoutesConstants";
import DataTreatment from "../DataTreatment/DataTreatment";
import './RegisterPage.css';
import { LoginRes } from "../../types/responses/LoginRes";
import { AxiosUtils } from "../../utils/AxiosUtils";
import { BackendConstants } from "../../constants/BackendConstants";
import { LocalStorageConstants } from "../../constants/LocalStorageConstants";
import { GenericUtils } from "../../utils/GenericUtils";
import { ErrorsConstants } from "../../constants/ErrorsConstants";
import { RegisterRes } from "../../types/responses/RegisterRes";
import {Link} from "react-router-dom";

interface State {
    loading: boolean;
    redirect: boolean;
    acceptPolicy: boolean;
    anchorEl: HTMLElement | null;
}

class RegisterPage extends React.Component<unknown, State> {
    constructor(props: unknown) {
        super(props);
        this.state = {
            loading: false,
            redirect: false,
            acceptPolicy: false,
            anchorEl: null,
        };
    }

    register = async (e: any) => {
        e.preventDefault();
        const username: string = e.target.name.value;
        const email: string = e.target.email.value;
        const password: string = e.target.password.value;
        const passwordConfirmation: string = e.target.password_confirmation.value;
        const defaultAddress: string = e.target.address.value;
        this.setState({ loading: true });
        try {
            if (!this.state.acceptPolicy) {
                this.setState({ loading: false });
                window.alert("Debes aceptar las políticas de tratamiento de datos.");
                return;
            }

            if (password !== passwordConfirmation) {
                this.setState({ loading: false });
                window.alert(ErrorsConstants.PASSWORDS_ARE_DIFFERENT);
                return;
            }

            const body = { username, email, password, defaultAddress };
            const registerResponse: RegisterRes = await AxiosUtils.post<RegisterRes>(BackendConstants.REGISTER, body);
            localStorage.setItem(LocalStorageConstants.ACCESS_TOKEN, registerResponse.data.access_token);
            localStorage.setItem(LocalStorageConstants.USER, JSON.stringify(registerResponse.data.user));
            this.setState({ loading: false, redirect: true });
        } catch (e: any) {
            console.log(e);
            this.setState({ loading: false });
            const message: string = GenericUtils.resolveError(e);
            window.alert(message);
        }
    };

    handleCheckboxChange = () => {
        this.setState({ acceptPolicy: !this.state.acceptPolicy });
    };


    render() {

        return (
            <div className={"register-page-father"}>
                <form className={"register-page-form"} onSubmit={this.register}>
                    <h2>Registro de usuario</h2>
                    <TextField
                        className={"register-page-input"}
                        required
                        id="register-page-name"
                        label="Nombre de usuario"
                        name={"name"}
                        type={"text"}
                    />
                    <TextField
                        className={"register-page-input"}
                        required
                        id="register-page-email"
                        label="Correo"
                        name={"email"}
                        type={"email"}
                    />
                    <TextField
                        className={"register-page-input"}
                        required
                        name={"password"}
                        id="register-page-password"
                        label="Contraseña"
                    />
                    <TextField
                        className={"register-page-input"}
                        required
                        name={"password_confirmation"}
                        id="register-page-password-confirmation"
                        label="Confirma contraseña"
                    />
                    <TextField
                        className={"register-page-input"}
                        required
                        name={"address"}
                        id="register-page-address"
                        label="Address"
                    />
                    <FormControlLabel
                        control={<Checkbox
                            checked={this.state.acceptPolicy}
                            onChange={this.handleCheckboxChange}
                        />
                        }
                        
                        label={<Link to ={RoutesConstants.DATA_TREAT}>
                            Acepto las políticas de tratamiento de datos
                        </Link>}
                    />

                    <Button
                        variant="contained"
                        className={"register-page-input"}
                        type={"submit"}
                        disabled={!this.state.acceptPolicy}
                    >
                        Aceptar
                    </Button>
                </form>
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={this.state.loading}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
                {this.state.redirect && <Navigate to={RoutesConstants.HOME} />}
            </div>
        );
    }
}

export default RegisterPage;
