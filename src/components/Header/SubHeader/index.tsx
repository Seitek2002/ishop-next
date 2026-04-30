import { useEffect, useState } from 'react';
// import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { useGetVenueQuery } from 'api/Venue.api';
import { vibrateClick } from 'utils/haptics';
import { loadVenueFromStorage } from 'utils/storageUtils';
// import { getTodayScheduleInfo } from 'utils/timeUtils';
import WeeklyScheduleModal from 'components/WeeklyScheduleModal';


import { Calendar, Clock, MessageCircle } from 'lucide-react';
import { clearCart, setVenue } from 'src/store/yourFeatureSlice';

const WHATSAPP_FALLBACK = '996700000000'; // заглушка пока бэк не вернёт номер заведения

const getWhatsappUrl = (phone?: string | null) => {
  const number = (phone || WHATSAPP_FALLBACK).replace(/\D/g, '');
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
        <div className='venue'>
          <div className='logo'>
            <img src={data?.logo || undefined} alt='' />
          </div>
          <div>
            <div className='name' title={data?.companyName}>
              {data?.companyName}
            </div>
            {/* <span className='schedule' title={scheduleDisplay}>
              {scheduleDisplay}
            </span> */}
          </div>
        </div>
        <div className='flex items-center gap-[8px]'>
          <div className='delivery-time'>
            <Clock size={14} />
            <span>24–48 ч</span>
          </div>
          <a
            href={getWhatsappUrl(data?.phone)}
            target='_blank'
            rel='noopener noreferrer'
            className='whatsapp-btn'
            aria-label='Консультация в WhatsApp'
            onClick={() => vibrateClick()}
          >
            <MessageCircle size={16} />
            <span>Консультация</span>
          </a>
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
