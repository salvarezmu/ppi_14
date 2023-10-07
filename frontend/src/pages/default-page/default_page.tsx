import React from 'react';
import './default_page.css';
import {Link} from 'react-router-dom';
import {RoutesConstants} from '../../constants/RoutesConstants';

class DefaultPage extends React.Component {
    render() {
        return <div id="default_page_container">
            <h1>Hello World</h1>
            <Link to={RoutesConstants.TEST_PAGE}><input type="button" value="Test"/></Link>
        </div>;
    }
}

export default DefaultPage;