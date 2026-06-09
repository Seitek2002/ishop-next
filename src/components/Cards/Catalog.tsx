import { FC, useMemo, useState } from 'react';
import Image from 'next/image';

import { IProduct } from 'types/products.types';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import { vibrateClick } from 'utils/haptics';

import defaultProduct from 'assets/images/default-product.svg';

import { addToCart, incrementFromCart } from 'src/store/yourFeatureSlice';

interface IProps {
  item: IProduct;
  foodDetail?: (item: IProduct) => void;
  onMaxExceeded?: () => void;
}

const CatalogCard: FC<IProps> = ({ item, foodDetail, onMaxExceeded }) => {
  const dispatch = useAppDispatch();

  const srcCandidate = useMemo(
    () => item.productPhotoSmall || defaultProduct,
    [item.productPhotoSmall]
  );
  const [isLoaded, setIsLoaded] = useState(srcCandidate === defaultProduct);
  const cart = useAppSelector((state) => state.yourFeature.cart);
  const colorTheme = useAppSelector(
    (state) => state.yourFeature.venue?.colorTheme
  );

  const openFoodDetail = () => {
    vibrateClick();
    if (foodDetail) foodDetail(item as IProduct);
  };

  // All cart lines that belong to this product (a sized product may have several).
  const matchingLines = cart.filter(
    (cartItem) => +cartItem.id.split(',')[0] === item.id
  );
  const totalInCart = matchingLines.reduce((sum, ci) => sum + ci.quantity, 0);
  // Only one size in the cart → we can edit it inline without the modal.
  const singleLine = matchingLines.length === 1 ? matchingLines[0] : null;

  const addStock = () => {
    // Prevent adding more than stock (across all modificators of this product)
    if (item.quantity <= 0 || totalInCart >= item.quantity) {
      onMaxExceeded && onMaxExceeded();
      return;
    }

    if (singleLine) {
      // Sized product with one size in cart: add another of that same size.
      dispatch(
        addToCart({
          ...singleLine,
          quantity: 1,
          availableQuantity: singleLine.availableQuantity ?? item.quantity,
        })
      );
      return;
    }

    const newItem = {
      ...item,
      // Ensure cart item always has a single category (fallback to first categories[] or empty)
      category: item.category ??
        item.categories?.[0] ?? { id: 0, categoryName: '' },
      id: item.id + '',
      modificators: undefined,
      quantity: 1,
      availableQuantity: item.quantity,
    };
    dispatch(addToCart(newItem));
  };

  const handleClick = () => {
    vibrateClick();
    // Sized product: add inline only when exactly one size is in the cart;
    // otherwise the modal is needed to pick the size.
    if (item.modificators.length && !singleLine) {
      openFoodDetail();
      return;
    }
    addStock();
  };
  const handleDecrement = () => {
    vibrateClick();
    // Sized product with multiple sizes in cart → ambiguous which to remove,
    // so open the modal. Otherwise decrement the matching line directly.
    if (item.modificators.length && !singleLine) {
      openFoodDetail();
      return;
    }
    dispatch(incrementFromCart(singleLine ?? item));
  };

  return (
    <div className='cart-block bg-white'>
      <div className='cart-img relative'>
        {!isLoaded && (
          <div className='cart-img-skeleton absolute top-0 left-0 w-full h-full bg-gray-300 animate-pulse'></div>
        )}
        <Image
          src={srcCandidate}
          alt={item.productName || 'product'}
          width={300}
          height={200}
          onLoad={() => setIsLoaded(true)}
          onError={(e) => {
            if (e.currentTarget.src !== defaultProduct) {
              e.currentTarget.src = defaultProduct as unknown as string;
              setIsLoaded(true);
            }
          }}
          className={`transition-opacity duration-300 cursor-pointer ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={openFoodDetail}
        />
        <div
          className={
            totalInCart > 0 ? 'add-btn opacity-90 active' : 'add-btn opacity-90'
          }
          style={{ backgroundColor: colorTheme }}
        >
          <div className='wrapper-btn'>
            <button
              onClick={(e) => {
                e.stopPropagation();
                vibrateClick();
                handleDecrement();
              }}
              className='absolute items-center justify-center'
              style={{
                width: totalInCart ? 18 : 0,
                height: 18,
                left: totalInCart ? 0 : 100,
                display: totalInCart ? 'flex' : 'none',
                transition: '0.5s',
                color: '#fff',
                lineHeight: '18px',
              }}
              aria-label='minus'
            >
              -
            </button>
            <span
              className='cart-count text-[#fff] text-center'
              style={{
                transition: '0.5s',
                overflow: 'hidden',
              }}
            >
              {totalInCart || ''}
            </span>
            <div></div>
          </div>
          <div
            className='fixed-plus'
            style={{
              width: totalInCart ? '25%' : '100%',
              right: 0,
              transition: '1.0s',
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                vibrateClick();
                handleClick();
              }}
              style={{
                height: '100%',
                width: '100%',
                color: '#fff',
                lineHeight: '18px',
              }}
              className='z-10 flex items-center justify-center'
              aria-label='plus'
            >
              +
            </button>
          </div>
        </div>
      </div>
      {item.modificators.length ? (
        <div className='cart-info'>
          <span className='cart-price' style={{ color: colorTheme }}>
            от {+item.modificators[0].price} с
          </span>
        </div>
      ) : item.quantity === 0 ? (
        <span className='text-center text-[red]'>Нет в наличии</span>
      ) : (
        <div className='cart-info'>
          <span className='cart-price' style={{ color: colorTheme }}>
            {+item.productPrice} с
          </span>
        </div>
      )}
      <h4 className='cart-name'>{item.productName}</h4>
      {item.weight && item.measureUnit ? (
        <span className='cart-weight text-[12px] text-[#727272]'>
          {item.weight} {item.measureUnit}
        </span>
      ) : null}
    </div>
  );
};

export default CatalogCard;
