import Hero from '../components/Hero';
import Stats from '../components/Stats';
import Chefs from '../pages/Chef';
import Menu from '../pages/Menu';
import Events from '../pages/Events';
import Testimonials from '../components/Testimonials';
import Contact from '../pages/Contact';

export default function Home({ onNavigate }) {
  return (
    <>
      <Hero onNavigate={onNavigate} />
      <Stats />
      <Chefs />
      <Menu />
      <Events />
      <Testimonials />
      <Contact />
    </>
  );
}