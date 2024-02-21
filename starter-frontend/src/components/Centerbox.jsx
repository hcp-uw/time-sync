import './Centerbox.css';

function Centerbox() {
    return (
        <div class="container">
            <h2 class="sync_title"> Let's Sync it up!</h2>
            <div class="box">
                <input type="text" class="sync_code_box" placeholder="Sync Code" readonly></input>
            </div>
        </div>
    );
}

export default Centerbox

/*
shifted around a shit load of things
added folders for images, components, pages
imported router and implemented into app with routes
all index.js needs to do is render app.js which will actually implement other componenets
app.js has all the routes and links front to backend i think
*/