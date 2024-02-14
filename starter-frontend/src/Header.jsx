import './Header.css';

function Header() {
    return (
        <div class="header">
        <a href="#default" class="title">TimeSync</a>
        <div class="header-right">
            <a href="#join">Join</a>
            <a href="#create">Create</a>
        </div>
        </div>
    );
}

export default Header