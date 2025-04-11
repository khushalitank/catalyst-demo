import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { getChannelIdFromLocale } from '~/channels.config';
import { getCart } from '~/client/queries/get-cart';

export const GET = async (request: NextRequest) => {
  const cookieStore = await cookies();
  const cartId = cookieStore.get('cartId')?.value;

  const searchParams = request.nextUrl.searchParams;
  const locale = searchParams.get('locale') ?? undefined;
// console.log("cartId2=====================",cartId);

  if (cartId) {
    const cart = await getCart(cartId, getChannelIdFromLocale(locale));

    return NextResponse.json({ cart: cart });
  }

  return NextResponse.json({ cart: null });
};

export const runtime = 'edge';
