import { IProduct } from 'types/products.types';

const GROUP_PATTERNS: Array<{ weight: number; patterns: RegExp[] }> = [
  {
    weight: 0,
    patterns: [
      /умыв/i,
      /пенк/i,
      /foam/i,
      /cleanser/i,
      /cleansing/i,
      /micellar/i,
      /мицел/i,
      /мыло/i,
      /milk/i,
      /молочк/i,
      /hydrophilic/i,
      /гидрофиль/i,
      /oil control foaming/i,
      /гель для умывания/i,
    ],
  },
  {
    weight: 1,
    patterns: [
      /\bgel\b/i,
      /гель/i,
      /gel-cell/i,
      /sebum/i,
      /jelly/i,
    ],
  },
  {
    weight: 2,
    patterns: [
      /тоник/i,
      /toner/i,
      /treatment lotion/i,
      /lotion/i,
      /лосьон/i,
      /mist/i,
      /spray/i,
      /спрей/i,
    ],
  },
  {
    weight: 3,
    patterns: [
      /peel/i,
      /пилинг/i,
      /exfol/i,
      /scrub/i,
      /скраб/i,
      /gommage/i,
    ],
  },
  {
    weight: 4,
    patterns: [
      /mask/i,
      /маск/i,
      /patch/i,
      /патч/i,
    ],
  },
  {
    weight: 5,
    patterns: [
      /serum/i,
      /сыворот/i,
      /ampoule/i,
      /ампул/i,
      /concentrate/i,
      /концентрат/i,
      /essence/i,
      /эликсир/i,
      /elixir/i,
    ],
  },
  {
    weight: 6,
    patterns: [
      /эмульс/i,
      /emulsion/i,
      /fluid/i,
      /флюид/i,
      /essencia/i,
      /essenza/i,
    ],
  },
  {
    weight: 7,
    patterns: [
      /cream/i,
      /крем/i,
      /balm/i,
      /бальзам/i,
    ],
  },
  {
    weight: 8,
    patterns: [
      /spf/i,
      /sun/i,
      /sunscreen/i,
      /protection/i,
      /защит/i,
    ],
  },
  {
    weight: 9,
    patterns: [
      /set/i,
      /набор/i,
      /program/i,
      /programme/i,
      /kit/i,
      /комплекс/i,
    ],
  },
];

export const getProductGroupWeight = (product: IProduct): number => {
  const text = `${product.productName || ''}`.toLowerCase();

  for (const group of GROUP_PATTERNS) {
    if (group.patterns.some((pattern) => pattern.test(text))) {
      return group.weight;
    }
  }

  return 10;
};

export const sortProductsForCatalog = (products: IProduct[]): IProduct[] => {
  const hasPhoto = (p: IProduct) =>
    Boolean(p.productPhoto || p.productPhotoSmall || p.productPhotoLarge);

  return [...products].sort((a, b) => {
    const ga = getProductGroupWeight(a);
    const gb = getProductGroupWeight(b);
    if (ga !== gb) return ga - gb;

    const sa = Number.isFinite(a.quantity) && a.quantity > 0 ? 1 : 0;
    const sb = Number.isFinite(b.quantity) && b.quantity > 0 ? 1 : 0;
    if (sb !== sa) return sb - sa;

    const ha = hasPhoto(a) ? 1 : 0;
    const hb = hasPhoto(b) ? 1 : 0;
    if (hb !== ha) return hb - ha;

    const an = (a.productName || '').localeCompare(b.productName || '');
    if (an !== 0) return an;

    return (a.id || 0) - (b.id || 0);
  });
};
