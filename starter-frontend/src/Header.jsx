import './Header.css';

function Header() {
    return (
        <ul class="header">
            <li><a href="default.asp" class="title">TimeSync</a></li>
            <li><a href="news.asp" class="tabs">Join</a></li>
            <li><a href="contact.asp" class="tabs">Create</a></li>
        </ul>
    );
}

export default Header