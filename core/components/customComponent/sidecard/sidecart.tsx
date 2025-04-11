// 'use server'; (Remove this because we're mixing client & server components)
import { getCart } from "~/client/queries/get-cart";
import { cookies } from "next/headers";
import SideCartClient from "./sideCartClient"; // Import Client Component

export default async function SideCart() {
  const cookieStore =await cookies();
 
  let cartId = cookieStore.get("cartId")?.value;

  let cart = null;

  if (cartId) {
    cart = await getCart(cartId); // Fetch cart on the server
  }
//   else{
//    let cartId=await getCartId();
// console.log("cccccccccccc",cartId);

//   }
// console.log("cart-sidecart",cart,cartId);

  return <SideCartClient cartData={cart} />;
}
