import React, { FC, useMemo } from 'react';
import { useAppSelector } from 'hooks/useAppSelector';
import { vibrateClick } from 'utils/haptics';

interface ServerErrorModalProps {
  isShow: boolean;
  onClose: () => void;
  error: unknown;
  title?: string;
}

function getCircularReplacer() {
  const seen = new WeakSet();
  return (_key: string, value: unknown) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value as object)) {
        return '[Circular]';
      }
      seen.add(value as object);
    }
    if (value instanceof Error) {
      return {
        ...value,
        name: value.name,
        message: value.message,
        stack: value.stack,
      };
    }
    return value;
  };
}

const ServerErrorModal: FC<ServerErrorModalProps> = ({
  isShow,
  onClose,
  error,
  title = 'Ошибка сервера',
}) => {
  const colorTheme = useAppSelector(
    (state) => state.yourFeature.venue?.colorTheme
  );

  const errorText = useMemo(() => {
    try {
      const json = JSON.stringify(error, getCircularReplacer(), 2);
      return json ?? 'Неизвестная ошибка';
    } catch {
      try {
        return String(error);
      } catch {
        return 'Не удалось отобразить ошибку';
      }
    }
  }, [error]);

  const handleCopy = async () => {
    try {
      vibrateClick();
      await navigator.clipboard.writeText(errorText);
    } catch {
      /* ignore */
    }
  };

  return (
    <>
      <div
        className={isShow ? 'overlay active' : 'overlay'}
        onClick={() => {
          vibrateClick();
          onClose();
        }}
      ></div>

      <div
        className={isShow ? 'clear-cart-modal active' : 'clear-cart-modal'}
        style={{
          width: 'calc(100vw - 64px)',
          maxWidth: '720px',
          height: 'auto',
          padding: '16px 24px',
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="server-error-title"
      >
        <div className="w-full px-[16px] md:px-[24px]">
          <h3 id="server-error-title" className="text-[20px] font-medium mb-2 text-center">
            {title}
          </h3>
          <p className="text-[#80868B] mb-3 text-center">
            Произошла ошибка при выполнении запроса. Ниже полные данные ошибки.
          </p>

          <div
            style={{
              backgroundColor: '#f7f7f8',
              color: '#111',
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              padding: '12px',
              maxHeight: 360,
              overflow: 'auto',
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
              fontSize: 12,
              lineHeight: 1.45,
              wordBreak: 'break-word',
              whiteSpace: 'pre-wrap',
            }}
          >
            {errorText}
          </div>
        </div>

        <div className="clear-cart-modal__btns" style={{ gap: 8 }}>
          <button
            type="button"
            onClick={handleCopy}
            style={{
              backgroundColor: '#fff',
              color: colorTheme || '#111',
              border: `1px solid ${colorTheme || '#111'}`,
            }}
          >
            Скопировать
          </button>
          <button
            className="text-white"
            style={{ backgroundColor: colorTheme }}
            onClick={() => {
              vibrateClick();
              onClose();
            }}
          >
            Закрыть
          </button>
        </div>
      </div>
    </>
  );
};

export default ServerErrorModal;
