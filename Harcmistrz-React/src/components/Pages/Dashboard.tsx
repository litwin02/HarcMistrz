import Header from "../Partials/Header";

const Dashboard = () => {
    const id = localStorage.getItem('id');
    const role = localStorage.getItem('role');
    return(
        <>
        <Header />
            // TODO - Create dashboard content
        </>
    )
}

export default Dashboard;