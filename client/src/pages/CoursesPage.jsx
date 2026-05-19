import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Star, Clock, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const CoursesPage = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ["All", "Web Development", "AI & ML", "Data Science", "Cyber Security", "UI/UX Design"];

  const courses = [
    { id: 1, title: "Modern Full-Stack Web Development", category: "Web Development", instructor: "Dr. Sarah Johnson", rating: 4.8, students: "1.2k", price: "$49", duration: "12 weeks", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=400" },
    { id: 2, title: "AI & Machine Learning for Beginners", category: "AI & ML", instructor: "Prof. Alan Turing", rating: 4.9, students: "3.5k", price: "$79", duration: "16 weeks", image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=400" },
    { id: 3, title: "Data Science with Python & R", category: "Data Science", instructor: "Emily Chen", rating: 4.7, students: "2.1k", price: "$59", duration: "10 weeks", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=400" },
    { id: 4, title: "Cyber Security Fundamentals", category: "Cyber Security", instructor: "John Wick", rating: 4.6, students: "1.8k", price: "$69", duration: "8 weeks", image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=400" },
    { id: 5, title: "Mastering UI/UX Design", category: "UI/UX Design", instructor: "Gary Simon", rating: 4.9, students: "4.2k", price: "$39", duration: "6 weeks", image: "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&q=80&w=400" },
    { id: 6, title: "Advanced React & Redux", category: "Web Development", instructor: "Kent C. Dodds", rating: 4.8, students: "5k", price: "$89", duration: "10 weeks", image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=400" },
  ];

  const filteredCourses = courses.filter(c => 
    (selectedCategory === 'All' || c.category === selectedCategory) &&
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pt-32 pb-20 bg-transparent min-h-screen">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8">
          <div className="text-left w-full md:w-auto">
            <h1 className="text-4xl font-bold text-secondary mb-2">Explore Courses</h1>
            <p className="text-gray-500">Pick the best course to boost your career.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Search courses..."
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl outline-none focus:border-primary transition-all shadow-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button className="btn-primary py-3 px-6 flex items-center gap-2 w-full sm:w-auto justify-center">
              <Filter size={20} /> Filter
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="flex overflow-x-auto gap-4 mb-12 pb-4 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2.5 rounded-full font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat 
                ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                : 'bg-white text-gray-500 border border-gray-200 hover:border-primary/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <motion.div 
              key={course.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -10 }}
              className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all"
            >
              <div className="relative h-48 overflow-hidden">
                <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-primary shadow-sm">
                  {course.category}
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-yellow-400 mb-3">
                  <div className="flex">
                    {[1,2,3,4,5].map(i => <Star key={i} size={14} fill={i <= Math.floor(course.rating) ? "currentColor" : "none"} />)}
                  </div>
                  <span className="text-sm font-bold text-gray-600">{course.rating} ({course.students})</span>
                </div>
                <h3 className="text-xl font-bold text-secondary mb-2 line-clamp-1">{course.title}</h3>
                <p className="text-sm text-gray-500 mb-6">Instructor: {course.instructor}</p>
                
                <div className="flex items-center gap-4 text-xs text-gray-400 mb-6">
                  <div className="flex items-center gap-1">
                    <Clock size={14} /> {course.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen size={14} /> 12 Modules
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-gray-50 pt-6">
                  <span className="text-2xl font-bold text-secondary">{course.price}</span>
                  <Link to={`/course/${course.id}`} className="btn-primary py-2 px-6 text-sm">
                    Enroll Now
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-400">No courses found matching your criteria.</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;
