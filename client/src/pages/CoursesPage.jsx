import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCategories } from '../hooks/useCategories';

const CoursesPage = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { categories: adminCategories } = useCategories();
  const categories = ['All', ...adminCategories];

  const levelColors = {
    'BEGINNER':     'bg-green-500',
    'INTERMEDIATE': 'bg-yellow-500',
    'ADVANCED':     'bg-red-500',
  };

  const courses = [
    { id: 1,  title: "Front End Web Development",       desc: "Build stunning, responsive user interfaces with HTML, CSS, and JavaScript frameworks.",         category: "Web Development",       level: "INTERMEDIATE", image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80&w=600" },
    { id: 2,  title: "Back End Web Development",        desc: "Construct robust server-side applications and APIs with industry-standard technologies.",         category: "Web Development",       level: "INTERMEDIATE", image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600" },
    { id: 3,  title: "Generative AI",                   desc: "Learn to build applications with AI models and prompt engineering techniques.",                   category: "Artificial Intelligence",level: "INTERMEDIATE", image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?auto=format&fit=crop&q=80&w=600" },
    { id: 4,  title: "Data Science with Python",        desc: "Master data analysis, visualization, and predictive modeling using Python ecosystem.",            category: "Data Science",          level: "BEGINNER",     image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600" },
    { id: 5,  title: "Machine Learning & AI",           desc: "Build intelligent systems with supervised and unsupervised learning algorithms.",                  category: "Machine Learning",      level: "INTERMEDIATE", image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=600" },
    { id: 6,  title: "Python Programming",              desc: "Learn Python from fundamentals to advanced concepts for multiple domains.",                        category: "Programming",           level: "BEGINNER",     image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=600" },
    { id: 7,  title: "React.js Mastery",                desc: "Build modern single-page applications with React hooks, context, and Redux.",                     category: "Web Development",       level: "INTERMEDIATE", image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=600" },
    { id: 8,  title: "Full Stack Development",          desc: "Become a complete developer mastering both frontend and backend technologies.",                    category: "Web Development",       level: "ADVANCED",     image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600" },
    { id: 9,  title: "Deep Learning & Neural Networks", desc: "Dive into deep learning architectures, CNNs, RNNs, and transformers.",                            category: "Machine Learning",      level: "ADVANCED",     image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=600" },
    { id: 10, title: "Cyber Security Fundamentals",     desc: "Protect systems and networks from digital attacks with ethical hacking skills.",                   category: "Cyber Security",        level: "BEGINNER",     image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600" },
    { id: 11, title: "UI/UX Design Principles",         desc: "Design beautiful, user-centric interfaces with Figma and modern design systems.",                  category: "UI/UX Design",          level: "BEGINNER",     image: "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&q=80&w=600" },
    { id: 12, title: "AWS Cloud Computing",             desc: "Deploy scalable applications on Amazon Web Services with certification prep.",                     category: "Cloud Computing",       level: "INTERMEDIATE", image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=600" },
    { id: 13, title: "Flutter Mobile Development",      desc: "Build cross-platform mobile apps for iOS and Android with Flutter and Dart.",                      category: "Mobile Development",    level: "INTERMEDIATE", image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=600" },
    { id: 14, title: "Docker & Kubernetes DevOps",      desc: "Master containerization and orchestration for modern cloud-native applications.",                  category: "DevOps",                level: "ADVANCED",     image: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&q=80&w=600" },
    { id: 15, title: "Blockchain Development",          desc: "Build decentralized applications and smart contracts on Ethereum blockchain.",                     category: "Blockchain",            level: "ADVANCED",     image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=600" },
    { id: 16, title: "JavaScript Essentials",           desc: "Master JavaScript from basics to ES6+ features, async programming and DOM manipulation.",          category: "Programming",           level: "BEGINNER",     image: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?auto=format&fit=crop&q=80&w=600" },
    { id: 17, title: "Node.js & Express",               desc: "Create powerful REST APIs and real-time applications with Node.js.",                               category: "Web Development",       level: "INTERMEDIATE", image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?auto=format&fit=crop&q=80&w=600" },
    { id: 18, title: "Computer Vision with OpenCV",     desc: "Build image recognition and object detection systems using OpenCV and Python.",                    category: "Artificial Intelligence",level: "ADVANCED",     image: "https://images.unsplash.com/photo-1535223289429-462dc9e9c998?auto=format&fit=crop&q=80&w=600" },
    { id: 19, title: "SQL & Database Design",           desc: "Design relational databases, write complex queries, and optimize performance.",                    category: "Data Science",          level: "BEGINNER",     image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=600" },
    { id: 20, title: "Natural Language Processing",     desc: "Process and analyze text data using NLP techniques and transformer models.",                       category: "Machine Learning",      level: "ADVANCED",     image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=600" },
    { id: 21, title: "Android Development with Kotlin", desc: "Build native Android applications using Kotlin and the Android SDK.",                              category: "Mobile Development",    level: "INTERMEDIATE", image: "https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?auto=format&fit=crop&q=80&w=600" },
    { id: 22, title: "Network Security & Hacking",      desc: "Learn penetration testing, vulnerability assessment, and ethical hacking techniques.",             category: "Cyber Security",        level: "ADVANCED",     image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=600" },
    { id: 23, title: "TypeScript for Developers",       desc: "Add strong typing to your JavaScript projects with TypeScript best practices.",                    category: "Programming",           level: "INTERMEDIATE", image: "https://images.unsplash.com/photo-1599507593499-a3f7d7d97667?auto=format&fit=crop&q=80&w=600" },
    { id: 24, title: "Google Cloud Platform",           desc: "Build and deploy applications using GCP's powerful cloud infrastructure.",                         category: "Cloud Computing",       level: "INTERMEDIATE", image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600" },
    { id: 25, title: "Vue.js Framework",                desc: "Create dynamic web applications with Vue.js, Vuex, and Vue Router.",                               category: "Web Development",       level: "BEGINNER",     image: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&q=80&w=600" },
    { id: 26, title: "CI/CD Pipeline Automation",       desc: "Set up continuous integration and deployment pipelines with GitHub Actions and Jenkins.",          category: "DevOps",                level: "INTERMEDIATE", image: "https://images.unsplash.com/photo-1667372393913-59a4c66a44b0?auto=format&fit=crop&q=80&w=600" },
    { id: 27, title: "Data Visualization with Tableau", desc: "Create stunning interactive dashboards and visual reports using Tableau.",                         category: "Data Science",          level: "BEGINNER",     image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600" },
    { id: 28, title: "NFT & Web3 Development",          desc: "Create, mint, and trade NFTs and build Web3 dApps on blockchain networks.",                        category: "Blockchain",            level: "INTERMEDIATE", image: "https://images.unsplash.com/photo-1640161704729-cbe966a08476?auto=format&fit=crop&q=80&w=600" },
    { id: 29, title: "iOS Development with Swift",      desc: "Build beautiful native iOS apps using Swift and Xcode for App Store deployment.",                  category: "Mobile Development",    level: "INTERMEDIATE", image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&q=80&w=600" },
    { id: 30, title: "Figma Advanced Design",           desc: "Master advanced Figma features, design systems, prototyping and developer handoff.",               category: "UI/UX Design",          level: "ADVANCED",     image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=600" },
    { id: 31, title: "Prompt Engineering for AI",       desc: "Design effective prompts for LLMs like GPT-4 and Claude to maximize AI output quality.",           category: "Artificial Intelligence",level: "BEGINNER",     image: "https://images.unsplash.com/photo-1684369176170-463e84248b70?auto=format&fit=crop&q=80&w=600" },
    { id: 32, title: "Java Programming Masterclass",    desc: "Learn Java from scratch to advanced OOP, collections, multithreading and Spring Boot.",            category: "Programming",           level: "BEGINNER",     image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=600" },
  ];

  const filteredCourses = courses.filter(c =>
    (selectedCategory === 'All' || c.category === selectedCategory) &&
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-32 pb-20 relative overflow-hidden bg-gradient-to-br from-[#f472b6] via-[#e879f9] to-[#db2777]">
      {/* Background glow elements */}
      <div className="absolute top-1/4 left-10 w-[400px] h-[400px] bg-white/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-10 w-[500px] h-[500px] bg-pink-300/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 w-[350px] h-[350px] bg-pink-100/20 rounded-full blur-[110px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-5xl font-black text-slate-950 tracking-tight leading-none mb-4 drop-shadow-[0_1px_2px_rgba(255,255,255,0.3)]">
            Explore <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-amber-300 to-orange-400">Courses</span>
          </h1>
          <p className="text-slate-900 font-extrabold text-sm md:text-base max-w-xl mx-auto bg-white/40 backdrop-blur-sm p-4 rounded-2xl border border-white/20 shadow-sm inline-block">
            Pick the best course to boost your career — all courses are <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-fuchsia-600 font-black underline decoration-pink-500">Free!</span>
          </p>
        </motion.div>

        {/* Search */}
        <div className="flex justify-center mb-8">
          <div className="relative w-full max-w-lg">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-600" size={20} />
            <input
              type="text"
              placeholder="Search courses..."
              className="w-full pl-12 pr-4 py-3 bg-white/85 backdrop-blur-xl border border-white/40 rounded-full outline-none focus:border-pink-400 focus:bg-white transition-all shadow-2xl text-slate-900 placeholder-slate-500 font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex overflow-x-auto gap-3 mb-10 pb-3 scrollbar-hide justify-start">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full font-extrabold whitespace-nowrap transition-all text-sm border ${
                selectedCategory === cat
                  ? 'bg-white text-pink-600 border-white shadow-xl scale-105'
                  : 'bg-white/45 text-slate-800 border-white/40 hover:bg-white/70 hover:text-slate-900 shadow-sm'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Course Count */}
        <p className="text-slate-900 font-extrabold mb-6 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full inline-block border border-white/30 shadow-sm">
          {filteredCourses.length} courses found
        </p>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04, duration: 0.4 }}
              whileHover={{ y: -6, scale: 1.01 }}
              className="bg-white/85 backdrop-blur-xl border border-white/40 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 flex flex-col"
            >
              {/* Course Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                {/* Level badge — top left */}
                <div className={`absolute top-3 left-3 ${levelColors[course.level]} text-white text-[10px] font-extrabold px-3 py-1 rounded-full tracking-wider`}>
                  {course.level}
                </div>
                {/* Category badge — top right */}
                <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full shadow border border-white/10">
                  {course.category}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-[17px] font-extrabold text-slate-900 mb-2 leading-tight">{course.title}</h3>
                <p className="text-sm text-slate-600 font-semibold leading-relaxed mb-5 flex-1">{course.desc}</p>

                {/* Bottom Row */}
                <div className="flex items-center justify-between pt-4 border-t border-white/20">
                  <span className="text-[22px] font-black bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-fuchsia-600">Free</span>
                  <Link
                    to={`/course/${course.id}`}
                    className="bg-white hover:bg-pink-50 text-pink-600 border border-pink-200/50 font-extrabold text-sm px-6 py-2.5 rounded-full transition-all shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    Enroll Now
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* No results */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-white/75">No courses found matching your search.</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;
