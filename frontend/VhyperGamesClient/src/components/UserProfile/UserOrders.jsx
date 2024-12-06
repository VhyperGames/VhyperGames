import { useState, useEffect } from "react";
import { getUserOrders } from "../../endpoints/OrderEndpoints";
import { ORDER_BY_USER } from "../../config";
import { useAuth } from "../../context/AuthContext";
import classes from "./UserOrders.module.css"
import { Link } from "react-router-dom";
import { BASE_URL } from "../../config";

function UserOrders() {
    const token = useAuth(); // Obtén el token del contexto
    const [orders, setOrders] = useState([]); // Estado para guardar las órdenes
    const [error, setError] = useState(null); // Estado para manejar errores
    const [loading, setLoading] = useState(true); // Estado para manejar la carga


    const paymentModes = {
        0: "Ethereum",
        1: "Tarjeta de crédito",
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await getUserOrders(ORDER_BY_USER, token.token);
                setOrders(data); // Guarda las órdenes en el estado
            } catch (err) {
                setError(err.message); // Guarda el mensaje de error
            } finally {
                setLoading(false); // Detén el indicador de carga
            }
        };

        if (token) {
            fetchOrders();
        }
    }, [token]); // Ejecuta el efecto cuando el token cambie

    if (loading) return <p>Cargando órdenes...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            {orders.length > 0 ? (
                <ul>
                    {orders.map((orderData) => (
                        <>
                            <div key={orderData.id}></div>
                            <div className={classes.container}>
                                <div className={classes.order}>
                                    <p>Pedido Nº {orderData.id}</p>
                                    <p>Fecha de facturación: {new Date(orderData.billingDate).toLocaleDateString()}</p>
                                    <hr className={classes.line} />
                                </div>

                                <div className={classes.gameList}>
                                    {orderData.orderGames?.map((game) => (
                                        <div key={game.gameId} className={classes.gameItem}>
                                            <Link to={`/juego/${game.gameId}`}>
                                                <div className={classes.gameListImg}>
                                                    <img
                                                        src={`${BASE_URL}${game.imageGame.imageUrl}`}
                                                        alt={game.imageGame.altText}
                                                        className={classes.listImg}
                                                    />
                                                </div>
                                            </Link>
                                            <div className={classes.gameListData}>
                                                <p>{game.title}</p>
                                                <p>{(game.price / 100).toFixed(2)} €</p>
                                                <p>Cantidad: {game.quantity}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className={classes.payment}>
                                    <hr className={classes.line} />
                                    <p>Pagado con: {paymentModes[orderData.modeOfPay]}</p>
                                    <p>Total pagado: {(orderData.totalPrice / 100).toFixed(2)} €</p>
                                </div>
                            </div>
                        </>


                    ))}
                </ul>
            ) : (
                <p>No hay órdenes disponibles.</p>
            )}
        </div>
    );
}

export default UserOrders;