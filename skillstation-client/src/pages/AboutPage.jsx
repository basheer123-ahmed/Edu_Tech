import React from 'react';
import { motion } from 'framer-motion';
import { Target, Eye, Users, Award, ShieldCheck } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="pt-32 pb-20">
      {/* Story Section */}
      <section className="container mx-auto px-4 mb-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold text-secondary mb-8"
          >
            Empowering the Next Generation of <span className="text-primary">Global Talent</span>
          </motion.h1>
          <p className="text-xl text-gray-500 leading-relaxed">
            SkilStation was founded in 2024 with a simple mission: to bridge the gap between education and employment. 
            We use cutting-edge AI to help students discover their potential, master high-demand skills, and connect with 
            the world's most innovative companies.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-secondary py-20 mb-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center text-white">
            {[
              { label: "Active Learners", value: "50k+" },
              { label: "Partner Companies", value: "500+" },
              { label: "Courses Offered", value: "1,200+" },
              { label: "Success Rate", value: "94%" },
            ].map((stat, idx) => (
              <div key={idx}>
                <h3 className="text-4xl font-bold text-primary mb-2">{stat.value}</h3>
                <p className="text-gray-400 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="container mx-auto px-4 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="card-premium p-10">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-8">
              <Target size={32} />
            </div>
            <h2 className="text-3xl font-bold text-secondary mb-4">Our Mission</h2>
            <p className="text-gray-500 text-lg">
              To provide accessible, high-quality education and career opportunities to every student, 
              regardless of their background, using artificial intelligence to personalize the journey.
            </p>
          </div>
          <div className="card-premium p-10">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-8">
              <Eye size={32} />
            </div>
            <h2 className="text-3xl font-bold text-secondary mb-4">Our Vision</h2>
            <p className="text-gray-500 text-lg">
              To become the world's leading ecosystem for skill development and recruitment, where 
              talent is recognized by ability rather than just a degree.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold text-secondary mb-16">Our Core Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: <ShieldCheck size={28} />, title: "Integrity", desc: "We prioritize trust and transparency in everything we do." },
            { icon: <Award size={28} />, title: "Excellence", desc: "We strive for the highest quality in our platform and content." },
            { icon: <Users size={28} />, title: "Community", desc: "We believe in the power of collaboration and shared growth." },
          ].map((value, idx) => (
            <div key={idx} className="p-8 border border-gray-100 rounded-3xl hover:border-primary/20 transition-all">
              <div className="text-primary mb-6 flex justify-center">{value.icon}</div>
              <h3 className="text-xl font-bold text-secondary mb-2">{value.title}</h3>
              <p className="text-gray-500">{value.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
