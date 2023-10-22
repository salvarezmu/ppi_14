import React from "react";
import './HomePage.css'
import { SideBarComponent } from "../../components/sidebar/SideBarComponent";
import CollaboratorsComponent from "../../components/collaborators/CollaboratorsComponent";
import { TRXTransactions } from "../../types/TRXTransaction";
import { CoinSymbolConstants } from "../../constants/CoinSymbolConstants";
import { AxiosUtils } from "../../utils/AxiosUtils";
import { ValidateAddressRes } from "../../types/responses/ValidateAddressRes";
import { BackendConstants } from "../../constants/BackendConstants";
import { GetTRXBalanceRes } from "../../types/responses/GetTRXBalanceRes";
import { GetTRXTransactionsRes } from "../../types/responses/GetTRXTransactionsRes";
import { Backdrop, CircularProgress, Paper, Table, TableContainer } from "@mui/material";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";

interface State {
    loading: boolean;
    balance: number;
    symbol: string;
    current_address: string;
    transactions: TRXTransactions;
    columnNames: Array<string>;
    startDate: string;
    endDate: string;
}

class HomePage extends React.Component<unknown, State> {
    constructor(props: unknown) {
        super(props);
        this.state = {
            loading: false,
            balance: -1,
            symbol: CoinSymbolConstants.TRX,
            current_address: '',
            transactions: [],
            columnNames: ['TxID', 'Valor', 'Fecha', 'Desde', 'Hacia', 'Tipo'],
            startDate: '',
            endDate: '',
        }
    }

    showBalance = () => {
        const balance = this.state.balance;
        if (balance >= 0) {
            return (
                <div id={"home-page-header-balance"}>
                    Balance: {`${balance} ${this.state.symbol}`}
                </div>
            );
        }
    }

    getBalance = async (address: string): Promise<number> => {
        const baseUrl: string = `${BackendConstants.GET_TRX_BALANCE}${address}`;
        const balanceData: GetTRXBalanceRes = await AxiosUtils.get<GetTRXBalanceRes>(baseUrl);
        return balanceData.data.balance;
    }

    getTransactions = async (address: string): Promise<TRXTransactions> => {
        const baseUrl: string = `${BackendConstants.GET_TRX_TRANSACTIONS}${address}`;
        const transactionsData: GetTRXTransactionsRes = await AxiosUtils.get<GetTRXTransactionsRes>(baseUrl);
        return transactionsData.data;
    }

    setData = async (e: any) => {
        e.preventDefault();
        if (e.keyCode === 13 && e.target.value !== '') {
            this.setState({ loading: true });
            const baseUrl: string = `${BackendConstants.VALIDATE_ADDRESS}${e.target.value}`;
            const isValidData: ValidateAddressRes = await AxiosUtils.get<ValidateAddressRes>(baseUrl);
            if (!isValidData.data.isValid) {
                this.setState({ loading: false });
                window.alert('La dirección es inválida.');
                return;
            }
            const address: string = e.target.value;
            const balance = await this.getBalance(address);
            const transactions = await this.getTransactions(address);
            this.setState({ current_address: address, balance, transactions, loading: false });
            const element: any = document.getElementById("set-address-input");
            element && (element.value = '');
        }
    }

    copyOnClipboard = async (e: any) => {
        await navigator.clipboard.writeText(e.target.innerText);
    }

    buildTable = (filteredTransactions: TRXTransactions) => {
        return (
            <TableContainer id={"home-page-table"} component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            {this.state.columnNames.map(cn => {
                                return (<TableCell key={cn}>{cn}</TableCell>);
                            })}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredTransactions.map((row) => (
                            <TableRow key={row[0]} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell style={{ maxWidth: 200, overflow: 'hidden', cursor: 'copy' }}
                                    align="left" onClick={this.copyOnClipboard}>{row[0]}</TableCell>
                                <TableCell align="left">{`${row[1]} ${row[5]}`}</TableCell>
                                <TableCell align="left">{new Date(row[2]).toLocaleDateString()}</TableCell>
                                <TableCell style={{ cursor: 'copy' }} align="left"
                                    onClick={this.copyOnClipboard}>{row[3]}</TableCell>
                                <TableCell style={{ cursor: 'copy' }} align="left"
                                    onClick={this.copyOnClipboard}>{row[4]}</TableCell>
                                <TableCell align="left">{row[6]}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }

    handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ startDate: e.target.value });
    }

    handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ endDate: e.target.value });
    }

    filterTransactions = () => {
        const { startDate, endDate } = this.state;
        const filteredTransactions = this.state.transactions.filter((transaction) => {
            const transactionDate = new Date(transaction[2]);
            if (
                (!startDate || transactionDate >= new Date(startDate)) &&
                (!endDate || transactionDate <= new Date(endDate))
            ) {
                return true;
            }
            return false;
        });
        return filteredTransactions;
    }

    render() {
        return (
            <div className={"home-page-father"}>
                <SideBarComponent>
                </SideBarComponent>
                <div className={"home-page-container"}>
                    <div id={"home-page-header"}>
                        <div id={"home-page-header-info"}>
                            <input
                                id={"set-address-input"}
                                type={"text"}
                                placeholder={"TQNrERHKZEXg..."}
                                title={"Presiona la tecla Enter para buscar."}
                                onKeyUp={this.setData}
                            />
                            <small>Dirección actual: {this.state.current_address}</small>
                            <div>
                                <input
                                    type="date"
                                    placeholder="Fecha de inicio"
                                    value={this.state.startDate}
                                    onChange={this.handleStartDateChange}
                                />
                                <input
                                    type="date"
                                    placeholder="Fecha de fin"
                                    value={this.state.endDate}
                                    onChange={this.handleEndDateChange}
                                />
                                <button onClick={this.filterTransactions}>Filtrar</button>
                            </div>
                        </div>
                        {this.showBalance()}
                    </div>
                    {this.buildTable(this.filterTransactions())}
                </div>
                <CollaboratorsComponent>
                </CollaboratorsComponent>
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={this.state.loading}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            </div>
        );
    }
}

export default HomePage;
