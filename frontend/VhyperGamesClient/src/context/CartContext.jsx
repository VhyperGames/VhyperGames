import React, { createContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./authcontext";
import { GET_CART, UPDATE_CART, GET_CART_BY_GAMES, PUT_MERGE } from "../config";

// Crear el contexto del carrito
const CartContext = createContext({
  items: [],
  gameDetails: [],
  addItemToCart: () => { },
  removeFromCart: () => { },
  handleQuantityChange: () => { },
  fetchCartByGames: () => { },
  mergeCartWithDB: () => { },
  syncCartWithDB: () => { },
});

// Crear el provider
const CartProvider = ({ children }) => {
  const { token, userId } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [gameDetails, setGameDetails] = useState([]); //Se almacenan los juegos usados en CartListGames

  // Cargar el carrito desde LocalStorage al iniciar
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        setCart({ items: parsedCart.items || [] });
      } catch (error) {
        console.error("Error parseando cart desde LocalStorage:", error);
        setCart({ items: [] });
      }
    }
  }, []);

  // Función para obtener el carrito desde la base de datos al iniciar sesión
  useEffect(() => {
    if (token && userId) {
      getCartFromDB();
    }
  }, [token, userId]);



  // Guardar carrito en LocalStorage cada vez que cambia
  const updateLocalStorage = (cart) => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch (error) {
      console.error("Error guardando cart en LocalStorage:", error);
    }
  };

  const fetchCartByGames = useCallback(async (gameIds) => { // GAMEDETAILS OK
    try {
      // Validar los IDs (asegurarse de que sean números válidos)
      const validGameIds = gameIds.filter(id => Number.isInteger(id) && id > 0);
      if (validGameIds.length === 0) {
        console.error("gameIds no contiene valores válidos:", gameIds);
        return;
      }

      const query = validGameIds.map(id => `gameIds=${id}`).join("&");
      const url = `${GET_CART_BY_GAMES}?${query}`;
      console.log("URL generada:", url);

      // Realizar la solicitud al backend
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener información de los juegos");
      }

      // Procesar la respuesta
      const data = await response.json();
      console.log("Datos obtenidos de la API:", data);
      setGameDetails(data);
    } catch (error) {
      console.error("Error al obtener información de juegos:", error.message);
      setGameDetails([]);
    }
  }, [token]);




  // Sincronizar carrito local con la base de datos (Merge, nuevo endpoint PUT)
  const mergeCartWithDB = async () => {
    if (token && userId) {
      const localItems = cart.items.map((item) => ({
        gameId: item.gameId,
        quantity: item.quantity || 0,
      }));

      try {
        const response = await fetch(PUT_MERGE, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(localItems),
        });

        if (!response.ok) {
          throw new Error("Error al hacer merge del carrito");
        }

        const mergedCart = await response.json();
        console.log("Carrito después del merge:", mergedCart);

        const formattedItems = mergedCart.map((item) => ({
          gameId: item.gameId,
          quantity: item.quantity,
        }));

        setCart({ items: formattedItems });
        updateLocalStorage({ items: formattedItems });
      } catch (error) {
        console.error("Error al sincronizar el carrito (merge):", error.message);
      }
    }
  };

  // Obtener el carrito desde la base de datos OK
  const getCartFromDB = async () => {
    if (token && userId) {
      try {
        const response = await fetch(`${GET_CART}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Error al obtener el carrito");
        }

        const data = await response.json();
        console.log("Datos del carrito obtenidos:", data);
        if (Array.isArray(data) && data.length > 0) {
          const formattedItems = data.map((item) => ({
            gameId: item.gameId,
            quantity: item.quantity,
          }));
          setCart({ items: formattedItems });
          updateLocalStorage({ items: formattedItems });
        } else {
          // Manejar el caso donde el carrito está vacío o no hay datos
          setCart({ items: [] });
          updateLocalStorage({ items: [] });
        }
      } catch (error) {
        console.error("Error al obtener el carrito desde la base de datos:", error.message);
      }
    }
  };


  // Sincronizar el carrito con la base de datos OK
  const syncCartWithDB = async () => {
    if (token && userId) {
      const payload = cart.items.map((item) => ({
        gameId: item.gameId,
        quantity: item.quantity || 0,
      }));

      try {
        const response = await fetch(UPDATE_CART, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`Error al sincronizar el carrito: ${response.statusText}`);
        }

        console.log("Carrito sincronizado exitosamente.");
      } catch (error) {
        console.error("Error al sincronizar el carrito:", error.message);
      }
    }
  };

  // Añadir producto al carrito
  const addItemToCart = (product) => {
    setCart((prevCart) => {
      // Buscar si el producto ya existe en el carrito
      const existingItemIndex = prevCart.items.findIndex((item) => item.gameId === product.gameId);
      let newItems = [...prevCart.items];

      if (existingItemIndex !== -1) {
        // Producto ya existe, aumentar cantidad
        const existingItem = newItems[existingItemIndex];
        newItems[existingItemIndex] = {
          ...existingItem,
          quantity: existingItem.quantity + product.quantity
        };
      } else {
        // Producto nuevo, añadir al carrito
        newItems.push({
          ...product,
          quantity: product.quantity
        });
      }

      updateLocalStorage({ items: newItems });
      return { items: newItems };
    });
  };


  // Cambiar la cantidad de un producto (añadir y decrementar) - 0 +
  const handleQuantityChange = (gameId, operation) => {
    setCart((prevShoppingCart) => {
      const items = prevShoppingCart.items || [];
      const productIndex = items.findIndex((item) => item.gameId === gameId);
      const product = items[productIndex];

      if (!product && operation === "increase") {
        const newItem = { gameId, quantity: 1 };
        const updatedCart = { items: [...items, newItem] };
        updateLocalStorage(updatedCart);
        return updatedCart;
      }

      if (product) {
        let newQuantity = product.quantity;

        if (operation === "increase") {
          newQuantity = newQuantity + 1; // Puedes manejar stock aquí si es necesario
        } else if (operation === "decrease") {
          newQuantity = Math.max(newQuantity - 1, 0);
        }

        const updatedItems = [...items];
        if (newQuantity === 0) {
          updatedItems.splice(productIndex, 1); // Eliminar del carrito
        } else {
          updatedItems[productIndex] = { ...product, quantity: newQuantity };
        }

        const updatedCart = { items: updatedItems };
        updateLocalStorage(updatedCart);
        return updatedCart;
      }

      return prevShoppingCart;
    });
  };

  // Eliminar producto del carrito
  const removeFromCart = (gameId) => {
    setCart((prevShoppingCart) => {
      const updatedItems = prevShoppingCart.items.filter((item) => item.gameId !== gameId);
      const updatedCart = { items: updatedItems };
      updateLocalStorage(updatedCart);
      return updatedCart;
    });
  };

  const ctxValue = {
    items: cart.items || [],
    gameDetails,
    addItemToCart,
    handleQuantityChange,
    removeFromCart,
    fetchCartByGames,
    mergeCartWithDB,
    syncCartWithDB,
  };

  return <CartContext.Provider value={ctxValue}>{children}</CartContext.Provider>;
};

export { CartContext, CartProvider };
