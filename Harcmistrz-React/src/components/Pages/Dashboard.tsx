import Header from "../Partials/Header";

const Dashboard = () => {
    const id = localStorage.getItem('id');
    const role = localStorage.getItem('role');
    return(
        <>
        <Header />
            <h1>It works!</h1>
            <h2>{id}</h2>
            <h2>{role}</h2>
        </>
    )
}

export default Dashboard;