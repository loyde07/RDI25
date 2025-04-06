
function Header(){

    return(
        <header>
            <h1>WELCOME TO VALORANT</h1>
            <button onClick={() => navigate('')}>Team</button>
            <button onClick={() => navigate('')}>Score</button>
            <button onClick={() => navigate('')}>Tournement</button>
            <button onClick={() => navigate('')}>Register</button>
        </header>
    );

}

export default Header