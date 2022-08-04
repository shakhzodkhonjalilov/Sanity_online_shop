import React, { createContext, useContext , useState, useEffect} from 'react'
import {toast} from 'react-hot-toast'
import product from '../ecommerce/schemas/product'
 

const Context = createContext()

export const StateContext = ({children}) => {
    const [showCart, setShowCart] = useState(false)

    const [cartItems, setCartItems] = useState([])
    const [totalPrice, setTotalPrice] = useState(0)
    const [totalQuantities, setTotalQuantities] = useState(0)
    const [qty, setQty] = useState(1)
    let foundProduct;
    let index;

    const incQty = () => {
        setQty((prev) => prev + 1)
    }
    const decQty = () => {
        setQty((prev) => {
            if(prev - 1 < 1) {
                return 1
            }
            return prev - 1
        })
    }

    const onAdd = (product, quantity) => {
        const checkProductInCard = cartItems.find((item) => item._id == product._id)

        setTotalPrice((prev) => prev + product.price * quantity)
        setTotalQuantities((prev) => prev + quantity)
        if(checkProductInCard) {
            const updatedCartItems = cartItems.map((cartProduct) => {
                if(cartProduct._id === product._id) {
                    return {
                        ...cartProduct,
                        quantity: cartProduct.quantity + quantity
                    }
                }
            })
            setCartItems(updatedCartItems)
        } else {
            product.quantity = quantity;
            setCartItems([...cartItems, {...product}])
        }
        toast.success(`${qty} ${product.name} added to the cart`)
    }

    const onRemove = (id, item) => {
        setCartItems(cartItems.filter(item => item._id !== id))
        console.log(item)
        setTotalPrice(prev => prev - item.price * item.quantity)
        setTotalQuantities(prev => prev - item.quantity)
    }

    const toggleCartItemQuantity = (id, value) => {
            foundProduct = cartItems.find(item => item._id === id)
            index = cartItems.findIndex(item => item._id === id)
            // const newCartItems = cartItems.filter(item => item._id !== id)
         

            if(value === 'inc') {
                setCartItems(prev => prev.map(item => item._id === id ? {...item, quantity: item.quantity + 1} : item))
                setTotalPrice((prevTotalPrice) => prevTotalPrice + foundProduct.price)
                setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + 1)
            } else if(value === 'dec') {
                if(foundProduct.quantity  > 1) {
                    // const newArr = [...cartItems]
                    // newArr[index].quantity = foundProduct.quantity - 1
                    setCartItems(prev => prev.map(item => item._id === id ? {...item, quantity: item.quantity - 1} : item))
                    setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price)
                    setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - 1)
                }
            }
    }

    return (
        <Context.Provider value={{showCart, cartItems, totalPrice, totalQuantities, qty, incQty, decQty, onAdd, setShowCart, toggleCartItemQuantity, onRemove, setQty}}>
            {children}
        </Context.Provider>
    )
}


export const useStateContext = () => useContext(Context)