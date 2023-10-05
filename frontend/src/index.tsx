import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import DefaultPage from './pages/default-page/default_page';
import TestPage from './pages/test-page/test_page';
import {RoutesConstants} from './constants/RoutesConstants';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path={RoutesConstants.TEST_PAGE} element={<TestPage/>}></Route>
                <Route path={RoutesConstants.DEFAULT_PAGE} element={<DefaultPage/>}></Route>
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);

reportWebVitals();
