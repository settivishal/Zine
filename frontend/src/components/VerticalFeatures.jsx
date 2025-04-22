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
    <div className={verticalFeatureClass}>
      <div className="w-full text-center sm:w-1/2 sm:px-6">
        <h3 className="text-3xl font-semibold text-gray-900">{props.title}</h3>
        <div className="mt-6 text-xl leading-9">{props.description}</div>
      </div>

      <div className="w-full p-6 sm:w-1/2">
        <img src={`${props.image}`} alt={props.imageAlt} />
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
        description="Home page displays all your blogs along with the calendar and tags on the left.
        Our features enable the users to create, edit and delete their blogs and also add tags to their blogs."
        image="/images/homePage.png"
        imageAlt="First feature alt text"
      />
      <VerticalFeatureRow
        title="Profile Page"
        description="The Profile page"
        image="/images/profilePage.png"
        imageAlt="Second feature alt text"
        reverse
      />
      <VerticalFeatureRow
        title="Blog structure and features"
        description="The Blog page contains everything the user wants to document and can be published to specific set of emails or publicly"
        image="/images/blogPage.png"
        imageAlt="Third feature alt text"
      />
    </Section>
  </div>
);

export { VerticalFeatures, VerticalFeatureRow };