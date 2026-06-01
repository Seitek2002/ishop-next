# Co-branded header: убрать хардкод slug `heyyou`, ввести флаг от бэка

## Контекст

В коммите `e7cba08 feat(header): co-branded venue header for heyyou with "Powered by iShop.kg"` мы добавили специальную раскладку верхнего хедера для одного заведения `ishop.kg/heyyou`:

- логотип заведения слева
- крупное название заведения
- мелкая uppercase-подпись «Powered by iShop.kg»

И параллельно скрыли в нижнем SubHeader дубликат блока с логотипом/именем (т.к. он стал избыточным).

Реализация временно сделана через хардкод slug:

```tsx
// src/components/Header/SupHeader/index.tsx
{venue === 'heyyou' && (data?.logo || data?.companyName) ? (
  <div className='logo logo--venue'>…</div>
) : (
  <div className='logo'>…ishop.kg…</div>
)}
```

```tsx
// src/components/Header/SubHeader/index.tsx
{venue === 'heyyou' ? <div className='venue venue--placeholder' /> : <div className='venue'>…</div>}
```

Это технический долг: каждое следующее заведение, которое захочет co-branded хедер, потребует правки фронта и нового деплоя. Так делать нельзя.

## Что нужно

### Backend

1. Добавить в модель `Organization` (или эквивалент) булево поле — например `is_co_branded: bool` (или enum `branding_mode: 'default' | 'co_branded'`, если предвидятся ещё варианты).
2. Прокинуть это поле в ответ эндпоинта `GET /api/organizations/<slug>/` — рядом с уже существующими `companyName`, `logo`, `colorTheme` и т.д.
3. Для `heyyou` поставить `is_co_branded = true` в админке/сидере.
4. Дефолт для остальных — `false`.

### Frontend

1. Добавить поле в `IVenues` (`src/types/venues.types.ts`):
   ```ts
   isCoBranded?: boolean;
   ```
2. В `SupHeader` заменить условие `venue === 'heyyou'` на `data?.isCoBranded`.
3. В `SubHeader` — то же самое.
4. Удалить ссылку на «heyyou» из обоих компонентов (grep по `heyyou` должен возвращать 0 результатов в `src/components/Header/`).

### Опционально / nice-to-have

- Подумать, не имеет ли смысл вынести «co-branded mode» в более общий концепт (например, white-label режим), где можно конфигурировать: `poweredBy` (текст/брендинг донора), отображение SupHeader/SubHeader, акцентные цвета. Тогда поле станет не `is_co_branded: bool`, а структура `coBranding: { enabled, poweredByLabel, accent }`. Но это можно отложить — на старте достаточно булева.
- Подумать про SSR/metadata в `src/app/[venue]/layout.tsx`: возможно для co-branded venue стоит брать `title` без суффикса «— ishop» (сейчас всегда добавляется).

## Acceptance criteria

- [ ] Бэк отдаёт `isCoBranded` (или эквивалент) в `/api/organizations/<slug>/`.
- [ ] Фронт читает это поле и применяет co-branded раскладку.
- [ ] Поиск `git grep heyyou src/` ничего не находит в коде хедера.
- [ ] Для `heyyou` визуально хедер не изменился (регрессии нет).
- [ ] Для произвольного другого slug (например, `ustukan`) хедер остаётся стандартным.
- [ ] Если флаг включить для нового заведения через админку — никакого деплоя фронта не требуется.

## Релевантные файлы

- `src/components/Header/SupHeader/index.tsx` — условие рендера
- `src/components/Header/SubHeader/index.tsx` — условие скрытия дубликата
- `src/components/Header/SupHeader/style.scss` — стили `.logo--venue`, `.logo__name`, `.logo__powered` (трогать не нужно, останутся как есть)
- `src/types/venues.types.ts` — расширить интерфейс
- `src/app/[venue]/layout.tsx` — место, где уже читается venue API на сервере (можно подсмотреть форму ответа)
