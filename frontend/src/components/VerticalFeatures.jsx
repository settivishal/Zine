// import VerticalFeatureRow from './VerticalFeatureRow';
import Section from './Section';
import React from 'react';
import classNames from 'classnames';



import { useRouter } from 'next/navigation';
const VerticalFeatureRow = (props) => {
  const verticalFeatureClass = classNames(
    'mt-20',
    'flex',
    'flex-wrap',
    'items-center',
    {
      'flex-row-reverse': props.reverse,
    },
  );
  const router = useRouter();
  return (
    <div className={verticalFeatureClass}>  // "mt-20 flex flex-wrap items-center flex-row-reverse"
      <div className="w-full text-center sm:w-1/2 sm:px-6">
        <h3 className="text-3xl font-semibold text-gray-900">{props.title}</h3>
        <div className="mt-6 text-xl leading-9">{props.description}</div>
      </div>

      <div className="w-full p-6 sm:w-1/2">
        <img src={`${router.basePath}${props.image}`} alt={props.imageAlt} />
      </div>
    </div>
  );
};


const VerticalFeatures = () => (
  <div className='bg-gray-100'>
    <Section
      title="Our Features"
      description="The Landing page will be improvised with more featured content on our website in the upcoming sprints."
    >
      <VerticalFeatureRow
        title="Home Page"
        description="Demo of the Home page will be displayed here in the image on the left."
        image="/assets/images/feature.svg"
        imageAlt="First feature alt text"
      />
      <VerticalFeatureRow
        title="Profile Page"
        description="Demo of the Profile page of the users will be displayed here in the image on the left."
        image="/assets/images/feature2.svg"
        imageAlt="Second feature alt text"
        reverse
      />
      <VerticalFeatureRow
        title="Blog structure and features"
        description="Demo of the blog that opens from the home page calendar will be displayed here in the video on the left."
        image="/assets/images/feature3.svg"
        imageAlt="Third feature alt text"
      />
    </Section>
  </div>
);

export default VerticalFeatures;
