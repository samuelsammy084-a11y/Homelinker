import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FeaturedProperties from "./components/FeaturedProperties";
import PopularAreas from "./components/PopularAreas";
import WhyChooseUs from "./components/WhyChooseUs";
import Footer from "./components/Footer";
export default function Home() {
  return (
    <main className="min-h-screen bg-[#F8F6F1]">
      <Navbar />
      <Hero />
      <FeaturedProperties />
       <PopularAreas />
      <WhyChooseUs />
      <Footer />
    </main>
  );
}