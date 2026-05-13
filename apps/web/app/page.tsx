import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
          {/* Video Background */}
          <div className="absolute inset-0 w-full h-full">
            <div className="absolute inset-0 bg-[#F9F7F2]/40 z-10" /> {/* Light Overlay to match cream theme */}
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover opacity-80"
            >
              {/* Reliable Pexels direct MP4 link showing nature/farming */}
              <source src="https://player.vimeo.com/external/498424075.hd.mp4?s=d001e3b6ebf4cb5e0df7e20b39e2494101e4a19b&profile_id=172&oauth2_token_id=57447761" type="video/mp4" />
            </video>
          </div>

          {/* Hero Content */}
          <div className="container relative z-20 px-4 text-center">
            <h1 className="font-heading text-5xl md:text-7xl font-bold text-[#2D3436] mb-6 tracking-tight drop-shadow-sm">
              From Soil to <br className="md:hidden" />
              <span className="italic text-[#4A5D4E]">Your Table</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-[#2D3436]/90 mb-10 font-medium">
              Experience absolute transparency. Watch your harvest live and join community drops for fresh, organic produce straight from the fields of Bangladesh.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="w-full sm:w-auto bg-[#4A5D4E] hover:bg-[#4A5D4E]/90 text-[#F9F7F2] rounded-full px-8 h-14 text-base shadow-lg">
                Explore Live Farms
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-[#2D3436]/20 text-[#2D3436] hover:bg-[#2D3436]/5 bg-transparent rounded-full px-8 h-14 text-base backdrop-blur-sm">
                Join Community Drop
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
