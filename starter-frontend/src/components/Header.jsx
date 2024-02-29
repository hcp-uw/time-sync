import styles from './navbar.css';  
import { Link, NavLink } from 'react-router-dom';


import joinImage from '../images/joinImage.png';
import createImage from '../images/createImage.png';

function Header() {
    return (
        <nav className="nav">
            <Link to="/" className="title">TimeSync</Link>
            <ul>
                <img className="logo" src={joinImage} alt="Join" />
                <li>
                    <NavLink to="/join">Join</NavLink>
                </li>

                <img className="logo" src={createImage} alt="Create" />
                <li>
                    <NavLink to="/create">Create</NavLink>
                </li>
            </ul>
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