'use client';

import { ShoppingCart } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { z } from 'zod';

import { Badge } from '~/components/ui/badge';

import { useCart } from './cart-provider';

const CartQuantityResponseSchema = z.object({
  count: z.number(),
});

interface CartIconProps {
  count?: number;
}

export const CartIcon = ({ count: serverCount }: CartIconProps) => {
  const { count, setCount,toggleCart } = useCart();
  const locale = useLocale();
  const t = useTranslations('Components.Header.MiniCart');

  useEffect(() => {
    async function fetchCartQuantity() {
      const response = await fetch(`/api/cart-quantity/?locale=${locale}`);
      const parsedData = CartQuantityResponseSchema.parse(await response.json());

      setCount(parsedData.count);
    }

    if (serverCount !== undefined) {
      setCount(serverCount);
    } else {
      // When a page is rendered statically via the 'force-static' route config option, cookies().get() always returns undefined,
      // which ultimately means that the `serverCount` here will always be undefined on initial render, even if there actually is
      // a populated cart. Thus, we perform a client-side check in this case.
      void fetchCartQuantity();
    }
  }, [serverCount, locale, setCount]);

  if (!count) {
    return <ShoppingCart aria-label={t('cart')} />;
  }

  return (
    <button onClick={(event) => {
      event.preventDefault();
      toggleCart();
    }}>
      <span className="sr-only">{t('items')}</span>
      <ShoppingCart aria-hidden="true" />
      <Badge>{count}</Badge>
    </button>
  );
};
