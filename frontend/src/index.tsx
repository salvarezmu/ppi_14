import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Transactions from './pages/transactions/transactions';
import {RoutesConstants} from './constants/RoutesConstants';
import ValidateAddress from './pages/validateAdress-page/validate_page';
import Home from './pages/home/home';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path={RoutesConstants.TRANSACTIONS} element={<Transactions/>}></Route>
                <Route path={RoutesConstants.VALIDATE_PAGE} element={<ValidateAddress/>}></Route>
                <Route path={RoutesConstants.HOME} element={<Home/>}></Route>
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);

reportWebVitals();
