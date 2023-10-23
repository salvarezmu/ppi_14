import React from "react";
import './HomePage.css'
import {SideBarComponent} from "../../components/sidebar/SideBarComponent";
import CollaboratorsComponent from "../../components/collaborators/CollaboratorsComponent";
import {TRXTransactions} from "../../types/TRXTransaction";
import {CoinSymbolConstants} from "../../constants/CoinSymbolConstants";
import {AxiosUtils} from "../../utils/AxiosUtils";
import {ValidateAddressRes} from "../../types/responses/ValidateAddressRes";
import {BackendConstants} from "../../constants/BackendConstants";
import {GetTRXBalanceRes} from "../../types/responses/GetTRXBalanceRes";
import {GetTRXTransactionsRes} from "../../types/responses/GetTRXTransactionsRes";
import {Backdrop, CircularProgress, Paper, Table, TableContainer} from "@mui/material";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import {ErrorsConstants} from "../../constants/ErrorsConstants";
import {GenericUtils} from "../../utils/GenericUtils";


interface State {
    loading: boolean;
    balance: number;
    USDBalance: number;
    symbol: string;
    currentAddress: string;
    transactions: TRXTransactions;
    columnNames: Array<string>;
}

class HomePage extends React.Component<unknown, State> {
    constructor(props: unknown) {
        super(props);
        this.state = {
            loading: false,
            balance: -1,
            USDBalance: -1,
            symbol: CoinSymbolConstants.TRX,
            currentAddress: '',
            transactions: [],
            columnNames: ['TxID', 'Valor', 'Fecha', 'Desde', 'Hacia', 'Tipo'],
        }
    }

    showBalance = () => {
        const balance = this.state.balance;
        const usdBalance = this.state.USDBalance;
        if (balance >= 0) {
            return (<div id={"home-page-header-balance"}>
                <p>Balance: {`${balance} ${this.state.symbol}`}</p>
                {usdBalance >= 0 ? <p>USD: {usdBalance.toFixed(3)} $</p> : <></>}
            </div>);
        }
    }

    getBalances = async (address: string, requiresUSD = false, token: string | null = null): Promise<{
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

    getTransactions = async (address: string, requiresUSD = false, token: string | null = null): Promise<TRXTransactions> => {
        const baseUrl: string = `${BackendConstants.GET_TRX_TRANSACTIONS}${address}`;
        const transactionsData: GetTRXTransactionsRes = await AxiosUtils.get<GetTRXTransactionsRes>(baseUrl, undefined, {
            requiresUSD,
            token
        });
        return transactionsData.data;
    }

    getDataClickEvent = async (e: any) => {
        e.preventDefault();
        if (e.keyCode === 13 && e.target.value !== '') {
            const login = GenericUtils.resolveLogin()
            const token = login.isLogged ? login.access_token : null;
            await this.getData(e.target.value, login.isLogged, token);
            const element: any = document.getElementById("set-address-input");
            element && (element.value = '');
        }
    }

    getData = async (addressParam: string, requiresUSD = false, token: string | null = null) => {
        this.setState({loading: true});
        const baseUrl: string = `${BackendConstants.VALIDATE_ADDRESS}${addressParam}`;
        const isValidData: ValidateAddressRes = await AxiosUtils.get<ValidateAddressRes>(baseUrl, undefined);
        if (!isValidData.data.isValid) {
            this.setState({loading: false});
            window.alert(ErrorsConstants.INVALID_ADDRESS_ERROR);
            return;
        }
        const address: string = addressParam;
        const {balance, USDBalance} = await this.getBalances(address, requiresUSD, token);
        const transactions = await this.getTransactions(address, requiresUSD, token);
        this.setState({currentAddress: address, balance, USDBalance, transactions, loading: false});
    }

    copyOnClipboard = async (e: any) => {
        await navigator.clipboard.writeText(e.target.innerText);
    }

    buildTable = (isLogged: boolean) => {
        return (
            <TableContainer id={"home-page-table"} component={Paper}>
                <Table sx={{minWidth: 650}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            {this.state.columnNames.map(cn => {
                                return (<TableCell key={cn}>{cn}</TableCell>);
                            })}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.transactions.map((row) => (
                            <TableRow key={row[0]} sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                                <TableCell style={{maxWidth: 200, overflow: 'hidden', cursor: 'copy'}}
                                           align="left" onClick={this.copyOnClipboard}>{row[0]}</TableCell>
                                <TableCell align="left">{`${row[1]} ${row[5]}`}</TableCell>
                                {isLogged ? <TableCell align="left">{`${row[7].toFixed(3)} $`}</TableCell>
                                    : <></>}
                                <TableCell align="left">{new Date(row[2]).toLocaleDateString()}</TableCell>
                                <TableCell style={{cursor: 'copy', maxWidth: 180, overflow: 'hidden'}} align="left"
                                           onClick={this.copyOnClipboard}>{row[3]}</TableCell>
                                <TableCell style={{cursor: 'copy', maxWidth: 180, overflow: 'hidden'}} align="left"
                                           onClick={this.copyOnClipboard}>{row[4]}</TableCell>
                                <TableCell align="left">{row[6]}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }

    render() {
        const login = GenericUtils.resolveLogin()
        if (login.isLogged && login.user && !this.state.currentAddress) {
            this.setState({
                currentAddress: login.user.default_address,
                columnNames: ['TxID', 'Valor', 'USD', 'Fecha', 'Desde', 'Hacia', 'Tipo']
            });
            this.getData(login.user.default_address, true, login.access_token);
        }
        return (
            <div className={"home-page-father"}>
                <SideBarComponent>
                </SideBarComponent>
                <div className={"home-page-container"}>
                    <div id={"home-page-header"}>
                        <div id={"home-page-header-info"}>
                            <input id={"set-address-input"} type={"text"} placeholder={"TQNrERHKZEXg..."}
                                   title={"Preciona la tecla Enter para buscar."} onKeyUp={this.getDataClickEvent}/>
                            <small>Dirección actual: {this.state.currentAddress}</small>
                        </div>
                        {this.showBalance()}
                    </div>
                    {this.buildTable(login.isLogged)}
                </div>
                <CollaboratorsComponent>
                </CollaboratorsComponent>
                <Backdrop
                    sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                    open={this.state.loading}
                >
                    <CircularProgress color="inherit"/>
                </Backdrop>
            </div>
        );
    }
}

export default HomePage