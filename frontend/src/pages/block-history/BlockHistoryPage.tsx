import React, {useState} from 'react';
import {
    Backdrop,
    Button,
    CircularProgress,
    createSvgIcon,
    IconButton,
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
import {BackendConstants} from "../../constants/BackendConstants";
import {AxiosUtils} from "../../utils/AxiosUtils";
import {GetBlockHistoryRes} from "../../types/responses/GetBlockHistoryRes";
import './BlockHistoryPage.css';
import {Link} from "react-router-dom";
import {RoutesConstants} from "../../constants/RoutesConstants";
import CallMadeIcon from '@mui/icons-material/CallMade';

const HistoryBlock: React.FC = () => {
    useTheme();
    const [blocksNumber, setBlockNumber] = useState<number | string>('');
    const [blocks, setBlocks] = useState<any[]>([]);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
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
    const getHistoryBlock = async () => {
        try {
            if (!blocksNumber) {
                setError('Por favor, ingresa un número de bloques determinado.');
                return;
            }

            setLoading(true);
            const apiUrl = BackendConstants.GET_BLOCK_HISTORY + blocksNumber;
            const response = await AxiosUtils.get<GetBlockHistoryRes>(apiUrl);
            const data = response.data;

            if (!data || data.blocks.length <= 0) {
                setError(`No se encontraron bloques`);
                setLoading(false);
                return;
            }

            setBlocks(data.blocks);
            setError('');
            setLoading(false);

        } catch (error) {
            setError('Error al obtener los bloques..');
            setLoading(false);
        }
    };

    return (
        <div className={"blocks-page-father"}>
            <SideBarComponent></SideBarComponent>
            <div className="container"> {/* Aplica la clase de contenedor desde el archivo CSS */}
                <Typography style={{marginLeft: '10px'}} variant="h5" gutterBottom>
                    Histórico de bloques:
                </Typography>
                <TextField
                    style={{marginLeft: '10px', width: '20%'}}
                    label="Número de Bloques"
                    type={"number"}
                    InputProps={{inputProps: {min: 0, max: 50}}}
                    variant="outlined"
                    value={blocksNumber}
                    onChange={(e) => setBlockNumber(e.target.value)}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={getHistoryBlock}
                    style={{marginTop: '10px', marginLeft: '5px'}}
                >
                    Obtener Bloques
                </Button>
                <div className={"history-blocks-page-container"}>
                    {error && <Typography style={{marginLeft: '10px'}}variant="h6" color="error">{error}</Typography>}
                    <TableContainer component={Paper} style={{marginTop: '16px'}}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID de Bloque</TableCell>
                                    <TableCell>Numero</TableCell>
                                    <TableCell>Transacciones</TableCell>
                                    <TableCell>Timestamp del Bloque</TableCell>
                                    <TableCell>Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {blocks.map((block, index) => (
                                    <TableRow key={index}>
                                        <TableCell style={{
                                            cursor: 'copy',
                                            maxWidth: 200,
                                            overflow: 'hidden'
                                        }}>{block[0]}</TableCell>
                                        <TableCell>{block[1]}</TableCell>
                                        <TableCell>{block[3]}</TableCell>
                                        <TableCell>{new Date(block[2]).toLocaleString()}</TableCell>
                                        <TableCell>
                                            {block[3] > 0 ? <Link to={RoutesConstants.BLOCK_TRANSACTIONS}
                                                                  state={{blockNumber: block[1]}}
                                                                  style={{width: 'max-content'}}>
                                                <IconButton aria-label="delete">
                                                    <PlusIcon></PlusIcon>
                                                </IconButton>
                                            </Link> : <a href={"https://shasta.tronscan.org/#/block/" + block[1]} target={"_blank"}><IconButton><CallMadeIcon></CallMadeIcon></IconButton></a>}
                                        </TableCell>
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

export default HistoryBlock;