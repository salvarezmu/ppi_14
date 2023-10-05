import React from 'react';
import './test_page.css';
import {Link} from 'react-router-dom';
import {RoutesConstants} from '../../constants/RoutesConstants';

class TestPage extends React.Component {
    render() {
        return <div id="test_page_container">
            <h1>Santiago Álvarez Muñoz</h1>
            <Link to={RoutesConstants.DEFAULT_PAGE}><input type="button" value="Home"/></Link>
        </div>;
    }
}

export default TestPage;