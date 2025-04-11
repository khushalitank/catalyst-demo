'use server'
import { getProduct } from '~/app/[locale]/(default)/product/[slug]/page-data';

export async function fetchProductData(productId: any) {
  try {
    const product = await getProduct({
      entityId: Number(productId),
      useDefaultOptionSelections: true,
    });
    // console.log("data==",product);
    
    return product;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}
