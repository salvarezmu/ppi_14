import React, {useState} from 'react';
import {
    Backdrop,
    Button,
    CircularProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
    useTheme,
} from '@mui/material';
import SideBarComponent from "../../components/sidebar/SideBarComponent";
import CollaboratorsComponent from "../../components/collaborators/CollaboratorsComponent";
import {useLocation} from "react-router-dom";
import './BlockTransactionsPage.css';
import {BackendConstants} from "../../constants/BackendConstants";
import {AxiosUtils} from "../../utils/AxiosUtils";
import {GetBlockTransactionsRes} from "../../types/responses/GetBlockTransactionsRes";
import {BlockTransactions} from "../../types/Block";
import {GenericUtils} from "../../utils/GenericUtils";

const BlockTransactionsPage = () => {
    useTheme();


    const blockNumberParam = useLocation().state?.blockNumber;
    const [blockNumber, setBlockNumber] = useState<number | string>(blockNumberParam ?? '');
    const [transactions, setTransactions] = useState<BlockTransactions>([]);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(blockNumberParam && transactions.length === 0);
    const login = GenericUtils.resolveLogin()
    const [foundParamOneTime, setFoundParamOneTime] = useState(false);
    const getBlockTransactionsButton = async () => {
        setLoading(true);
        await getBlockTransactions();
    }

    const getBlockTransactions = async () => {
        try {
            if (!blockNumber) {
                setError('Por favor, ingresa un número de bloque.');
                return;
            }
            const apiUrl = BackendConstants.GET_BLOCK_TRANSACTIONS + blockNumber;
            const params = {requiresUSD: login.isLogged, token: login.access_token};
            const response = await AxiosUtils.get<GetBlockTransactionsRes>(apiUrl, undefined, params);
            const data = response.data;
            if (!data || data.transactions.length <= 0) {
                setError(`No se encontraron transacciones en el bloque #${blockNumber}`);
                setLoading(false);
                return;
            }

            setTransactions(data.transactions);
            setError('');
            setLoading(false);
            if (blockNumberParam) setFoundParamOneTime(true);
        } catch (error) {
            setError('Error al obtener las transacciones.');
            setLoading(false);
        }
    };

    if (blockNumberParam && transactions.length === 0 && !foundParamOneTime) getBlockTransactions();

    return (
        <div className={"transactions-page-father"}>
            <SideBarComponent></SideBarComponent>
            <div className="container"> {/* Aplica la clase de contenedor desde el archivo CSS */}
                <h2 style={{margin: '10px 0 5px 10px', padding: 0}}>
                    Transacciones de un bloque:
                </h2>
                <TextField
                    style={{marginLeft: '10px', width: '20%'}}
                    label="Número del bloque:"
                    type={"number"}
                    InputProps={{inputProps: {min: 0}}}
                    variant="outlined"
                    value={blockNumber}
                    onChange={(e) => setBlockNumber(e.target.value)}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={getBlockTransactionsButton}
                    style={{marginTop: '10px', marginLeft: '5px'}}
                >
                    Obtener Transacciones
                </Button>
                <div>
                    {error && <Typography style={{marginLeft: '10px'}} variant="h6" color="error">{error}</Typography>}
                    <TableContainer sx={{ borderRadius: 0, boxShadow: 0}} component={Paper} style={{marginTop: '16px'}}>
                        <Table size={"small"}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID de Transacción</TableCell>
                                    <TableCell>Costo</TableCell>
                                    <TableCell>USD</TableCell>
                                    <TableCell>Fecha</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {transactions.map((transaction, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{transaction[0]}</TableCell>
                                        <TableCell>{transaction[1]}</TableCell>
                                        <TableCell>{login.isLogged ? transaction[3].toFixed(4) + ' $' : ''}</TableCell>
                                        <TableCell>{new Date(transaction[2]).toLocaleString()}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>
            <CollaboratorsComponent></CollaboratorsComponent>
            <Backdrop
                sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                open={loading}
            >
                <CircularProgress color="inherit"/>
            </Backdrop>
        </div>
    );
};

export default BlockTransactionsPage;