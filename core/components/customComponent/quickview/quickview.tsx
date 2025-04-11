'use client';

import { useState, useEffect, useRef } from 'react';
import { fetchProductData } from './utils/getProductData';
import { Gallery } from '~/app/[locale]/(default)/product/[slug]/_components/gallery';
import { Details } from '~/app/[locale]/(default)/product/[slug]/_components/details';
import { Description } from '~/app/[locale]/(default)/product/[slug]/_components/description';

interface QuickViewProps {
  productId: any | null;
  onClose: () => void;
}

export function Quickview({ productId, onClose }: QuickViewProps) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const modalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (productId && modalRef.current) {
      modalRef.current.showModal();
    }
  }, [productId]);

  useEffect(() => {
    if (!productId) return;

    async function fetchProduct() {
      setLoading(true);
      try {
        const productData = await fetchProductData(productId);
        setProduct(productData);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [productId]);

  if (!productId) return null;

  return (
    <dialog ref={modalRef} className="modal bg-white rounded-lg w-full max-w-5xl h-[90vh] p-6 customQuickModal">
    {/* Close Button */}
    <button
      className="absolute top-4 right-4 text-gray-600 text-xl"
      onClick={() => {
        modalRef.current?.close();
        onClose();
      }}
    >
      ✕
    </button>

    {/* Scrollable Content */}
    <div className="flex-1 overflow-auto p-4">
      {loading ? (
        <p>Loading product...</p>
      ) : product ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Gallery product={product} />
          <Details product={product} />
          <div className="col-span-2">
            <Description product={product} />
          </div>
        </div>
      ) : (
        <p>Product not found.</p>
      )}
    </div>
  </dialog>
  );
}
