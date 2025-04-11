"use client";

import { useState, useEffect } from "react";
import { useCart } from "~/components/header/cart-provider";
import { useLocale } from "next-intl";
import { Link } from '~/components/link';
import { ItemQuantity } from "~/app/[locale]/(default)/cart/_components/item-quantity";
import { RemoveItem } from "~/app/[locale]/(default)/cart/_components/remove-item";
import { removeItem } from '~/app/[locale]/(default)/cart/_actions/remove-item';
export default function SideCartClient({ cartData }: { cartData: any }) {
  const [cart, setCart] = useState(cartData);
  const [isLoading, setIsLoading] = useState(!cartData);
  const locale = useLocale();
  const { isOpen, toggleCart } = useCart();

  const onSubmitRemoveItem = async (id:any) => {
    const { status } = await removeItem({
      lineItemEntityId: id,
    });

    if (status === 'error') {
      return;
    }

  };

  useEffect(() => {
    if (!cartData) {
      setIsLoading(true);
      async function fetchCartData() {
        try {
          const response = await fetch(`/api/cart-data/?locale=${locale}`);
          const { cart } = await response.json();
          setCart(cart);
        } catch (error) {
          console.error("Error fetching cart data:", error);
        }
        setIsLoading(false);
      }
      fetchCartData();
    } else {
      setCart(cartData);
      setIsLoading(false);
    }
    // console.log("cart----",cart);
    
  }, [isOpen, locale,cartData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end transition-opacity duration-300">
      <div className="w-90 h-full bg-white shadow-lg p-4 transform transition-transform duration-300 translate-x-0">
        <button className="absolute top-4 right-4 text-xl" onClick={toggleCart}>
          X
        </button>

        {isLoading ? (
          <div className="flex items-center justify-center h-full ">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : cart=== null ? (
          <div className="text-center mt-20 text-gray-500">Your cart is empty.</div>
        ) : (
          <div className="mt-8 space-y-4">
            <div>Your Cart: ({cart.lineItems.totalQuantity})</div>
            {cart.lineItems.physicalItems.map((item: any) => (
              <div key={item.entityId} className="flex items-center gap-4 border-b pb-2">
                <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded" />
                <div className="flex flex-col">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                  <span className="text-green-600 font-semibold">₹{item.extendedSalePrice.value}</span>
                </div>
                <ItemQuantity product={item}/>
                {/* <RemoveItem currency={item.extendedSalePrice.currencyCode} product={item}/> */}
                 <form action={()=>onSubmitRemoveItem(item.entityId)}>
                      <button >Remove</button>
                    </form>
              </div>
            ))}
          </div>
        )}

        {/* <div className="mt-6">
          <button className="w-full py-2 bg-green-600 text-white text-lg rounded hover:bg-green-700 transition">
            Checkout
          </button>
        </div> */}
        <div className="mt-6">
          <button className="w-full py-2 bg-green-600 text-white text-lg rounded hover:bg-green-700 transition"  onClick={toggleCart}>
            <Link href="/cart">
            Cart
            </Link>
            
          </button>
        </div>
      </div>
    </div>
  );
}
