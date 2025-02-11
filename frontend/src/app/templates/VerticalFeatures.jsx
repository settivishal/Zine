import VerticalFeatureRow from './Components/VerticalFeatureRow';
import Section from '../layout/Section';
import React from 'react';

const VerticalFeatures = () => (
  <div className='bg-gray-100'>
    <Section
      title="Our Features"
      description="The Landing page will be improvised with more featured content on our website in the upcmoing sprints."
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
