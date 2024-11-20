import CartListGames from "../components/cartViewComponent/CartListGames";
import CartPayment from "../components/cartViewComponent/CartPayment";
import classes from "../styles/Cart.module.css"

function Cart() {
    return (
        <div className={classes.container}>
            <div className={classes.cartListGames}>
            <CartListGames />
            <CartListGames />
            <CartListGames />
            <CartListGames />
            <CartListGames />
            <CartListGames />
            <CartListGames />
            <CartListGames />
            <CartListGames />
            </div>
            
            <div className={classes.cartPayment}>
            <CartPayment />
            </div>
            
        </div>
    )
}

export default Cart;