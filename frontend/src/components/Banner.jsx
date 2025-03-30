import Link from 'next/link';
import React from 'react';

// import { Button } from './Components/Button';
import CTABanner from './Components/CTABanner';
import Section from '../layout/Section';

const Banner = () => (
  <Section>
    <CTABanner
      title="Lorem ipsum dolor sit amet consectetur adipisicing elit."
      subtitle="Start your Free Trial."
    />
  </Section>
);

export default Banner;
