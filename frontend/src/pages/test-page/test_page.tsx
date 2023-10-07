import React from 'react';
import './test_page.css';
import {Link} from 'react-router-dom';
import {RoutesConstants} from '../../constants/RoutesConstants';
import {AxiosUtils} from '../../utils/AxiosUtils';
import {BackendConstants} from '../../constants/BackendConstants';

class TestPage extends React.Component {

    async test_django(): Promise<void> {
        const data = await AxiosUtils.get<{ id: string, name: string, email: string }>(BackendConstants.TEST_DJANGO);
        console.log(data);
    }

    render() {
        return <div id="test_page_container">
            <h1>Santiago Álvarez Muñoz</h1>
            <input type="button" value="Test DJango" onClick={this.test_django}/>
            <Link to={RoutesConstants.DEFAULT_PAGE}><input type="button" value="Home"/></Link>
        </div>;
    }
}

export default TestPage;