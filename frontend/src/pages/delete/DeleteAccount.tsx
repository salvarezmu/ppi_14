import React, { useState } from "react";
import Axios from "axios";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { LocalStorageConstants } from "../../constants/LocalStorageConstants";

const DeleteAccount = () => {
  const [isConfirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const handleDeleteAccount = () => {
    Axios.delete("/api/v1/users/delete-account", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(LocalStorageConstants.ACCESS_TOKEN)}`,
      },
    })
      .then((response) => {
        // Eliminación exitosa, limpiar el almacenamiento local y redirigir a una página de inicio de sesión, por ejemplo
        localStorage.removeItem(LocalStorageConstants.USER);
        localStorage.removeItem(LocalStorageConstants.ACCESS_TOKEN);
        window.location.href = "/login"; // Redirección a la página de inicio de sesión
      })
      .catch((error) => {
        // Manejar errores, mostrar mensajes de error, etc.
      });
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
            Are you sure you want to delete your account? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteAccount} color="primary">
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DeleteAccount;