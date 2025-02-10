// import { Banner } from './Banner';
import Footer  from './Footer';
import Hero from './Hero';
import VerticalFeatures from './VerticalFeatures';

const Base = () => (
  <div className="text-gray-600 antialiased">
    <Hero />
    <VerticalFeatures />
    {/* <Banner /> */}
    <Footer />
  </div>
);

export default Base;
