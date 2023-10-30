import React, {useState} from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from "@mui/material";
import {LocalStorageConstants} from "../../constants/LocalStorageConstants";
import {AxiosUtils} from "../../utils/AxiosUtils";
import {BackendConstants} from "../../constants/BackendConstants";
import {Navigate} from "react-router";
import {RoutesConstants} from "../../constants/RoutesConstants";

const DeleteAccount = () => {
    const [isConfirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [redirect, setRedirect] = useState(false);

    const handleDeleteAccount = () => {
        AxiosUtils.delete(BackendConstants.DELETE_ACCOUNT, undefined, {
            token: localStorage.getItem(LocalStorageConstants.ACCESS_TOKEN),
        })
            .then(() => {
                // Eliminación exitosa, limpiar el almacenamiento local y\
                // redirigir a una página de inicio de sesión, por ejemplo
                localStorage.removeItem(LocalStorageConstants.USER);
                localStorage.removeItem(LocalStorageConstants.ACCESS_TOKEN);
                setRedirect(true);
                setConfirmDialogOpen(false);
            })
            .catch((error) => {});
    };

    return (
        <div>
            <Button variant="contained" onClick={() => setConfirmDialogOpen(true)}>
                Delete Account
            </Button>
            <Dialog open={isConfirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
                <DialogTitle>Confirm Account Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        ¿Estás seguro que deseas borrar tu cuenta? Esta acción no se puede deshacer.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDialogOpen(false)} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={handleDeleteAccount} color="primary">
                        Borrar cuenta
                    </Button>
                </DialogActions>
            </Dialog>
            {redirect && (<Navigate to={RoutesConstants.REGISTER}/>)}
        </div>
    );
};

export default DeleteAccount;