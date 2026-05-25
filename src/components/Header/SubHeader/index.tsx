import { useEffect, useState } from 'react';
// import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { useGetVenueQuery } from 'api/Venue.api';
import { vibrateClick } from 'utils/haptics';
import { loadVenueFromStorage } from 'utils/storageUtils';
// import { getTodayScheduleInfo } from 'utils/timeUtils';
import WeeklyScheduleModal from 'components/WeeklyScheduleModal';


import { Calendar } from 'lucide-react';

const WhatsappIcon = ({ size = 18 }: { size?: number }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='currentColor'
    aria-hidden='true'
  >
    <path d='M19.11 4.91A10.06 10.06 0 0 0 12.04 2c-5.55 0-10.06 4.5-10.06 10.04 0 1.77.46 3.5 1.34 5.02L2 22l5.06-1.32a10.05 10.05 0 0 0 4.98 1.27h.01c5.54 0 10.05-4.5 10.05-10.04 0-2.68-1.04-5.2-2.99-7.1Zm-7.07 15.45h-.01a8.34 8.34 0 0 1-4.25-1.16l-.3-.18-3 .79.8-2.93-.2-.31a8.34 8.34 0 0 1-1.28-4.43c0-4.6 3.75-8.34 8.36-8.34 2.23 0 4.33.87 5.91 2.45a8.3 8.3 0 0 1 2.45 5.9c0 4.6-3.75 8.35-8.35 8.35Zm4.58-6.25c-.25-.13-1.49-.74-1.72-.82-.23-.08-.4-.13-.57.13-.17.25-.65.82-.8.99-.15.17-.3.19-.55.06-.25-.13-1.06-.39-2.01-1.24-.74-.66-1.24-1.48-1.39-1.73-.15-.25-.02-.39.11-.51.12-.11.25-.3.38-.45.13-.15.17-.25.25-.42.08-.17.04-.32-.02-.45-.06-.13-.57-1.38-.78-1.89-.21-.5-.42-.43-.57-.44h-.49c-.17 0-.45.06-.69.32-.23.26-.9.88-.9 2.14 0 1.26.92 2.48 1.05 2.65.13.17 1.81 2.77 4.39 3.88.61.26 1.09.42 1.46.54.61.19 1.17.16 1.61.1.49-.07 1.49-.61 1.7-1.2.21-.59.21-1.1.15-1.21-.06-.11-.23-.17-.48-.3Z' />
  </svg>
);
import { clearCart, setVenue } from 'src/store/yourFeatureSlice';

const getWhatsappUrl = (phone?: string | null) => {
  const number = (phone || '').replace(/\D/g, '');
  return `https://wa.me/${number}?text=${encodeURIComponent('Здравствуйте! Хочу получить консультацию по товарам.')}`;
};

const SubHeader = () => {
  const { venue, id } = useParams();
  const dispatch = useDispatch();
  // const { t } = useTranslation();
  const { data } = useGetVenueQuery({
    venueSlug: venue || '',
    tableId: Number(id) || undefined,
  });

  useEffect(() => {
    if (data) dispatch(setVenue(data));
  }, [data, dispatch]);

  useEffect(() => {
    const loadedVenue = loadVenueFromStorage();
    if (loadedVenue.companyName !== venue) {
      dispatch(clearCart());
    }
  }, [venue, dispatch]);

  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [showFabLabel, setShowFabLabel] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowFabLabel(false), 4000);
    return () => clearTimeout(t);
  }, []);

  // const scheduleDisplay = useMemo(() => {
  //   const info = getTodayScheduleInfo(
  //     data?.schedules,
  //     data?.schedule,
  //     t('dayOff')
  //   );
  //   return `${info.text}`;
  // }, [data?.schedules, data?.schedule, t]);

  return (
    <div className='sub-header'>
      <div className='sub-header__content'>
        {venue === 'heyyou' ? (
          <div className='venue venue--placeholder' />
        ) : (
          <div className='venue'>
            <div className='logo'>
              <img src={data?.logo || undefined} alt='' />
            </div>
            <div className='min-w-0 flex-1'>
              <div className='name' title={data?.companyName}>
                {data?.companyName}
              </div>
              {/* <span className='schedule' title={scheduleDisplay}>
                {scheduleDisplay}
              </span> */}
            </div>
          </div>
        )}
        <div className='flex items-center gap-[8px] shrink-0'>
          <div
            className='call cursor-pointer'
            role='button'
            aria-label='График работы'
            onClick={() => {
              vibrateClick();
              setIsScheduleOpen(true);
            }}
          >
            <Calendar size={24} />
          </div>
          {data?.table?.tableNum && (
            <div className='table'>Стол №{data.table.tableNum}</div>
          )}
        </div>
      </div>

      {data?.phoneNumber && (
        <a
          href={getWhatsappUrl(data.phoneNumber)}
          target='_blank'
          rel='noopener noreferrer'
          className={`whatsapp-fab${showFabLabel ? ' whatsapp-fab--expanded' : ''}`}
          aria-label='Консультация в WhatsApp'
          onClick={() => vibrateClick()}
        >
          <WhatsappIcon size={28} />
          <span className='whatsapp-fab__label'>Консультация</span>
        </a>
      )}

      <WeeklyScheduleModal
        isShow={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        schedules={data?.schedules}
        fallbackSchedule={data?.schedule}
      />
    </div>
  );
};

export default SubHeader;
