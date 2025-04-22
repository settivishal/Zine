import Footer  from './Footer';
import Hero from './Hero';
import {VerticalFeatures} from './VerticalFeatures';

const Base = () => (
  <div className="bg-primary-light text-gray-600 antialiased">
    <Hero />
    <VerticalFeatures />
    <Footer />
  </div>
);

export default Base;
