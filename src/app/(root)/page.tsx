import Banner from "@/components/home/Banner";
import FeaturedServices from "@/components/home/FeaturedServices";
import ServiceCategories from "@/components/home/ServiceCategories";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import HowItWorks from "@/components/home/HowItWorks";
import { getServices } from "@/lib/api/services";
import { IVendorService } from "@/types";

export const metadata = {
  title: "WedPlan | Curated Wedding Planning Platform",
  description: "Discover trusted wedding professionals, explore beautiful services, and bring your dream celebration to life.",
};

export default async function Home() {
  // Fetch verified active services directly from backend API
  const services = (await getServices()) as IVendorService[];

  return (
    <main className="min-h-screen bg-[#FAF6F7]">
      <Banner />
      <FeaturedServices services={services} />
      <ServiceCategories />
      <WhyChooseUs />
      <HowItWorks />
    </main>
  );
}
