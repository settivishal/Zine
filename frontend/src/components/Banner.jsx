import React from 'react';

// import { Button } from './Components/Button';
// import CTABanner from './Components/CTABanner';
import Section from './Section';


const CTABanner = (props) => (
  <div className="flex flex-col rounded-md bg-primary-100 p-4 text-center sm:flex-row sm:items-center sm:justify-between sm:p-12 sm:text-left">
    <div className="text-2xl font-semibold">
      <div className="text-gray-900">{props.title}</div>
      <div className="text-primary-500">{props.subtitle}</div>
    </div>

    <div className="whitespace-no-wrap mt-3 sm:ml-2 sm:mt-0">
      {props.button}
    </div>
  </div>
);


const Banner = () => (
  <Section>
    <CTABanner
      title="Lorem ipsum dolor sit amet consectetur adipisicing elit."
      subtitle="Start your Free Trial."
    />
  </Section>
);

export default Banner;