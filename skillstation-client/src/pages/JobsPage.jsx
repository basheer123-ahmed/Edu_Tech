import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Briefcase, DollarSign, Building2, ExternalLink } from 'lucide-react';

const JobsPage = () => {
  const [search, setSearch] = useState('');

  const jobs = [
    { id: 1, title: "Senior React Developer", company: "Meta", location: "Menlo Park, CA (Remote)", type: "Full-time", salary: "$150k - $220k", skills: ["React", "TypeScript", "Node.js"], logo: "https://logo.clearbit.com/meta.com" },
    { id: 2, title: "Frontend Engineer", company: "Aribnb", location: "San Francisco, CA", type: "Hybrid", salary: "$130k - $180k", skills: ["React", "Next.js", "Tailwind"], logo: "https://logo.clearbit.com/airbnb.com" },
    { id: 3, title: "Full-Stack Developer", company: "Stripe", location: "Remote", type: "Full-time", salary: "$140k - $200k", skills: ["Node.js", "PostgreSQL", "React"], logo: "https://logo.clearbit.com/stripe.com" },
    { id: 4, title: "UI/UX Designer", company: "Adobe", location: "San Jose, CA", type: "Contract", salary: "$90k - $120k", skills: ["Figma", "Adobe XD", "Prototyping"], logo: "https://logo.clearbit.com/adobe.com" },
    { id: 5, title: "Backend Engineer", company: "Netflix", location: "Los Gatos, CA", type: "Full-time", salary: "$160k - $250k", skills: ["Java", "Spring Boot", "AWS"], logo: "https://logo.clearbit.com/netflix.com" },
    { id: 6, title: "Software Engineer Intern", company: "Google", location: "Mountain View, CA", type: "Internship", salary: "$8k/mo", skills: ["C++", "Python", "Data Structures"], logo: "https://logo.clearbit.com/google.com" },
  ];

  const filteredJobs = jobs.filter(j => 
    j.title.toLowerCase().includes(search.toLowerCase()) || 
    j.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pt-32 pb-20 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-5xl font-bold text-secondary mb-6">Find Your <span className="text-primary">Dream Job</span></h1>
          <p className="text-xl text-gray-500 mb-10">We connect you with the top tech companies looking for talented individuals like you.</p>
          
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
            <input 
              type="text" 
              placeholder="Search by role or company..."
              className="w-full pl-16 pr-32 py-5 bg-white border border-gray-200 rounded-[2rem] outline-none focus:border-primary transition-all shadow-xl"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 btn-primary py-3 px-8">
              Search
            </button>
          </div>
        </div>

        {/* Filters and Stats */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <p className="text-gray-500 font-medium">Showing <span className="text-secondary font-bold">{filteredJobs.length}</span> results</p>
          <div className="flex gap-4">
            <select className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-primary">
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Contract</option>
              <option>Internship</option>
            </select>
            <select className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-primary">
              <option>Remote</option>
              <option>On-site</option>
              <option>Hybrid</option>
            </select>
          </div>
        </div>

        {/* Job Listings */}
        <div className="space-y-6 max-w-5xl mx-auto">
          {filteredJobs.map((job) => (
            <motion.div 
              key={job.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.01 }}
              className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all group"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl p-2 border border-gray-100 flex items-center justify-center shrink-0">
                    <img src={job.logo} alt={job.company} className="max-w-full h-auto grayscale group-hover:grayscale-0 transition-all" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-secondary group-hover:text-primary transition-colors">{job.title}</h3>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-gray-500 font-medium">
                      <span className="flex items-center gap-1"><Building2 size={16} /> {job.company}</span>
                      <span className="flex items-center gap-1"><MapPin size={16} /> {job.location}</span>
                      <span className="flex items-center gap-1"><Briefcase size={16} /> {job.type}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col md:items-end gap-2 w-full md:w-auto">
                  <span className="text-xl font-bold text-secondary flex items-center gap-1">
                    <DollarSign size={20} className="text-green-500" /> {job.salary}
                  </span>
                  <p className="text-sm text-gray-400">Posted 2 days ago</p>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-50 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <span key={skill} className="px-4 py-1.5 bg-gray-100 text-gray-600 rounded-full text-xs font-bold">
                      {skill}
                    </span>
                  ))}
                </div>
                <button className="btn-primary py-3 px-10 flex items-center gap-2 w-full md:w-auto justify-center">
                  Apply Now <ExternalLink size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobsPage;
