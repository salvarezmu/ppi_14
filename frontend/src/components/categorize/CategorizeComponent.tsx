import {
    Alert,
    AlertColor,
    Backdrop,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Snackbar,
    TextField
} from "@mui/material";
import './CategorizeComponent.css';
import React, {useState} from "react";
import {GenericUtils} from "../../utils/GenericUtils";
import {AxiosUtils} from "../../utils/AxiosUtils";
import {BackendConstants} from "../../constants/BackendConstants";
import {TRXTransaction} from "../../types/TRXTransaction";

export default function CategorizeComponent(props: {
    transaction: TRXTransaction,
    openCategorize: boolean,
    setOpenCategorize: (param: boolean) => (void),
}) {
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState('success');

    const categorize = async () => {
        try {
            props.setOpenCategorize(false);
            setLoading(true);
            const login = GenericUtils.resolveLogin()
            const {transaction} = props;
            const body = {
                txId: transaction[0],
                value: transaction[1],
                timestamp: transaction[2],
                fromAddress: transaction[3],
                toAddress: transaction[4],
                description,
                category: category.toLowerCase(),
            }
            await AxiosUtils.post(BackendConstants.CATEGORIZE_TRANSACTION, body, undefined, {token: login.access_token})
            setLoading(false);
            setType('success');
            setMessage('Transacción categorizada.');
        } catch (e: any) {
            props.setOpenCategorize(false);
            setLoading(false);
            setType('error');
            setMessage(e?.response.data.message === 'TRANSACTION_ALREADY_EXISTS_ERROR' ? 'La transacción ya está categorizada.' :
                'Error categorizando tu transacción.')
        }
    }

    return (
        <>
            <Dialog
                open={props.openCategorize}
                onClose={() => props.setOpenCategorize(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Ingresa la información para categorizar tu transacción:
                </DialogTitle>
                <DialogContent>
                    <DialogContentText className="alert-dialog-categorize">
                        <TextField
                            required
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            variant="filled"
                            label="Categoría"
                            InputLabelProps={{style: {color: '#47525E'}}}
                        />
                        <TextField
                            id="outlined-textarea"
                            label="Descripción"
                            placeholder="Descripción"
                            maxRows={8}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            multiline
                        />
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => props.setOpenCategorize(false)}>Cancelar</Button>
                    <Button onClick={categorize} autoFocus>Aceptar</Button>
                </DialogActions>
            </Dialog>
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
        </>
    )
}