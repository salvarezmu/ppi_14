import SideBarComponent from "../../components/sidebar/SideBarComponent";
import React, {useEffect, useState, useRef} from "react";
import CollaboratorsComponent from "../../components/collaborators/CollaboratorsComponent";
import {
    Backdrop,
    CircularProgress,
    Button,
    createSvgIcon,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import Modal from "react-modal";
import {CategoryTransactions} from "../../types/CategoryTransaction";
import './CategoriesPage.css'
import {GenericUtils} from "../../utils/GenericUtils";
import {BackendConstants} from "../../constants/BackendConstants";
import {AxiosUtils} from "../../utils/AxiosUtils";
import {GetAllCategoriesRes} from "../../types/responses/GetAllCategoriesRes";
import html2canvas from "html2canvas";
import {saveAs} from "file-saver";
import { PieChart, Pie, Cell, Tooltip } from 'recharts';


export function CategoriesPage() {

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState("");
    const [transactions, setTransactions] = useState<CategoryTransactions>([]);
    const [modalIsOpen, setIsOpen] = useState(false);

    const copyOnClipboard = async (e: any) => {
        await navigator.clipboard.writeText(e.target.innerText);
    }

    useEffect(() => {
        const getCategories = async () => {
            try {
                setLoading(true);
                const login = GenericUtils.resolveLogin()
                const params = {token: login.access_token};
                const apiUrl: string = BackendConstants.GET_ALL_CATEGORIES;
                const response = await AxiosUtils.get<GetAllCategoriesRes>(apiUrl, undefined, params);
                const data = response.data;
                if (!data || data.categories.length == 0) {
                    setError(`No tienes transacciones categorizadas`);
                    setLoading(false);
                    return;
                }

                setTransactions(data.categories);
                setError('');
                setLoading(false);
            } catch (error) {
                setError(`Error al obtener los contratos.`);
                setLoading(false);
            }
        }
        getCategories();
    }, [])

    const downloadAsPng = (element: any) => {
        html2canvas(element).then((canvas) => {
            canvas.toBlob((blob) => {
                if (blob) {
                    saveAs(blob, "grafico.png");
                }

            });
        });
    };

    const data01 = [
        { name: 'Group A', value: 400 },
        { name: 'Group B', value: 300 },
        { name: 'Group C', value: 300 },
        { name: 'Group D', value: 200 },
      ];



      const data02 = [
        { name: 'comida', value: 100 },
        { name: 'comida', value: 300 },
        { name: 'comida', value: 100 },
        { name: 'banco', value: 80 },
        { name: 'banco', value: 40 },
        { name: 'banco', value: 30 },
        { name: 'viaje', value: 50 },
        { name: 'viaje', value: 100 },
        { name: 'viaje', value: 200 },
        { name: 'viaje', value: 150 },
        { name: 'viaje', value: 50 },
      ];




    const generateGraph = () => {

        const mappedData = transactions.map(item => ({
            name: item[2], // categoria
            value: item[1]
        }));


        // Crear un objeto para almacenar las sumas por categoría
        const sumasPorCategoria: { [categoria: string]: number } = {};

        // Calcular la suma por categoría
        mappedData.forEach(item => {
            const { name, value } = item;
        sumasPorCategoria[name] = (sumasPorCategoria[name] || 0) + value;
        });

        const SumObj = Object.keys(sumasPorCategoria).map(categoria => ({
            name: categoria,
            value: sumasPorCategoria[categoria],
          }));

        console.log(SumObj)

        return (
            <div>

                <PieChart width={400} height={400}>
                    <Pie data={SumObj} dataKey="value" cx="50%" cy="50%" outerRadius={60} fill="#8884d8" colorInterpolation=""/>
                    <Tooltip/>
                </PieChart>

            </div>

        )

    }

    const BuildGraphModule = () => {
        const ref = useRef<HTMLDivElement>(null);
        if (transactions && transactions.length > 0 ) {
            return (
                <div>
                    <Button
                        variant="contained"
                        onClick={() => setIsOpen(true)}
                        style={{marginLeft: '6px', height: '35px', marginTop: '10px', marginBottom: '10px'}}>
                        Gráfico
                    </Button>

                    <Modal
                        isOpen={modalIsOpen}
                        onRequestClose={() => setIsOpen(false)}
                        contentLabel="Gráfico"
                    >

                        <Button
                            variant="contained"
                            style={{
                                marginLeft: '9px',
                                height: '6%',
                                width: '6%',
                                marginTop: '15px',
                                marginBottom: '10px',
                                backgroundColor: 'red'
                            }}
                            onClick={() => setIsOpen(false)}
                        >
                            Cerrar
                        </Button>
                        <Button onClick={() => downloadAsPng(ref.current)}
                                variant="contained"
                                style={{
                                    marginLeft: '9px',
                                    height: '6%',
                                    width: '17%',
                                    marginTop: '15px',
                                    marginBottom: '10px'
                                }}
                        >
                            Descargar
                        </Button>

                        <div>
                            <div ref={ref} style={{marginLeft: '30%'}}>{generateGraph()}</div>
                        </div>

                    </Modal>
                </div>
            )
        }
    }

    return (
        <div id={"categories-page-father"}>
            <SideBarComponent/>
            <div className="container"> {/* Aplica la clase de contenedor desde el archivo CSS */}
                <h2 style={{margin: '10px 0 5px 10px', padding: 0}}>
                    Transacciones categorizadas:
                </h2>
                {BuildGraphModule()}
                <div>
                    {error && <Typography style={{marginLeft: '10px'}} variant="h6" color="error">{error}</Typography>}
                    <TableContainer sx={{ borderRadius: 0, boxShadow: 0}} component={Paper}>
                        <Table sx={{minWidth: 650}} aria-label="simple table" size={"small"}>
                            <TableHead>
                                <TableRow>
                                    {['TxID', 'Valor', 'USD', 'Fecha', 'Desde', 'Hacia', 'Categoria'].map(cn => {
                                        return (<TableCell key={cn}>{cn}</TableCell>);
                                    })}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {transactions.map((row) => (
                                    <TableRow key={row[0]} sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                                        <TableCell style={{maxWidth: 150, overflow: 'hidden', cursor: 'copy'}}
                                                   align="left" onClick={copyOnClipboard}>{row[0]}</TableCell>
                                        <TableCell align="left">{`${row[1]} TRX`}</TableCell>
                                        <TableCell
                                            align="left">{`${row[7].toFixed(4)} $`}</TableCell>
                                        <TableCell align="left">{new Date(row[6]).toLocaleDateString()}</TableCell>
                                        <TableCell style={{cursor: 'copy', maxWidth: 180, overflow: 'hidden'}}
                                                   align="left"
                                                   onClick={copyOnClipboard}>{row[4]}</TableCell>
                                        <TableCell style={{cursor: 'copy', maxWidth: 180, overflow: 'hidden'}}
                                                   align="left"
                                                   onClick={copyOnClipboard}>{row[5]}</TableCell>
                                        <TableCell align="left">{row[2]}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>
            <CollaboratorsComponent/>
            <Backdrop
                sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                open={loading}
            >
                <CircularProgress color="inherit"/>
            </Backdrop>
        </div>
    )
}