import React from "react";
import {Backdrop, Button, Checkbox, CircularProgress, FormControlLabel, TextField} from "@mui/material";
import {Navigate} from "react-router";
import {RoutesConstants} from "../../constants/RoutesConstants";
import './RegisterPage.css';
import {AxiosUtils} from "../../utils/AxiosUtils";
import {BackendConstants} from "../../constants/BackendConstants";
import {LocalStorageConstants} from "../../constants/LocalStorageConstants";
import {GenericUtils} from "../../utils/GenericUtils";
import {ErrorsConstants} from "../../constants/ErrorsConstants";
import {RegisterRes} from "../../types/responses/RegisterRes";
import DataTreatment from "../../components/data-treatment/DataTreatment";

interface State {
    loading: boolean;
    redirect: boolean;
    acceptPolicy: boolean;
    anchorEl: HTMLElement | null;
    showDataTreatment: boolean;
}

class RegisterPage extends React.Component<unknown, State> {
    constructor(props: unknown) {
        super(props);
        this.state = {
            loading: false,
            redirect: false,
            acceptPolicy: false,
            anchorEl: null,
            showDataTreatment: false,
        };
    }

    register = async (e: any) => {
        e.preventDefault();
        const username: string = e.target.name.value;
        const email: string = e.target.email.value;
        const password: string = e.target.password.value;
        const passwordConfirmation: string = e.target.password_confirmation.value;
        this.setState({loading: true});
        try {
            if (!this.state.acceptPolicy) {
                this.setState({loading: false});
                window.alert("Debes aceptar las políticas de tratamiento de datos.");
                return;
            }

            if (password !== passwordConfirmation) {
                this.setState({loading: false});
                window.alert(ErrorsConstants.PASSWORDS_ARE_DIFFERENT);
                return;
            }

            const body = {username: username.toLowerCase(), email: email.toLowerCase(), password};
            const registerResponse: RegisterRes = await AxiosUtils.post<RegisterRes>(BackendConstants.REGISTER, body);
            localStorage.setItem(LocalStorageConstants.ACCESS_TOKEN, registerResponse.data.access_token);
            localStorage.setItem(LocalStorageConstants.USER, JSON.stringify(registerResponse.data.user));
            this.setState({loading: false, redirect: true});
        } catch (e: any) {
            this.setState({loading: false});
            const message: string = GenericUtils.resolveError(e);
            window.alert(message);
        }
    };

    handleCheckboxChange = () => {
        this.setState({acceptPolicy: !this.state.acceptPolicy});
    };


    render() {

        return (
            <div className={"register-page-father"}>
                <form className={"register-page-form"} onSubmit={this.register} autoComplete={"off"}>
                    <h2>Crear una cuenta de TRON Pulse</h2>
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
                    <FormControlLabel
                        control={<Checkbox
                            checked={this.state.acceptPolicy}
                            onChange={this.handleCheckboxChange}
                        />
                        }

                        label={<p className={"p-data-trearment"} onClick={() => this.setState({showDataTreatment: true})}>
                            Acepto las políticas de tratamiento de datos
                        </p>}
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
                    sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                    open={this.state.loading}
                >
                    <CircularProgress color="inherit"/>
                </Backdrop>
                {this.state.redirect && <Navigate to={RoutesConstants.HOME}/>}
                {this.state.showDataTreatment ?
                    <DataTreatment close={() => this.setState({showDataTreatment: false})}></DataTreatment> : <></>}
            </div>
        );
    }
}

export default RegisterPage;
