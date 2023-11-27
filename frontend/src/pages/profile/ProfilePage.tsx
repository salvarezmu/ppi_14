import './ProfilePage.css';
import SideBarComponent from "../../components/sidebar/SideBarComponent";
import CollaboratorsComponent from "../../components/collaborators/CollaboratorsComponent";

import {Alert, AlertColor, Avatar, Backdrop, Button, CircularProgress, Snackbar, TextField} from '@mui/material';
import Profile from '../../assets/profile.jpg';
import DeleteAccount from "../../components/delete-account/DeleteAccount";
import React, {useState} from "react";
import {LocalStorageConstants} from "../../constants/LocalStorageConstants";
import {Navigate} from "react-router";
import {RoutesConstants} from "../../constants/RoutesConstants";
import {User} from "../../types/User";
import {GenericUtils} from "../../utils/GenericUtils";
import {AxiosUtils} from "../../utils/AxiosUtils";
import {UpdateUserRes} from "../../types/responses/UpdateUserRes";
import {BackendConstants} from "../../constants/BackendConstants";

export default function ProfilePage() {

    const user: User = JSON.parse(localStorage.getItem(LocalStorageConstants.USER) as string);
    const [redirectLogOut, setRedirectLogOut] = useState(false);
    const [name, setName] = useState(user ? user.username : '');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordConfirmation, setNewPasswordConfirmation] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState('success');
    const logout = () => {
        localStorage.removeItem(LocalStorageConstants.USER);
        localStorage.removeItem(LocalStorageConstants.ACCESS_TOKEN);
        setRedirectLogOut(true);
    }

    const updateName = async () => {
        try {
            setLoading(true);
            const login = GenericUtils.resolveLogin()
            const body = {username: name.toLowerCase()}
            const response = await AxiosUtils.patch<UpdateUserRes>(BackendConstants.UPDATE_USER, body, undefined, {token: login.access_token})
            if (!response) {
                throw 'Error';
            }
            localStorage.setItem(LocalStorageConstants.USER, JSON.stringify(response.data.user));
            setLoading(false);
            setType('success');
            setMessage('Datos actualizados.')
            window.location.reload();
        } catch (e) {
            setLoading(false);
            setType('error');
            setMessage('Se produjo un error actualizando tu información.')
        }
    }

    const updatePassword = async () => {
        try {
            setLoading(true);
            const login = GenericUtils.resolveLogin()
            const body = {password, newPassword};
            await AxiosUtils.patch<UpdateUserRes>(BackendConstants.UPDATE_PASSWORD, body, undefined, {token: login.access_token})
            setType('success');
            setMessage('Contraseña actualizada.')
            setLoading(false);
            window.location.reload();
        } catch (e: any) {
            setLoading(false);
            setType('error');
            setMessage(e?.response.data.message ? 'La contraseña que ingresaste es incorrecta.' : 'Se produjo un error actualizando tu contraseña.')
            console.log(e);
        }
    }

    return (
        <div className={"profile-page-father"}>
            <SideBarComponent/>
            <div className={"profile-page-container"}>
                <div className={"profile-page-avatar-container"}>
                    <div>
                        <Avatar
                            alt="Remy Sharp"
                            src={Profile}
                            sx={{width: 200, height: 200}}
                        />
                    </div>
                    <div className={"profile-page-buttons-login"}>
                        <Button variant="contained" className={"auth-buttons-profile"} onClick={logout}>Cerrar
                            sesión</Button>
                        <DeleteAccount></DeleteAccount>
                    </div>
                </div>
                <div className={"profile-page-data-container"}>
                    <div>
                        <h3>Perfil</h3>
                        <hr style={{marginRight: 20}}/>
                    </div>
                    <div className={"profile-page-data-name-container"}>
                        <TextField
                            className={"profile-page-form-input"}
                            required
                            variant="filled"
                            label="Nombre"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            InputLabelProps={{style: {color: '#47525E'}}}
                        />
                        <TextField
                            className={"profile-page-form-input"}
                            required
                            variant="filled"
                            disabled
                            value={user ? user.email : ''}
                            InputLabelProps={{style: {color: '#47525E'}}}
                        />
                        <div>
                            {!name || !user || name.toLowerCase() === user.username ?
                                <Button
                                    variant="contained"
                                    disabled
                                >Actualizar</Button>
                                : <Button variant="contained" onClick={updateName}>Actualizar</Button>}


                        </div>
                    </div>
                    <div>
                        <h4>Actualizar contraseña</h4>
                        <hr style={{marginRight: 20}}/>
                    </div>
                    <div className={"profile-page-data-name-container"}>
                        <TextField
                            className={"profile-page-form-input"}
                            required
                            variant="filled"
                            label="Contraseña antigua"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            InputLabelProps={{style: {color: '#47525E'}}}
                        />
                        <TextField
                            className={"profile-page-form-input"}
                            required
                            variant="filled"
                            label="Nueva contraseña"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            InputLabelProps={{style: {color: '#47525E'}}}
                        />
                        <TextField
                            className={"profile-page-form-input"}
                            required
                            variant="filled"
                            label="Confirma contraseña"
                            value={newPasswordConfirmation}
                            onChange={(e) => setNewPasswordConfirmation(e.target.value)}
                            InputLabelProps={{style: {color: '#47525E'}}}
                        />
                        {!password || !newPassword || !newPasswordConfirmation || newPassword !== newPasswordConfirmation || password === newPassword ?
                            <Button variant="contained" disabled>Cambiar</Button>
                            : <Button variant={"contained"} onClick={updatePassword}>Cambiar</Button>
                        }

                    </div>
                </div>
            </div>
            <CollaboratorsComponent/>
            {redirectLogOut ? <Navigate to={RoutesConstants.HOME}/> : <></>}
            <Backdrop
                sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                open={loading}
            >
                <CircularProgress color="inherit"/>
            </Backdrop>

            <Snackbar open={!!message} autoHideDuration={6000} onClose={() => setMessage('')}>
                <Alert onClose={() => setMessage('false')} severity={type as AlertColor} sx={{width: '100%'}}>
                    {message}
                </Alert>
            </Snackbar>
        </div>
    );
}