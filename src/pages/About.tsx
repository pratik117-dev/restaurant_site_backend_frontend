import { useState } from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  const [activeStory, setActiveStory] = useState(0);


  const stories = [
    {
      year: "2024",
      title: "The Beginning",
      description: "Started as a small family kitchen with a passion for authentic flavors and fresh ingredients."
    },
    {
      year: "2025",
      title: "Growth & Recognition",
      description: "Expanded our dining space and received our first culinary award for excellence in service."
    },
    {
      year: "2026 ",
      title: "Plan",
      description: "Willing to serve thousands of happy customers while maintaining our commitment to quality and tradition."
    }
  ];

  const team = [
    {
      name: "Chef Meghraj",
      role: "Head Chef",
      image: "👨‍🍳",
      description: "5 years of experience"
    },
    {
      name: "Keshav Nepal",
      role: "Restaurant Manager",
      image: "👨‍🍳",
      description: "Expert in hospitality management"
    },
    {
      name: "Bhuwan Magrati",
      role: "Sous Chef",
      image: "👨‍🍳",
      description: "Specialist in Chicken Item "
    },
  ];

  const values = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Quality First",
      description: "We never compromise on ingredient quality or preparation standards"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      title: "Made with Love",
      description: "Every dish is crafted with passion and attention to detail"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: "Community Focus",
      description: "Supporting local farmers and giving back to our community"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Sustainability",
      description: "Committed to eco-friendly practices and reducing our environmental impact"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      {/* Map Section */}
      <div className="w-full h-96 sm:h-[28rem] lg:h-[32rem] relative overflow-hidden">
  <iframe
  src="https://www.google.com/maps?q=26.659696,87.636935&output=embed"
  width="100%"
  height="100%"
  style={{ border: 0 }}
  allowFullScreen
  loading="lazy"
  referrerPolicy="no-referrer-when-downgrade"
  title="Chiya Hub Location"
></iframe>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 sm:p-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">Find Us Here</h2>
            <p className="text-white/90 text-sm sm:text-base flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Pasupati Marga, Morang District, Urlabari, Nepal
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4 sm:mb-6">
            Our Story
          </h1>
          <p className="text-gray-600 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
            A journey of flavors, passion, and dedication to bringing you the finest dining experience
          </p>
        </div>

        {/* Story Section */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-12 mb-12 sm:mb-16 lg:mb-20 border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6">
                Where It All Began
              </h2>
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-6">
                Our restaurant was born from a simple dream: to create a place where food brings people together. 
                What started as a small family kitchen has grown into a beloved dining destination, but our core 
                values remain unchanged.
              </p>
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-6">
                Every dish we serve tells a story of tradition, innovation, and our unwavering commitment to 
                excellence. We source the finest ingredients, honor time-tested recipes, and infuse every plate 
                with creativity and care.
              </p>
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                Today, we're proud to serve our community with the same passion and dedication that inspired 
                us from day one. Thank you for being part of our journey.
              </p>
            </div>

            <div className="space-y-4">
              {stories.map((story, index) => (
                <div
                  key={index}
                  onClick={() => setActiveStory(index)}
                  className={`p-5 sm:p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                    activeStory === index
                      ? 'bg-gradient-to-br from-orange-50 to-red-50 border-orange-300 shadow-lg'
                      : 'bg-white border-gray-200 hover:border-orange-200 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`text-2xl sm:text-3xl font-bold ${
                      activeStory === index ? 'text-orange-600' : 'text-gray-400'
                    }`}>
                      {story.year}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
                        {story.title}
                      </h3>
                      <p className="text-gray-600 text-sm sm:text-base">
                        {story.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-12 sm:mb-16 lg:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-gray-800 mb-8 sm:mb-12">
            Our Values
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300 group"
              >
                <div className="bg-gradient-to-br from-orange-100 to-red-100 w-16 h-16 rounded-2xl flex items-center justify-center text-orange-600 mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                  {value.icon}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-12 sm:mb-16 lg:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-gray-800 mb-4 sm:mb-6">
            Meet Our Team
          </h2>
          <p className="text-gray-600 text-base sm:text-lg text-center max-w-2xl mx-auto mb-8 sm:mb-12">
            The talented individuals who bring our culinary vision to life every day
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 ">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300 text-center group"
              >
                <div className="text-6xl sm:text-7xl mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                  {member.image}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                  {member.name}
                </h3>
                <p className="text-orange-600 font-semibold mb-3 text-sm sm:text-base">
                  {member.role}
                </p>
                <p className="text-gray-600 text-sm sm:text-base">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl shadow-2xl p-8 sm:p-12 lg:p-16 text-white">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
            <div className="text-center">
              <div className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-2 sm:mb-3">
                2+
              </div>
              <p className="text-white/90 text-sm sm:text-base lg:text-lg font-medium">
                Years of Excellence
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-2 sm:mb-3">
                10K+
              </div>
              <p className="text-white/90 text-sm sm:text-base lg:text-lg font-medium">
                Happy Customers
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-2 sm:mb-3">
                100+
              </div>
              <p className="text-white/90 text-sm sm:text-base lg:text-lg font-medium">
                Menu Items
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-2 sm:mb-3">
                3+
              </div>
              <p className="text-white/90 text-sm sm:text-base lg:text-lg font-medium">
                Award Wins
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 sm:mt-16 lg:mt-20 text-center">
          <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 lg:p-16 border border-gray-100">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 sm:mb-6">
              Ready to Experience Our Story?
            </h2>
            <p className="text-gray-600 text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto">
              Join us for an unforgettable dining experience. Reserve your table today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact" >
              <button  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-base sm:text-lg">
                Make a Reservation
              </button>
              </Link>
              <Link to="/">
              <button className="bg-white border-2 border-orange-500 text-orange-600 hover:bg-orange-50 px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-base sm:text-lg">
                View Our Menu
              </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;