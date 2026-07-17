'use client';

import { FC, useEffect } from 'react';
import Script from 'next/script';
import { usePathname } from 'next/navigation';

import { YM_COUNTER_ID, ymHit } from './metrika';

/** Счётчик Яндекс.Метрики + отслеживание SPA-переходов.
 *
 *  Первичный код — стандартный сниппет Метрики, только counter id из
 *  окружения. defer:true: показы страниц шлём сами (сайт — SPA, штатный
 *  автозамер увидел бы лишь первую). Пусто в NEXT_PUBLIC_YM_COUNTER_ID —
 *  компонент ничего не рендерит и не грузит.
 *
 *  Отслеживаем только pathname, а не query: useSearchParams в общем лэйауте
 *  заставил бы весь сайт уйти в динамический рендер (несовместимо со
 *  статик-экспортом). Для магазина маршрутов по пути достаточно. */
export const YandexMetrika: FC = () => {
  const pathname = usePathname();

  useEffect(() => {
    ymHit(pathname);
  }, [pathname]);

  if (!YM_COUNTER_ID) return null;

  return (
    <Script id="yandex-metrika" strategy="afterInteractive">
      {`
        (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();
        for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}
        k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
        (window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");
        ym(${YM_COUNTER_ID}, "init", {defer:true, clickmap:true, trackLinks:true, accurateTrackBounce:true, webvisor:true});
      `}
    </Script>
  );
};
