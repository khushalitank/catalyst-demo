import { cookies } from 'next/headers';
import { ReactNode } from 'react';

import { getCart } from '~/client/queries/get-cart';
import { Link } from '~/components/link';

import { CartIcon } from './cart-icon';
// import { SideCart } from '../customComponent/sidecard/sidecart';

export const CartLink = ({ children }: { children: ReactNode }) => (
  <Link className="relative flex justify-between p-3 font-semibold" href="/cart">
    {children}
  </Link>
);

export const Cart = async () => {
  const cookieStore = await cookies();
  const cartId = cookieStore.get('cartId')?.value;
// console.log("cartid===?",cartId);

  if (!cartId) {
    return (
      <CartLink>
        <CartIcon />
      
      </CartLink>
      
    );
  }

  const cart = await getCart(cartId);
// console.log("cart===>",cart);

  const count = cart?.lineItems.totalQuantity ?? 0;

  return (<>
   <CartLink>
      <CartIcon count={count} />

    </CartLink>
    {/* <SideCart/> */}
  </>
   
  );
};
