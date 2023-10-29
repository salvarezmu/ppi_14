import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {RoutesConstants} from './constants/RoutesConstants';
import TrxTransactionsPage from "./pages/trx-transactions/TrxTransactionsPage";
import BlockTransactionsPage from './pages/block-transactions/BlockTransactionsPage';
import RegisterPage from "./pages/register/RegisterPage";
import LoginPage from "./pages/login/LoginPage";
import HistoryBlock from './pages/block-history/BlockHistoryPage';
import {HomePage} from "./pages/home/HomePage";
import DeleteAccount from "./pages/delete/DeleteAccount";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path={RoutesConstants.LOGIN} element={<LoginPage/>}></Route>
                <Route path={RoutesConstants.REGISTER} element={<RegisterPage/>}></Route>
                <Route path={RoutesConstants.BLOCK_HISTORY} element={<HistoryBlock/>}></Route>
                <Route path={RoutesConstants.BLOCK_TRANSACTIONS} element={<BlockTransactionsPage/>}></Route>
                <Route path={RoutesConstants.TRX_TRANSACTIONS} element={<TrxTransactionsPage/>}></Route>
                <Route path={RoutesConstants.DELETE} element={<DeleteAccount/>}></Route>
                <Route path={RoutesConstants.HOME} element={<HomePage/>}></Route>
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);

reportWebVitals();
