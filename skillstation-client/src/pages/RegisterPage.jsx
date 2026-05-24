import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Rocket, Building2, Briefcase } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'STUDENT'
  });
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (error) {
      toast.error('Registration failed. Try again.');
    }
  };

  const roles = [
    { id: 'STUDENT', label: 'Student', icon: <User size={20} /> },
    { id: 'INSTITUTION', label: 'Institution', icon: <Building2 size={20} /> },
    { id: 'COMPANY', label: 'Company', icon: <Briefcase size={20} /> },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 pt-24 pb-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 p-10 lg:p-12"
      >
        <div className="text-center mb-10">
          <div className="inline-flex p-3 bg-primary/10 text-primary rounded-2xl mb-4">
            <Rocket size={32} />
          </div>
          <h1 className="text-3xl font-bold text-secondary">Join SkilStation</h1>
          <p className="text-gray-500 mt-2">Start your journey towards success today</p>
        </div>

        {/* Role Selection */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {roles.map((role) => (
            <button
              key={role.id}
              type="button"
              onClick={() => setFormData({ ...formData, role: role.id })}
              className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                formData.role === role.id 
                ? 'border-primary bg-primary/5 text-primary shadow-sm shadow-primary/10' 
                : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-primary/50'
              }`}
            >
              {role.icon}
              <span className="text-xs font-bold">{role.label}</span>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Full Name"
              className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="email" 
              placeholder="Email address"
              className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="password" 
              placeholder="Password"
              className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <p className="text-xs text-gray-400 px-2">
            By signing up, you agree to our <Link to="/terms" className="text-primary font-bold">Terms of Service</Link> and <Link to="/privacy" className="text-primary font-bold">Privacy Policy</Link>.
          </p>

          <button type="submit" className="w-full btn-primary py-4 flex items-center justify-center gap-2 group text-lg">
            Create Account <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <p className="text-center text-gray-500 mt-8">
          Already have an account? {' '}
          <Link to="/login" className="text-primary font-bold hover:underline">Log in</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
