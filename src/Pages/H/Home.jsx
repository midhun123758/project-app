import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
// import { CartContext } from '../../context/CartContext';
import axios from 'axios';
const quotes = [
 "MONARCH isn't just fashion — it's the art of ruling your style.",
"Every thread tells a story of elegance and confidence.",
 "Where timeless design meets the power of individuality.",
 "Dress like royalty, live with purpose — that's the MONARCH way.",
 "Crafted for those who dare to stand above the ordinary.",
];
import Modal from './Modal';
import { AuthContext } from '../../context/AuthContext';

export default function Home() {

  const { user } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [time,setTime]=useState(500);
  const images = [
   "/assets/added.webp",
    "/assets/2.jpg",
    "/assets/3.jpg",
  ];
  const [hoveredItem, setHoveredItem] = useState(null);
  const [current, setCurrent] = useState(0);
  const [items, setItems] = useState([]);
  const [hoveredName, setHoveredName] = useState("PANTS");

  const names = [
    "PANTS",
    "SHIRTS",
    "TSHIRTS",
  ];

  useEffect(() => {
     const userData = localStorage.getItem("token");
    if (userData) return;
    const timer = setTimeout(() => {
      setShowModal(true); 
    },time);

   
    return () => clearTimeout(timer); 
   
  
},[]);
 
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

   useEffect(() => {
      axios 
      .get("http://monarch-app.duckdns.org/products/")
      .then((res) => {
  
        setItems(res.data)
    })
     
     .catch((err) => console.error("Error fetching dresses:", err));
    
     
  }, []);
  
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  
 
  return (
    <div className="text-gray-1000">
      <div >
        <Modal show={showModal} onClose={() => setShowModal(false)} />

      </div>

      {/* Hero Section - Made responsive */}
      <section className="relative w-full h-[100vh] overflow-hidden">
        <img
          src="/assets/midhun5.jpg"
          alt="Tech Lifestyle Banner"
          className="object-cover w-full h-[130vh] brightness-85"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent flex flex-col items-center justify-center text-center px-4 space-y-4 md:space-y-6">
          <h1 className="font-[Playfair_Display] font-bold italic uppercase tracking-wider text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white drop-shadow-lg">
            Elevate Your Style
          </h1>
          <hr className="border-t border-white/40 w-16 sm:w-20 md:w-24 mx-auto" />
          <button
            className="px-8 sm:px-10 md:px-12 py-2 md:py-3 bg-white text-black font-semibold hover:bg-white/40 transition-all duration-300 font-[Cinzel] tracking-wider uppercase text-sm md:text-base"
            onClick={() => navigate('/explore')}
          >
            Explore
          </button>
        </div>
      </section>

      {/* Two Column Grid Section - Made responsive */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 py-8 md:py-12 px-4 md:px-5 bg-gray-100">
        <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[135vh] overflow-hidden group">
          <img 
            src="/assets/add1.jpg"
            alt="Tech Lifestyle Banner"
            className="relative w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent flex flex-col items-center justify-center text-center px-4 space-y-2 sm:space-y-3 md:space-y-6">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold tracking-tight text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)] font-[Poppins]">
              Dress Like Royalty<br className="hidden sm:block" />Live with Purpose.
            </h1>
            <p className="max-w-2xl text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-white/80 font-light font-[Poppins] px-2">
              Discover premium designs and modern solutions crafted for creators like you.
            </p>
          </div>
        </div>

        <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[135vh] overflow-hidden group">
          <img
            src="/assets/add2.jpg"
            alt="Tech Lifestyle Banner"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent flex flex-col items-center justify-center text-center px-4 space-y-2 sm:space-y-3 md:space-y-6">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold tracking-tight text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)] font-[Poppins]">
              <button onClick={() => navigate("/offer1")} className="hover:opacity-90 transition">Get 30% Offer</button>
            </h1>
            <p className="max-w-2xl text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-white/80 font-light font-[Poppins] px-2">
              Discover premium designs and modern solutions crafted for creators like you.
            </p>
          </div>
        </div>
      </section>

      {/* About Section - Made responsive */}
      <div className="h-[400vh] bg-black text-white font-serif">
        <div className="sticky top-0 h-screen flex items-center justify-center">
          <img 
            src="/assets/back1.jpg" 
            alt="Tech Lifestyle Banner"
            className="w-full h-full object-cover opacity-45"
          />
          
          <div className="absolute top-16 sm:top-20 md:top-25 left-1/2 transform -translate-x-1/2 z-20">
            <h2 className="text-xl sm:text-2xl md:text-3xl tracking-wide text-white drop-shadow-lg">
              About
            </h2>
            <div className="w-12 sm:w-16 md:w-20 h-1 bg-white mx-auto mt-2 sm:mt-3"></div>
          </div>
          
          {quotes.map((quote, index) => {
            const start = index * window.innerHeight;
            const end = start + window.innerHeight;
            const visible = scrollY >= start && scrollY < end;
            const opacity = visible ? 1 : 0;

            return (
              <div
                key={index}
                className="absolute text-center px-4 sm:px-6 md:px-12 lg:px-20 transition-opacity duration-1000 ease-in-out max-w-5xl"
                style={{ opacity }}
              >
                <h1 className="text-base sm:text-lg md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl leading-relaxed">
                  {quote}
                </h1>
              </div>
            );
          })}
        </div>
      </div>

      {/* New Arrivals Section - Horizontal scrolling on mobile */}
      <div className="bg-white">
        {/* Mobile View - Horizontal Scroll */}
        <div className="md:hidden py-6">
          {/* Section Header */}
          <div className="px-4 mb-6">
            <h1 className="text-3xl font-bold mb-2 text-gray-900">
              New Arrivals
            </h1>
            <p className="text-sm text-gray-600">
              Premium quality meets contemporary design
            </p>
          </div>

          {/* Horizontal Scroll Container */}
          <div className="overflow-x-auto scrollbar-hide">
            {items.length === 0 ? (
              <div className="flex gap-4 px-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex-shrink-0 w-[85vw] animate-pulse">
                    <div className="bg-gray-300 h-[75vh] rounded-lg mb-3"></div>
                    <div className="bg-gray-300 h-4 rounded mb-2"></div>
                    <div className="bg-gray-300 h-4 w-24 rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex gap-4 px-4 pb-2">
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex-shrink-0 w-[85vw]"
                  >
                    <div className="relative mb-3 overflow-hidden rounded-lg shadow-lg">
                      <img
                        onClick={() => navigate("/product", { state: { product: item } })}
                        src={item.img1}
                        alt={item.name}
                        className="w-full h-[75vh] object-cover cursor-pointer"
                      />
                      <div className="absolute bottom-4 left-4 right-4">
                    
                      </div>
                      {/* Item indicator */}
                     
                    </div>
                    <div className="text-center px-2">
                      <h3 className="font-semibold text-gray-900 text-base mb-1">
                        {item.name}
                      </h3>
                      <p className="text-gray-900 font-bold text-lg">
                        ₹{item.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Scroll indicator */}
        
        </div>

        {/* Desktop View - Side by Side */}
        <div className="hidden md:flex min-h-screen">
          <div className="relative z-10 bg-white w-full">
            <div className="flex flex-row min-h-screen">
              {/* Left Side - Fixed Hero Section */}
              <div className="w-1/2 flex-shrink-0">
                <div className="sticky top-0 h-screen overflow-hidden">
                  <div className="relative h-full">
                    <img
                      src={images[0]}
                      alt="Hero"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20"></div>
                    
                    <div className="absolute inset-0 flex flex-col justify-center items-start px-12 lg:px-16 text-white">
                      <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 leading-tight">
                        New Arrivals
                      </h1>
                      <p className="text-lg lg:text-xl mb-8 max-w-md">
                        Premium quality meets contemporary design in our latest collection
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Product Grid */}
              <div id="new-arrivals" className="w-1/2 flex-grow overflow-y-auto pt-20">
                <div className="p-8">
                  {items.length === 0 ? (
                    <div className="grid grid-cols-2 gap-8">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                          <div className="bg-gray-300 h-96 rounded-lg mb-4"></div>
                          <div className="bg-gray-300 h-4 rounded mb-2"></div>
                          <div className="bg-gray-300 h-4 w-24 rounded"></div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-8">
                      {items.map((item) => (
                        <div
                          onMouseEnter={() => setHoveredItem(item.id)}
                          onMouseLeave={() => setHoveredItem(null)}
                          key={item.id}
                          className="group"
                        >
                          <div className="relative mb-4 overflow-hidden rounded-lg">
                            <img
                             onClick={() => navigate("/product", { state: { product: item } })}
                              src={hoveredItem === item.id ? item.img2 : item.img1}
                              alt={item.name}
                              className="w-full h-96 object-cover group-hover:scale-110 transition-transform duration-500 cursor-pointer"
                            />
                          
                          </div>
                          <div className="text-center">
                            <h3 className="font-medium text-gray-900 text-lg mb-1">
                              {item.name}
                            </h3>
                            <p className="text-gray-900 font-semibold text-xl">
                              ₹{item.price}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Section: Names and Hover Images - Made responsive */}
      <section className="flex flex-col-reverse md:flex-row min-h-screen">
        <div className="w-full md:w-1/2 bg-white p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col justify-center">
          <div className="space-y-2 sm:space-y-3 md:space-y-4">
            {names.map((name) => (
              <button
                key={name}
                onClick={() => navigate(`/${name.toLowerCase()}`)}
                onMouseEnter={() => setHoveredName(name)}
                onMouseLeave={() => setHoveredName("PANTS")}
                className="w-full py-2 sm:py-3 md:py-4 px-2 sm:px-4 md:px-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl text-gray-800 transition-colors duration-300 hover:text-gray-400 text-left font-bold"
              >
                {name}
              </button>
            ))}
          </div>
        </div>
        <div className="w-full md:w-1/2 flex items-center justify-center">
          <div className="w-full">
            <img
              src={`/assets/${hoveredName.toLowerCase()}.jpg`}
              alt={`${hoveredName} Image`}
              className="w-full h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-screen object-cover"
            />
          </div>
        </div>
      </section>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}