import './ContractsPage.css';
import SideBarComponent from "../../components/sidebar/SideBarComponent";
import {
    Alert,
    Backdrop,
    Button,
    CircularProgress,
    createSvgIcon,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Paper,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from "@mui/material";
import React, {useEffect, useState} from "react";
import CollaboratorsComponent from "../../components/collaborators/CollaboratorsComponent";
import {BackendConstants} from "../../constants/BackendConstants";
import {AxiosUtils} from "../../utils/AxiosUtils";
import {GenericUtils} from "../../utils/GenericUtils";
import {GetAllUserContractsRes} from "../../types/responses/GetAllUserContractsRes";
import {Contract} from "../../types/Contract";
import {Link} from "react-router-dom";
import {RoutesConstants} from "../../constants/RoutesConstants";
import {SaveContractRes} from "../../types/responses/SaveContractRes";

function ContractsPage() {

    const [error, setError] = useState<string>('');
    const [contracts, setContracts] = useState<Array<Contract>>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [message, setMessage] = useState("");

    const PlusIcon = createSvgIcon(
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
        </svg>,
        'Plus',
    );
    useEffect(() => {
        const getContracts = async () => {
            try {
                setLoading(true);
                const login = GenericUtils.resolveLogin()
                const params = {token: login.access_token};
                const apiUrl: string = BackendConstants.GET_ALL_CONTRACTS;
                const response = await AxiosUtils.get<GetAllUserContractsRes>(apiUrl, undefined, params);
                const data = response.data;
                if (!data) {
                    setError(`Error al obtener los contratos.`);
                    setLoading(false);
                    return;
                }

                setContracts(data.contracts);
                setError('');
                setLoading(false);
            } catch (error) {
                setError(`Error al obtener los contratos.`);
                setLoading(false);
            }
        }
        getContracts();
    }, [])

    const saveContact = async (): Promise<void | boolean> => {
        if (!name) return setMessage("Ingresa el nombre del contrato");
        if (!address) return setMessage("Ingresa la dirección del contrato");
        try {
            setOpen(false);
            setLoading(true);
            const login = GenericUtils.resolveLogin()
            const params = {token: login.access_token};
            const apiUrl: string = BackendConstants.SAVE_CONTRACT;
            const body = {address, name}
            const response = await AxiosUtils.post<SaveContractRes>(apiUrl, body, undefined, params);
            const data = response.data;
            if (!data) {
                setMessage(`Error al crear el contrato.`);
                setLoading(false);
                return;
            }
            const newContracts = [...contracts];
            newContracts.push(data.contract);
            setName("");
            setAddress("");
            setContracts(newContracts);
            setLoading(false);
        } catch (error: any) {
            console.log(error)
            if (error?.response?.data?.message === "CONTRACT_ALREADY_EXISTS_ERROR") setMessage("El contrato ya existe.");
            else setMessage(`Error al crear el contrato.`);
            setLoading(false);
            setName("");
            setAddress("");
        }
    }

    return (
        <div className={"categories-page-father"}>
            <SideBarComponent/>
            <div>
                <Typography style={{marginLeft: '10px'}} variant="h5" gutterBottom>
                    Contratos Trc20:
                </Typography>
                <Button
                    onClick={() => setOpen(true)}
                    variant="contained"
                    color="primary"
                    style={{marginTop: '10px', marginLeft: '5px'}}
                >
                    Agregar
                </Button>
                <div>
                    {error && <Typography variant="h6" color="error">{error}</Typography>}
                    {contracts.length > 0 && (
                        <TableContainer component={Paper} style={{marginTop: '16px'}}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Nombre</TableCell>
                                        <TableCell>Dirección</TableCell>
                                        <TableCell>Acciones</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {contracts.map((contract, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{contract.id}</TableCell>
                                            <TableCell>{contract.name}</TableCell>
                                            <TableCell>{contract.address}</TableCell>
                                            <TableCell>
                                                {<Link to={RoutesConstants.TRC20_CONTRACT_TRANSACTIONS}
                                                       state={{id: contract.id}}>
                                                    <IconButton aria-label="delete">
                                                        <PlusIcon></PlusIcon>
                                                    </IconButton>
                                                </Link>}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </div>
            </div>
            <CollaboratorsComponent></CollaboratorsComponent>
            <Backdrop
                sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                open={loading}
            >
                <CircularProgress color="inherit"/>
            </Backdrop>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Guardar contrato:</DialogTitle>
                <DialogContent>
                    <div className={"dialog-create-contract-container"}>
                        <TextField
                            style={{marginLeft: '10px', width: '80%'}}
                            label="Nombre"
                            variant="outlined"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <TextField
                            style={{marginLeft: '10px', width: '80%'}}
                            label="Address"
                            variant="outlined"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button onClick={saveContact} autoFocus>Aceptar</Button>
                </DialogActions>
            </Dialog>
            <Snackbar open={!!message} autoHideDuration={6000} onClose={() => setMessage("")}>
                <Alert severity="warning" sx={{width: '100%'}} onClose={() => setMessage("")}>
                    {message}
                </Alert>
            </Snackbar>
        </div>
    )
}

export default ContractsPage;