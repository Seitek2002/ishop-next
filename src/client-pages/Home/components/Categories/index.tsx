import { FC, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react';

import { useGetCategoriesQuery } from 'api/Categories.api';
import { useAppSelector } from 'hooks/useAppSelector';
import { vibrateClick } from 'utils/haptics';

import Item from './Item';

interface IProps {
  onCategoryChange: (id: number | undefined) => void;
  onSearchChange: (bool: boolean) => void;
  selectedCategory?: number;
  onCategoryTitleChange?: (title: string) => void;
}

const Categories: FC<IProps> = ({
  onCategoryChange,
  onSearchChange,
  selectedCategory,
  onCategoryTitleChange,
}) => {
  const params = useParams<{ venue: string }>();
  const [isShow, setIsShow] = useState(false);
  const { data: categories } = useGetCategoriesQuery(
    {
      organizationSlug: params.venue,
    },
    { skip: !params.venue }
  );
  const [active, setActive] = useState<number | undefined>(0);
  const colorTheme = useAppSelector(
    (state) => state.yourFeature.venue?.colorTheme
  );
  const { t } = useTranslation();

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
  };

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.round(el.clientWidth * 0.7), behavior: 'smooth' });
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    const onScroll = () => updateScrollState();
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        el.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    el.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('resize', updateScrollState);
    return () => {
      el.removeEventListener('scroll', onScroll);
      el.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [categories]);

  // sync active state with parent when selectedCategory is controlled from above
  useEffect(() => {
    if (typeof selectedCategory !== 'undefined') {
      setActive(selectedCategory);
    }
  }, [selectedCategory]);

  const selectCategory = (id: number | undefined) => {
    vibrateClick();
    if (id === -1) {
      onSearchChange(true);
    }
    setActive(id);
    onCategoryChange(id ?? undefined);

    // propagate category title to parent for header
    if (onCategoryTitleChange) {
      if (!id || id === 0) {
        onCategoryTitleChange(t('allDishes'));
      } else if (id === -1) {
        onCategoryTitleChange(t('search'));
      } else {
        const title = categories?.find(
          (c: { id: number; categoryName: string }) => c.id === id
        )?.categoryName;
        onCategoryTitleChange(title || t('allDishes'));
      }
    }
  };

  return (
    <section className='categories'>
      {categories && categories.length > 7 && (
        <span
          className={`dropdown-arrow`}
          onClick={() => {
            vibrateClick();
            setIsShow(!isShow);
          }}
        >
          {isShow ? t('hidden') : t('all')} {t('category')}
        </span>
      )}
      <button
        type='button'
        aria-label='Scroll left'
        className={`categories__nav categories__nav--left ${canScrollLeft ? 'visible' : ''}`}
        onClick={() => scrollBy(-1)}
      >
        <ChevronLeft size={20} />
      </button>
      <button
        type='button'
        aria-label='Scroll right'
        className={`categories__nav categories__nav--right ${canScrollRight ? 'visible' : ''}`}
        onClick={() => scrollBy(1)}
      >
        <ChevronRight size={20} />
      </button>
      <div
        ref={scrollRef}
        className={'categories__content ' + (isShow ? 'active' : '')}
      >
        <div className='md:hidden'>
          <div
            className={`categories__item ${active === -1 ? 'active' : ''}`}
            onClick={() => selectCategory(-1)}
          >
            <div
              className={`categories__wrapper`}
              style={{
                backgroundColor: -1 === active ? colorTheme : 'white',
                borderColor: -1 === active ? colorTheme : 'white',
                borderWidth: -1 === active ? '3px' : '1px',
              }}
            >
              <svg
                version='1.1'
                id='Capa_1'
                xmlns='http://www.w3.org/2000/svg'
                xmlnsXlink='http://www.w3.org/1999/xlink'
                x='0px'
                y='0px'
                viewBox='0 0 118.783 118.783'
                xmlSpace='preserve'
                fill={active === -1 ? 'white' : colorTheme}
              >
                <g>
                  <path
                    d='M115.97,101.597L88.661,74.286c4.64-7.387,7.333-16.118,7.333-25.488c0-26.509-21.49-47.996-47.998-47.996
		S0,22.289,0,48.798c0,26.51,21.487,47.995,47.996,47.995c10.197,0,19.642-3.188,27.414-8.605l26.984,26.986
		c1.875,1.873,4.333,2.806,6.788,2.806c2.458,0,4.913-0.933,6.791-2.806C119.72,111.423,119.72,105.347,115.97,101.597z
		 M47.996,81.243c-17.917,0-32.443-14.525-32.443-32.443s14.526-32.444,32.443-32.444c17.918,0,32.443,14.526,32.443,32.444
		S65.914,81.243,47.996,81.243z'
                  />
                </g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
              </svg>
            </div>
            <span className='leading-tight block text-black'>
              {t('search')}
            </span>
          </div>
        </div>
        <div
          className={`categories__item ${active === 0 ? 'active' : ''}`}
          onClick={() => selectCategory(0)}
        >
          <div
            className={`categories__wrapper`}
            style={{
              backgroundColor: 0 === active ? colorTheme : 'white',
              borderColor: 0 === active ? colorTheme : 'white',
              borderWidth: 0 === active ? '3px' : '1px',
            }}
          >
            <LayoutGrid size={28} color={active === 0 ? 'white' : colorTheme} />
          </div>
          <span className='leading-tight text-black'>{t('all')}</span>
        </div>
        {categories?.map((item) => (
          <Item
            key={item.id}
            item={item}
            active={active}
            selectCategory={selectCategory}
          />
        ))}
      </div>
    </section>
  );
};

export default Categories;
