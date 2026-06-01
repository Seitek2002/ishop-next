# Артикул товара: завести отдельное поле на бэке (сейчас временно = product `id`)

**Кому:** Кума (backend)
**Статус:** ожидает бэкенд

## Контекст

В коммите `c95718c feat(catalog): search products by id (artikul) and show copyable artikul in detail` добавили:

1. **Поиск по артикулу** — в мобильном поиске (`src/client-pages/Home/components/Search/index.tsx`) числовой запрос теперь матчится по `id` товара на клиенте.
2. **Показ артикула в карточке товара** — в `FoodDetail` после описания выводится строка «Артикул: {id}» с кнопкой копирования в буфер.

**Важно:** «артикул» сейчас — это технический `IProduct.id` (первичный ключ из API), а не настоящий SKU. Это временное решение до изменений на бэке.

## Почему это технический долг

- `id` — это PK базы, а не артикул. Настоящий артикул задаёт продавец, он человекочитаемый и может быть буквенно-цифровым (`CR-215-BLK`), используется в учёте/на ценниках/чеках.
- Клиентский поиск по `id` хрупкий: ищу через `String(id).includes(search)`, поэтому «215» находит и `2150`, `1215` и т.п. Точного совпадения нет.
- Ради числового поиска фронт делает **доп. запрос всего каталога** venue (`useGetProductsQuery({ organizationSlug })`) и фильтрует на клиенте — с серверным поиском это не нужно.

## Что нужно

### Backend

1. Добавить в модель товара поле артикула — например `article` (string, nullable) или `sku`.
2. Прокинуть его в ответ `GET /api/products/?organizationSlug=<slug>` рядом с `productName`, `productPrice`, `weight` и т.д.
3. Поиск `?search=` должен матчить и по этому полю (желательно проиндексированно).
4. Согласовать имя поля с фронтом (`article` vs `sku`) и формат (только цифры или произвольная строка).

### Frontend (после появления поля на бэке)

1. Добавить в `IProduct` / `IFoodCart` (`src/types/products.types.ts`):
   ```ts
   article?: string | null;
   ```
2. В `FoodDetail` (`src/components/FoodDetail/index.tsx`) показывать `item.article`, fallback на `item.id` если поле пустое.
3. В `Search` (`src/client-pages/Home/components/Search/index.tsx`) **убрать** клиентский id-merge и доп. запрос всего каталога — полагаться на серверный `?search=`, который теперь матчит артикул.

## Acceptance criteria

- [ ] Бэк отдаёт `article` (или согласованное имя) в `/api/products/`.
- [ ] `?search=<артикул>` находит товар на бэке (точное/индексированное совпадение).
- [ ] Фронт показывает реальный артикул в `FoodDetail` (с копированием).
- [ ] Из `Search` удалён доп. запрос всего каталога и клиентский фильтр по `id`.
- [ ] Если артикул не задан — fallback на `id` не ломает UI.

## Релевантные файлы

- `src/types/products.types.ts` — интерфейсы `IProduct` / `IFoodCart`
- `src/api/Products.api.ts` — query-параметры `getProducts`
- `src/client-pages/Home/components/Search/index.tsx` — текущий клиентский поиск по id
- `src/components/FoodDetail/index.tsx` — строка «Артикул» с копированием
