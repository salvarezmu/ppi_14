import React, {useState} from "react";
import {
    Backdrop,
    Button,
    CircularProgress,
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
import './DeleteAccount.css';

const DeleteAccount = () => {
    const [isConfirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [redirect, setRedirect] = useState(false);
    const [loading, setLoading] = useState(false);
    const handleDeleteAccount = () => {
        setConfirmDialogOpen(false);
        setLoading(true);
        AxiosUtils.delete(BackendConstants.DELETE_ACCOUNT, undefined, {
            token: localStorage.getItem(LocalStorageConstants.ACCESS_TOKEN),
        })
            .then(() => {
                // Eliminación exitosa, limpiar el almacenamiento local y\
                // redirigir a una página de inicio de sesión, por ejemplo
                localStorage.removeItem(LocalStorageConstants.USER);
                localStorage.removeItem(LocalStorageConstants.ACCESS_TOKEN);
                setLoading(false);
                setRedirect(true);
            })
            .catch((error) => {
                setLoading(false);
            });
    };

    return (<>
            <Button variant="contained" className={"auth-buttons-profile-delete"}
                    onClick={() => setConfirmDialogOpen(true)}>
                Delete Account
            </Button>
            <div>

                <Dialog open={isConfirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
                    <DialogTitle>Confirmar la eliminación de la cuenta</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            ¿Estás seguro que deseas borrar tu cuenta?
                        </DialogContentText>
                        <DialogContentText>
                            Esta acción no se puede deshacer.
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
            <Backdrop
                sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                open={loading}
            >
                <CircularProgress color="inherit"/>
            </Backdrop>
        </>
    );
};

export default DeleteAccount;