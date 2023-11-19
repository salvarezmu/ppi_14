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
import ContractsPage from "./pages/contracts/ContractsPage";
import {CategoriesPage} from "./pages/categories/CategoriesPage";
import {CategoriesDetailPage} from "./pages/categories/detail/CategoriesDetailPage";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <BrowserRouter>
        <Routes>
            <Route path={RoutesConstants.CATEGORIZED_TRANSACTIONS_DETAIL} element={<CategoriesDetailPage/>}/>
            <Route path={RoutesConstants.CATEGORIZED_TRANSACTIONS} element={<CategoriesPage/>}/>
            <Route path={RoutesConstants.TRC20_CONTRACTS} element={<ContractsPage/>}/>
            <Route path={RoutesConstants.LOGIN} element={<LoginPage/>}></Route>
            <Route path={RoutesConstants.REGISTER} element={<RegisterPage/>}></Route>
            <Route path={RoutesConstants.BLOCK_HISTORY} element={<HistoryBlock/>}></Route>
            <Route path={RoutesConstants.BLOCK_TRANSACTIONS} element={<BlockTransactionsPage/>}></Route>
            <Route path={RoutesConstants.TRX_TRANSACTIONS} element={<TrxTransactionsPage/>}></Route>
            <Route path={RoutesConstants.DELETE} element={<DeleteAccount/>}></Route>
            <Route path={RoutesConstants.HOME} element={<HomePage/>}></Route>
        </Routes>
    </BrowserRouter>
);

reportWebVitals();
