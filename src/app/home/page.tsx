import React from 'react';

import { AboutSection } from './_components/AboutSection/AboutSection';
import { CatalogSection } from './_components/CatalogSection/CatalogSection';
import { DeliverySection } from './_components/DeliverySection/DeliverySection';
import { HeroSection } from './_components/HeroSection/HeroSection';
import { PromotionsPreview } from './_components/PromotionsPreview/PromotionsPreview';

export default function Home() {
  return (
    <>
      <HeroSection />
      <CatalogSection />
      <PromotionsPreview />
      <AboutSection />
      <DeliverySection />
    </>
  );
}
