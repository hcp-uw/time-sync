import styles from './navbar.css';
import { Link, NavLink } from 'react-router-dom';


import joinImage from '../images/joinImage.png';
import createImage from '../images/createImage.png';
import logo from '../images/ee.svg';

function Header() {
    return (
        <nav>
            <Link to="/" className="title">
                {/* <img src={logo}></img> */}
                <h1>TimeSync</h1>
            </Link>
            <ul>
                <li>
                    <img src={joinImage} alt="Join" />
                    <NavLink to="/join">Join</NavLink>
                </li>
                <li>
                    <img src={createImage} alt="Create" />
                    <NavLink to="/create">Create</NavLink>
                </li>
            </ul>
            <div class="placeholder"></div>
        </nav>
    );
}

export default Header

/*
shifted around a shit load of things
added folders for images, components, pages
imported router and implemented into app with routes
all index.js needs to do is render app.js which will actually implement other componenets
app.js has all the routes and links front to backend i think
*/