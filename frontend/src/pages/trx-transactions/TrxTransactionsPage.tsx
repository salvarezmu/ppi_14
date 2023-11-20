import React, {useState, useRef} from "react";
import './TrxTransactionsPage.css'
import {SideBarComponent} from "../../components/sidebar/SideBarComponent";
import CollaboratorsComponent from "../../components/collaborators/CollaboratorsComponent";
import {TRXTransactions} from "../../types/TRXTransaction";
import {CoinSymbolConstants} from "../../constants/CoinSymbolConstants";
import {AxiosUtils} from "../../utils/AxiosUtils";
import {BackendConstants} from "../../constants/BackendConstants";
import {GetTRXBalanceRes} from "../../types/responses/GetTRXBalanceRes";
import {GetTRXTransactionsRes} from "../../types/responses/GetTRXTransactionsRes";
import {
    Backdrop, Button,
    CircularProgress,
    FormControl,
    InputLabel,
    NativeSelect,
    Paper,
    Table,
    TableContainer, TextField
} from "@mui/material";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import {ErrorsConstants} from "../../constants/ErrorsConstants";
import {GenericUtils} from "../../utils/GenericUtils";
import {BasicStatistics} from "../../types/BasicStatistics";
import {useLocation} from "react-router-dom";
import Modal from "react-modal";
import {
    ComposedChart,
    Line,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    BarChart,
    Brush,
    ReferenceLine

  } from 'recharts';
  import html2canvas from "html2canvas";
  import { saveAs } from "file-saver";

const TrxTransactionsPage = () => {

    const stateAddress = useLocation().state?.propAddress;
    const [loading, setLoading] = useState<boolean>(false);
    const [balance, setBalance] = useState<number>(-1);
    const [USDBalance, setUSDBalance] = useState<number>(-1);
    const [currentAddress, setCurrentAddress] = useState<string>(stateAddress || '');
    const [transactions, setTransactions] = useState<TRXTransactions>([]);
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [statistics, setStatistics] = useState<BasicStatistics | null>(null);

    const showBalance = () => {
        if (balance >= 0) {
            return (<div id={"trx-transactions-page-header-balance"}>
                <p>Balance: {`${balance} ${CoinSymbolConstants.TRX}`}</p>
                <p>USD: {USDBalance >= 0 ? USDBalance.toFixed(4) + '$' : 'Inicia sesión para conocerlo.'}</p>
            </div>);
        }
    }

    const getBalances = async (address: string, requiresUSD = false, token: string | null = null): Promise<{
        balance: number,
        USDBalance: number
    }> => {
        const baseUrl: string = `${BackendConstants.GET_TRX_BALANCE}${address}`;
        const balanceData: GetTRXBalanceRes = await AxiosUtils.get<GetTRXBalanceRes>(baseUrl, undefined, {
            requiresUSD,
            token
        });
        return {balance: balanceData.data.balance, USDBalance: balanceData.data.USDBalance || -1};
    }

    const getTransactions = async (address: string, requiresUSD = false, token: string | null = null, startTimestamp?: number, finalTimestamp?: number): Promise<GetTRXTransactionsRes> => {
        const baseUrl: string = `${BackendConstants.GET_TRX_TRANSACTIONS}${address}`;
        return AxiosUtils.get<GetTRXTransactionsRes>(baseUrl, undefined, {
            requiresUSD,
            token,
            startTimestamp,
            finalTimestamp,
        });
    }

    const getDataClickEvent = async () => {
        const login = GenericUtils.resolveLogin()
        const token = login.isLogged ? login.access_token : null;
        await getData(currentAddress, login.isLogged, token);
        const element: any = document.getElementById("set-address-input");
        element && (element.value = '');
    }

    const getData = async (addressParam: string, requiresUSD = false, token: string | null = null) => {
        const address: string = addressParam;
        if (!GenericUtils.validateAddress(addressParam)) {
            window.alert(ErrorsConstants.INVALID_ADDRESS_ERROR);
            return;
        }
        setLoading(true);
        let initTimestamp, finalTimestamp;
        if (startDate) initTimestamp = new Date(startDate).valueOf();
        if (endDate) finalTimestamp = new Date(endDate).valueOf();
        const {balance, USDBalance} = await getBalances(address, requiresUSD, token);
        const transactions = await getTransactions(address, requiresUSD, token, initTimestamp, finalTimestamp);
        setCurrentAddress(address);
        setBalance(balance);
        setUSDBalance(USDBalance);
        setTransactions(transactions.data.transactions);
        setStatistics(transactions.data.statistics);
        setLoading(false);
    }

    const copyOnClipboard = async (e: any) => {
        await navigator.clipboard.writeText(e.target.innerText);
    }

    const buildStatistics = () => {
        if (statistics) {
            return (
                <FormControl sx={{width: '80%', marginTop: '2px'}}>
                    <InputLabel variant="standard" htmlFor="uncontrolled-native">
                        Estadísticas
                    </InputLabel>
                    <NativeSelect
                        inputProps={{
                            name: 'age',
                            id: 'uncontrolled-native',
                        }}
                    >
                        <option></option>
                        <option>Promedio: {`${statistics.average.toFixed(4)}`} TRX</option>
                        <option>Mediana: {`${statistics.med.toFixed(4)}`} TRX</option>
                        <option>Máximo: {`${statistics.maximum.toFixed(4)}`} TRX</option>
                        <option>Mínimo: {`${statistics.minimum.toFixed(4)}`} TRX</option>
                        <option>Suma: {`${statistics.sum.toFixed(4)}`} TRX</option>
                    </NativeSelect>
                </FormControl>
            )
        }
    }

    const downloadAsPng = (element:any) => {
        html2canvas(element).then((canvas) => {
          canvas.toBlob((blob) => {
            if (blob){
                saveAs(blob, "grafico.png");
            }
            
          });
        });
      };

    const [modalIsOpen, setIsOpen] = useState(false);

    function openHistogram() {
        setIsOpen(true);
        };
    
    function closeHistogram() {
        setIsOpen(false);
    }



    const generateGraph = () => {

                const mappedData = transactions.map(item => ({
                    name: item[0],
                    trx: item[1],
                    usd: parseFloat(item[7].toFixed(4))
                  }));

                  const gradientOffset = () => {
                    const dataMax = Math.max(...mappedData.map((i) => i.usd));
                    const dataMin = Math.min(...mappedData.map((i) => i.usd));
                  
                    if (dataMax <= 0) {
                      return 0;
                    }
                    if (dataMin >= 0) {
                      return 1;
                    }
                  
                    return dataMax / (dataMax - dataMin);
                  };
                  
                  const off = gradientOffset();
                    return (
                        <div>
        
                        <ComposedChart
                        width={550}
                        height={470}
                        data={mappedData}
                        style={{marginLeft: '10px', marginTop: '20px'}}
                      >
                        <CartesianGrid stroke="#f5f5f5" />
                        <XAxis dataKey="name" ticks={[0]} scale="auto" /> 
                        <YAxis type="number" domain={['dataMin', 'dataMax']} />
                        <Tooltip />
                        <Legend verticalAlign="top"/>
                        <Bar dataKey="trx" barSize={20} fill="#413ea0" />
                        <Line type="monotone" dataKey="trx" stroke="#ff7300" />
                        <Tooltip />
                      </ComposedChart>

                        <BarChart
                        width={600}
                        height={350}
                        data={mappedData}
                        margin={{
                            top: 10,
                            right: 10,
                            left: 10,
                            bottom: 5,
                        }}
                        >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" ticks={[0]}/>
                        <YAxis />
                        <Tooltip />
                        <Legend  wrapperStyle={{ lineHeight: '40px' }} />
                        <ReferenceLine y={0} stroke="#000" />
                        <Brush  height={30} stroke="#8884d8" />
                        <Bar dataKey="usd" fill="#8884d8" />
                        <Bar dataKey="trx" fill="#82ca9d" />
                        </BarChart>
                        </div>
                      
                    )
            

    }



    const BuildHistogram = () => {
        const ref = useRef<HTMLDivElement>(null);
        if (transactions){
            return (
                <div>
                <Button
                variant="contained"
                onClick={openHistogram}
                style={{marginLeft: '6px', height: '35px', marginTop: '10px', marginBottom: '10px'}}>
                Ver gráfico
                </Button>

                <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeHistogram}
                contentLabel="Gráfico"
                >
                
                <Button
                variant="contained"
                style={{marginLeft: '9px', height: '5%', width: '5%', marginTop: '15px', marginBottom: '10px', backgroundColor: 'red'}}
                onClick={closeHistogram}
                >
                    Cerrar
                </Button>
                <Button onClick={() => downloadAsPng(ref.current)}
                variant="contained"
                style={{marginLeft: '9px', height: '5%', width: '15%', marginTop: '15px', marginBottom: '10px'}}
                >
                    Descargar como PNG
                </Button> 

                <div>
                <div ref={ref}
                style={{marginLeft: '30%'}}>{generateGraph()}</div> 
                </div>

                </Modal>
                </div>
            )
        }
    }

    const buildTable = (isLogged: boolean) => {
        return (
            <TableContainer id={"trx-transactions-page-table"} component={Paper}>
                <Table sx={{minWidth: 650}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            {['TxID', 'Valor', 'USD', 'Fecha', 'Desde', 'Hacia', 'Tipo'].map(cn => {
                                return (<TableCell key={cn}>{cn}</TableCell>);
                            })}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {transactions.map((row) => (
                            <TableRow key={row[0]} sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                                <TableCell style={{maxWidth: 200, overflow: 'hidden', cursor: 'copy'}}
                                           align="left" onClick={copyOnClipboard}>{row[0]}</TableCell>
                                <TableCell align="left">{`${row[1]} ${row[5]}`}</TableCell>
                                <TableCell align="left">{isLogged ? `${row[7].toFixed(4)} $` : ''}</TableCell>
                                <TableCell align="left">{new Date(row[2]).toLocaleDateString()}</TableCell>
                                <TableCell style={{cursor: 'copy', maxWidth: 180, overflow: 'hidden'}} align="left"
                                           onClick={copyOnClipboard}>{row[3]}</TableCell>
                                <TableCell style={{cursor: 'copy', maxWidth: 180, overflow: 'hidden'}} align="left"
                                           onClick={copyOnClipboard}>{row[4]}</TableCell>
                                <TableCell align="left">{row[6]}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }

    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStartDate(e.target.value);
    }

    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEndDate(e.target.value);
    }

    const changeInput = (e: any) => {
        setCurrentAddress(e.target.value)
    }

    const login = GenericUtils.resolveLogin()
    if (login.isLogged && login.user && !currentAddress) {
        setCurrentAddress(stateAddress || login.user.default_address);
        getData(login.user.default_address, true, login.access_token);
    }
    console.log(transactions);
    return (
        <div className={"trx-transactions-page-father"}>
            <SideBarComponent>
            </SideBarComponent>
            <div className={"trx-transactions-page-container"}>
                <div id={"trx-transactions-page-header"}>
                    <div className={"trx-transactions-page-header-info"}>
                        <div className={"trx-transactions-page-header-info-actions"}>
                            <div className={"trx-transactions-page-header-info-actions-input"}>
                                <TextField
                                    style={{marginLeft: '10px'}}
                                    variant="outlined"
                                    onChange={changeInput}
                                />
                                <small style={{marginLeft: '10px'}}>Dirección
                                    actual: {currentAddress}</small>
                            </div>
                            <Button
                                variant="contained"
                                onClick={getDataClickEvent}
                                style={{marginLeft: '5px', height: '35px'}}
                            >
                                Buscar
                            </Button>

                        </div>
                        <div>
                            <input
                                type="date"
                                placeholder="Fecha de inicio"
                                value={startDate}
                                style={{marginTop: '5px', marginLeft: '10px', height: '30px'}}
                                onChange={handleStartDateChange}
                            />
                            <input
                                type="date"
                                style={{marginTop: '5px', marginLeft: '10px', height: '30px'}}
                                placeholder="Fecha de fin"
                                value={endDate}
                                onChange={handleEndDateChange}
                            />
                        </div>
                    </div>
                    {buildStatistics()}
                    {showBalance()}
                    {BuildHistogram()}
                </div>
                <div>
                    {buildTable(login.isLogged)}
                </div>
            </div>
            <CollaboratorsComponent>
            </CollaboratorsComponent>
            <Backdrop
                sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                open={loading}
            >
                <CircularProgress color="inherit"/>
            </Backdrop>
        </div>
    );
}

export default TrxTransactionsPage;
