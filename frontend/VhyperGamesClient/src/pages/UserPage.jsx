import UserData from "../components/UserProfile/UserData";
import classes from '../styles/UserPage.module.css'
import Title from "../components/Titles/Title";
import PaymentOrder from "../components/PaymentConfirmation/PaymentOrder";
import Footer from "../components/Footer/Footer";

function UserPage() {

    return (
        <>
            <div className={classes.pageContainer}>
                <UserData />
                

                <hr className={classes.line} />
                <Title text={"TUS PEDIDOS REALIZADOS"} />
                <PaymentOrder />
            </div>
            <Footer />

            
        </>

    )
}

export default UserPage;