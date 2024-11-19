import { useState, useEffect, useContext } from "react";
import classes from './GamePrice.module.css';
import { CartContext } from "../../../context/CartContext";
import { DETAILS_VIEW_GAME_PRICE } from "../../../config";
import Rating from '../../gameCardComponent/Rating';
import {ConvertToDecimal} from '../../../utils/price'

const ProductCard = ({ id }) => {
  const { items, addItemToCart, handleUpdateCartItemQuantity, removeFromCart } = useContext(CartContext); // Usa las funciones del contexto
  const [productPriceData, setProductPriceData] = useState({
    price: 0,
    avgRating: 0,
    stock: 0,
    quantity: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carga de datos del producto
  useEffect(() => {
    if (!id) {
      setError("ID no válido");
      setLoading(false);
      return;
    }

    const fetchPriceData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${DETAILS_VIEW_GAME_PRICE}?id=${id}`);
        if (!response.ok) {
          throw new Error("Error al obtener los datos");
        }
        const data = await response.json();

        // Encuentra el producto en el carrito y actualiza los datos
        const productInCart = items.find((item) => item.id === id) || {};
        setProductPriceData({
          price: data.price,
          avgRating: data.avgRating,
          stock: data.stock,
          quantity: productInCart.quantity || 0,
        });
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPriceData();
  }, [id, items]); // Dependemos de `items` para que se actualice si cambia el carrito

  const handleQuantityChange = (operation) => {
    let newQuantity;

    if (productPriceData.stock !== 0) {
      if (operation === "increase") {
        newQuantity = Math.min(productPriceData.quantity + 1, productPriceData.stock);
      } else if (operation === "decrease") {
        newQuantity = Math.max(productPriceData.quantity - 1, 0);
      }

      if (newQuantity > 0) {
        // Agregar o actualizar el producto en el carrito
        addItemToCart({ ...productPriceData, id, quantity: newQuantity });
      } else {
        // Eliminar el producto si la cantidad llega a 0
        removeFromCart(id);
      }
    } else {
      alert("No hay stock");
    }
  };

  const getPlaneCount = (avgRating) => {
    if (avgRating < 0) return 1;
    if (avgRating === 0) return 2;
    if (avgRating > 0) return 3;
    return 0;
  };

  const planeCount = getPlaneCount(productPriceData.avgRating);

  const price = () => {
    return ConvertToDecimal(productPriceData.price);
  };

  if (loading) return <div className={classes['price-card']}>Cargando...</div>;
  if (error) return <div className={classes['price-card']}>Error: {error}</div>;

  return (
    <div className={classes['price-card']}>

      <div className={classes['price-card__left-plane']}>
        <img src="../../icon/avion-detalle.svg" alt="Avion detalle" className={classes['price-card__plane-icon']} />
      </div>

      <div className={classes['price-card__left-column']}>
        <div className={classes['price-card__product-code']}>
          <p>Código: </p>
          <p className={classes['price-card__product-id']}>PROD-{id}</p>
        </div>

        <div className={classes['price-card__price']}>
          <p>PRECIO</p>
          <p className={classes['price-card__price-eur']}>{price()} €</p>
        </div>

        <div className={classes['price-card__rating']}>
          <p className={classes['price-card__label']}>VALORACIÓN</p>
          <div className={classes['price-card__planes-container']}>
            {productPriceData.avgRating === null ? (
              <p className={classes['price-card__no-reviews']}>No existen reseñas.</p>
            ) : (
              [...Array(planeCount)].map((_, index) => (
                <Rating key={index} avgRating={productPriceData.avgRating} />
              ))
            )}
          </div>
        </div>
      </div>

      <div className={classes['price-card__right-column']}>
        <div className={classes['price-card__stock-status']}>
          {productPriceData.stock > 0 ? (
            <span className={classes['price-card__stock-status--in-stock']}>EN STOCK: {productPriceData.stock}</span>
          ) : (
            <span className={classes['price-card__stock-status--out-of-stock']}>SIN STOCK</span>
          )}
        </div>

        <div className={classes['price-card__cart-icon']}>
          <img src="../../icon/carrito_header.svg" alt="Carrito" />
        </div>

        <div className={classes['price-card__quantity-controls']}>
          <button onClick={() => handleQuantityChange("decrease")}>-</button>
          <span>{productPriceData.quantity}</span>
          <button onClick={() => handleQuantityChange("increase")}>+</button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
