import './ProfilePage.css';
import SideBarComponent from "../../components/sidebar/SideBarComponent";
import CollaboratorsComponent from "../../components/collaborators/CollaboratorsComponent";

import {Avatar, Button, TextField} from '@mui/material';
import Profile from '../../assets/profile.jpg';
import DeleteAccount from "../../components/delete-account/DeleteAccount";
import React, {useState} from "react";
import {LocalStorageConstants} from "../../constants/LocalStorageConstants";
import {Navigate} from "react-router";
import {RoutesConstants} from "../../constants/RoutesConstants";
import {User} from "../../types/User";

export default function ProfilePage() {

    const user: User = JSON.parse(localStorage.getItem(LocalStorageConstants.USER) as string);
    const [redirectLogOut, setRedirectLogOut] = useState(false);
    const [name, setName] = useState(user.username);
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordConfirmation, setNewPasswordConfirmation] = useState('');

    const logout = (e: any) => {
        localStorage.removeItem(LocalStorageConstants.USER);
        localStorage.removeItem(LocalStorageConstants.ACCESS_TOKEN);
        setRedirectLogOut(true);
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
                        <Button variant="contained" className={"auth-buttons-profile"} onClick={logout}>Log out</Button>
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
                            value={user.email}
                            InputLabelProps={{style: {color: '#47525E'}}}
                        />
                        <div>
                            <Button variant="contained">Actualizar</Button>
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
                            label="Nueva antigua"
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
                        <Button variant="contained">Cambiar</Button>
                    </div>
                </div>
            </div>
            <CollaboratorsComponent/>
            {redirectLogOut ? <Navigate to={RoutesConstants.HOME}/> : <></>}
        </div>
    );
}