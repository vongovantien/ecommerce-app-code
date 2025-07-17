import Cart from "../models/Cart";


export class CartController {

    static async addToCart(req, res, next) {
        const data = req.body;
        const user_id = req.user.aud;
        try {
            let cartData: any = {
                products: JSON.parse(data.products),
                status: data.status,
                total: data.total,
                // grandTotal: data.grandTotal,
                // deliveryCharge: data.deliveryCharge
            };
            if(data.instruction) cartData = { ...cartData, instruction: data.instruction };
            let update_cart: any = await Cart.findOneAndUpdate(
                { user_id },
                { ...cartData },
                {
                    new: true,
                    projection: { __v: 0, user_id: 0, _id: 0 }
                }
            );
            if(!update_cart) {
                cartData = { ...cartData, user_id };
                const cart = await new Cart(cartData).save();
                update_cart = {
                    products: cart.products,
                    instruction: cart.instruction || null,
                    // grandTotal: cart.grandTotal,
                    // deliveryCharge: cart.deliveryCharge,
                    total: cart.total,
                    status: cart.status,
                    created_at: cart.created_at,
                    updated_at: cart.updated_at
                };
            }
            
            res.send(update_cart);
        } catch(e) {
            next(e);
        }
    }

    static async getUserCart(req, res, next) {
        const user_id = req.user.aud;
        console.log(user_id);
        try {
            const cart = await Cart.find({ user_id }, {user_id: 0, __v: 0, _id: 0}); 
            res.send(cart);
        } catch(e) {
            next(e);
        }
    }

}