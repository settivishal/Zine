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
      // button={
      //   <Link href="https://creativedesignsguru.com/category/nextjs/">
      //     <Button>Get Started</Button>
      //   </Link>
      // }
    />
  </Section>
);

export default Banner;
