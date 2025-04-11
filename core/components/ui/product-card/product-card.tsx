'use client'
import { ReactNode, useState } from 'react';

import { Image } from '~/components/image';
import { Link } from '~/components/link';
import { cn } from '~/lib/utils';

import { Compare } from './compare';

import { addToCart as addToCartFun} from '~/components/product-card/add-to-cart/form/_actions/add-to-cart';
import { Quickview } from '~/components/customComponent/quickview/quickview';

interface Image {
  altText: string;
  src: string;
}

type Price =
  | string
  | {
      type: 'sale';
      currentValue: string;
      previousValue: string;
    }
  | {
      type: 'range';
      minValue: string;
      maxValue: string;
    };

interface Product {
  id: string;
  name: string;
  href: string;
  image?: Image;
  price?: Price;
  subtitle?: string;
  badge?: string;
}

interface Props extends Product {
  addToCart?: ReactNode;
  className?: string;
  imagePriority?: boolean;
  imageSize?: 'square' | 'tall' | 'wide';
  showCompare?: boolean;
}

const ProductCard = ({
  addToCart,
  className,
  image,
  imagePriority = false,
  imageSize,
  href,
  price,
  id,
  showCompare = true,
  subtitle,
  name,
  ...props
}: Props) =>{
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  const handleAddToCart = async () => {
    // setLoading(true);
    try {
      const formData = new FormData();
      formData.set('product_id', id); 
      // console.log("prdid",id);
      
      const response = await addToCartFun(formData);
      
      if (response.status === 'success') {
        alert('Product added to cart!');
      } else {
        alert(`Error: ${response.error}`);
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
      
      alert('Failed to add product to cart. Please try again.');
    } finally {
      // setLoading(false);
    }
  };
  return (
    <div className={cn('group relative flex flex-col overflow-visible', className)} {...props}>
      <div className="relative flex justify-center pb-3">
        <div
          className={cn('relative flex-auto', {
            'aspect-square': imageSize === 'square',
            'aspect-[4/5]': imageSize === 'tall',
            'aspect-[7/5]': imageSize === 'wide',
          })}
        >
          {image ? (
            <Image
              alt={image.altText}
              className="object-contain"
              fill
              priority={imagePriority}
              sizes="(max-width: 768px) 50vw, (max-width: 1536px) 25vw, 500px"
              src={image.src}
            />
          ) : (
            <div className="h-full w-full bg-gray-200" />
          )}
        </div>
      </div>
      <div className={cn('flex flex-1 flex-col gap-1', Boolean(addToCart) && 'justify-end')}>
        {subtitle ? <p className="text-base text-gray-500">{subtitle}</p> : null}
        <h3 className="text-xl font-bold lg:text-2xl">
          <Link
            className="focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-primary/20 focus-visible:ring-0"
            href={href}
          >
            <span aria-hidden="true" className="absolute inset-0 bottom-20" />
            {name}
          </Link>
        </h3>
        <div className="flex flex-wrap items-end justify-between pt-1">
          {Boolean(price) &&
            (typeof price === 'object' ? (
              <p className="flex flex-col gap-1">
                {price.type === 'range' && (
                  <span>
                    {price.minValue} - {price.maxValue}
                  </span>
                )}
  
                {price.type === 'sale' && (
                  <>
                    <span>
                      Was: <span className="line-through">{price.previousValue}</span>
                    </span>
                    <span>Now: {price.currentValue}</span>
                  </>
                )}
              </p>
            ) : (
              <span>{price}</span>
            ))}
  
          
        </div>
      </div>
      
        {addToCart?  addToCart:
          <button
          className="mt-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:bg-gray-300"
          onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        }
        
        <button
        className="mt-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        onClick={() => setQuickViewOpen(true)}
      >
        Quick View
      </button>
      {showCompare && <Compare id={id} image={image} name={name} />}
      {/* Render Quick View Modal if Open */}
      {quickViewOpen && <Quickview productId={id} onClose={() => setQuickViewOpen(false)} />}

    </div>
    
  );
} 


ProductCard.displayName = 'ProductCard';

export { ProductCard, type Price };
