/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  StarIcon, 
  HeartIcon, 
  SparklesIcon, 
  UserGroupIcon,
  TrophyIcon,
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
  ChatBubbleLeftIcon,
  ShareIcon,
  BookmarkIcon
} from '@heroicons/react/24/outline';

const About: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [likedPosts, setLikedPosts] = useState<number[]>([]);

  const teamMembers = [
    {
      name: "Chef Ahmed Khan",
      role: "Executive Chef",
      image: "https://images.unsplash.com/photo-1581299894007-aaa50297cf16?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      bio: "With over 15 years of experience in traditional Pakistani cuisine, Chef Ahmed brings authentic flavors and innovation to every dish. His biryani and karahi are legendary in the community."
    },
    {
      name: "Fatima Ali",
      role: "Restaurant Manager",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      bio: "Fatima ensures every guest experiences exceptional Pakistani hospitality and memorable dining moments. She speaks Urdu, English, and Punjabi fluently."
    },
    {
      name: "Usman Malik",
      role: "Head Mixologist",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      bio: "Usman crafts unique beverages that perfectly complement our traditional Pakistani dishes. His lassi and traditional drinks are customer favorites."
    }
  ];

  const achievements = [
    {
      title: "Best Pakistani Restaurant 2023",
      description: "Awarded by Pakistani Food Critics Association",
      icon: TrophyIcon
    },
    {
      title: "5-Star Rating",
      description: "Consistently rated 5 stars by our Pakistani food lovers",
      icon: StarIcon
    },
    {
      title: "Top Halal Restaurant",
      description: "Featured in City's Top Halal Restaurants Guide",
      icon: SparklesIcon
    }
  ];

  const values = [
    {
      title: "Authenticity",
      description: "We preserve traditional Pakistani recipes and cooking methods passed down through generations.",
      icon: StarIcon
    },
    {
      title: "Halal Excellence",
      description: "Committed to serving only halal food with the highest quality standards.",
      icon: SparklesIcon
    },
    {
      title: "Family Values",
      description: "Creating a warm, family-friendly atmosphere where everyone feels welcome.",
      icon: HeartIcon
    },
    {
      title: "Pakistani Heritage",
      description: "Celebrating and sharing the rich culinary heritage of Pakistan with the world.",
      icon: UserGroupIcon
    }
  ];

  const galleryImages = [
    {
      url: "https://images.unsplash.com/photo-1563245372-f21724e3856d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
      title: "Traditional Pakistani Interior",
      description: "Authentic Pakistani decor with traditional rugs and modern amenities"
    },
    {
      url: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
      title: "Signature Chicken Karahi",
      description: "Our award-winning traditional karahi cooked in authentic Pakistani style"
    },
    {
      url: "https://images.unsplash.com/photo-1563245372-f21724e3856d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
      title: "Family Dining Area",
      description: "Spacious family dining area perfect for Pakistani family gatherings"
    },
    
    {
      url: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
      title: "Traditional Tandoor",
      description: "Our traditional tandoor oven for fresh naan and roti"
    },
    {
      url: "https://images.unsplash.com/photo-1563245372-f21724e3856d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
      title: "Family Dining Area",
      description: "Spacious family dining area perfect for Pakistani family gatherings"
    },
    {
      url: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
      title: "Traditional Tandoor",
      description: "Our traditional tandoor oven for fresh naan and roti"
    }
  ];

  const testimonials = [
    {
      name: "Ahmed Khan",
      role: "Pakistani Food Critic",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      text: "The biryani here tastes exactly like my grandmother's recipe! The authentic Pakistani flavors and traditional cooking methods are outstanding.",
      rating: 5
    },
    {
      name: "Fatima Ali",
      role: "Regular Customer",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      text: "I've been bringing my family here for years. The halal food is excellent, and the staff treats us like family. The nihari is absolutely perfect!",
      rating: 5
    },
    {
      name: "Usman Malik",
      role: "Food Blogger",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      text: "This restaurant truly represents Pakistani cuisine at its finest. The karahi and seekh kebabs are legendary. A must-visit for anyone who loves authentic Pakistani food!",
      rating: 5
    }
  ];

  const socialMediaPosts = [
    {
      id: 1,
      username: "chef_ahmed_khan",
      userImage: "https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
      caption: "Our new signature Chicken Biryani is now available! 🍽️ #PakistaniFood #Biryani #Halal",
      likes: 234,
      comments: 45,
      timestamp: "2 hours ago"
    },
    {
      id: 2,
      username: "dastarkhwan_official",
      userImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
      caption: "Behind the scenes of our traditional tandoor oven 👨‍🍳 #PakistaniCuisine #Tandoor #Naan",
      likes: 567,
      comments: 89,
      timestamp: "5 hours ago"
    },
    {
      id: 3,
      username: "usman_mixology",
      userImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
      caption: "Crafting the perfect traditional Lassi 🥛 #Lassi #PakistaniDrinks #Traditional",
      likes: 432,
      comments: 67,
      timestamp: "1 day ago"
    }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleLike = (postId: number) => {
    setLikedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Hero Section */}
      <div className="relative h-[60vh] bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')" }}>
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white"
          >
            <h1 className="text-5xl font-bold mb-4">Dastarkhwan - Our Story</h1>
            <p className="text-xl max-w-2xl mx-auto">Preserving Pakistani culinary heritage, one dish at a time</p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Story Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mb-20"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Pakistani Journey</h2>
          <div className="prose prose-lg mx-auto">
            <p className="text-gray-600 leading-relaxed">
              Founded in 2010, Dastarkhwan began with a simple vision: to bring authentic Pakistani cuisine to our community. 
              What started as a small family-owned establishment has grown into one of the city's most celebrated 
              Pakistani dining destinations, serving halal food with traditional recipes passed down through generations.
            </p>
            <p className="text-gray-600 leading-relaxed mt-4">
              Our commitment to authenticity has remained unwavering throughout the years. We source the finest halal 
              ingredients from trusted suppliers, maintain traditional cooking methods, and continuously preserve our 
              Pakistani culinary heritage to provide our guests with unforgettable dining experiences that taste like home.
            </p>
          </div>
        </motion.section>

        {/* Social Media Feed Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Follow Our Journey</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {socialMediaPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className="p-4 flex items-center space-x-3">
                  <img
                    src={post.userImage}
                    alt={post.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold">{post.username}</p>
                    <p className="text-sm text-gray-500">{post.timestamp}</p>
                  </div>
                </div>
                <div className="relative aspect-w-16 aspect-h-9">
                  <img
                    src={post.image}
                    alt={post.caption}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center space-x-4 mb-3">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center space-x-1 ${
                        likedPosts.includes(post.id) ? 'text-red-500' : 'text-gray-500'
                      } hover:text-red-500 transition-colors`}
                    >
                      <HeartIcon className={`h-6 w-6 ${
                        likedPosts.includes(post.id) ? 'fill-current' : ''
                      }`} />
                      <span>{post.likes + (likedPosts.includes(post.id) ? 1 : 0)}</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-500 hover:text-orange-500 transition-colors">
                      <ChatBubbleLeftIcon className="h-6 w-6" />
                      <span>{post.comments}</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-500 hover:text-orange-500 transition-colors">
                      <ShareIcon className="h-6 w-6" />
                    </button>
                    <button className="ml-auto text-gray-500 hover:text-orange-500 transition-colors">
                      <BookmarkIcon className="h-6 w-6" />
                    </button>
                  </div>
                  <p className="text-gray-800">
                    <span className="font-semibold mr-2">{post.username}</span>
                    {post.caption}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Photo Gallery Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Photo Gallery</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="relative group cursor-pointer"
                onClick={() => setSelectedImage(image.url)}
              >
                <div className="aspect-w-16 aspect-h-9 overflow-hidden rounded-xl">
                  <img
                    src={image.url}
                    alt={image.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 rounded-xl flex items-center justify-center">
                  <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center p-4">
                    <h3 className="font-semibold mb-1">{image.title}</h3>
                    <p className="text-sm">{image.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Testimonials Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">What Our Guests Say</h2>
          <div className="relative max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="bg-white p-8 rounded-xl shadow-lg"
              >
                <div className="flex items-center mb-6">
                  <img
                    src={testimonials[currentTestimonial].image}
                    alt={testimonials[currentTestimonial].name}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h3 className="text-xl font-semibold">{testimonials[currentTestimonial].name}</h3>
                    <p className="text-orange-500">{testimonials[currentTestimonial].role}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <StarIcon key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 italic text-lg">"{testimonials[currentTestimonial].text}"</p>
              </motion.div>
            </AnimatePresence>
            
            <div className="flex justify-center mt-6 space-x-4">
              <button
                onClick={prevTestimonial}
                className="p-2 rounded-full bg-white shadow-lg hover:bg-orange-50 transition-colors"
              >
                <ChevronLeftIcon className="h-6 w-6 text-orange-500" />
              </button>
              <button
                onClick={nextTestimonial}
                className="p-2 rounded-full bg-white shadow-lg hover:bg-orange-50 transition-colors"
              >
                <ChevronRightIcon className="h-6 w-6 text-orange-500" />
              </button>
            </div>
          </div>
        </motion.section>

        {/* Values Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-lg"
              >
                <value.icon className="h-12 w-12 text-orange-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Team Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">The Faces Behind the Magic</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className="h-64 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-orange-500 mb-3">{member.role}</p>
                  <p className="text-gray-600">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Achievements Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Our Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-lg text-center"
              >
                <achievement.icon className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{achievement.title}</h3>
                <p className="text-gray-600">{achievement.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Contact Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Visit Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center space-x-4">
              <MapPinIcon className="h-6 w-6 text-orange-500" />
              <div>
                <h3 className="font-semibold">Location</h3>
                <p className="text-gray-600">123 Pakistani Food Street, City, Country</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ClockIcon className="h-6 w-6 text-orange-500" />
              <div>
                <h3 className="font-semibold">Hours</h3>
                <p className="text-gray-600">Mon-Sun: 11:00 AM - 11:00 PM (Halal Certified)</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <PhoneIcon className="h-6 w-6 text-orange-500" />
              <div>
                <h3 className="font-semibold">Contact</h3>
                <p className="text-gray-600">+92-300-123-4567 (Urdu/English)</p>
              </div>
            </div>
          </div>
        </motion.section>
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-4xl w-full"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 text-white hover:text-orange-500 transition-colors"
              >
                <XMarkIcon className="h-8 w-8" />
              </button>
              <img
                src={selectedImage}
                alt="Gallery"
                className="w-full h-auto rounded-lg shadow-2xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default About; 