import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Award, Search, ArrowUp, ArrowDown } from 'lucide-react';

const LeaderboardPage = () => {
  const topThree = [
    { id: 2, name: "Alice Smith", score: 98, avatar: "2", rank: 2 },
    { id: 1, name: "John Doe", score: 99, avatar: "1", rank: 1 },
    { id: 3, name: "Bob Johnson", score: 96, avatar: "3", rank: 3 },
  ];

  const others = [
    { id: 4, name: "Emma Watson", score: 94, avatar: "4", rank: 4, trend: "up" },
    { id: 5, name: "Michael Ross", score: 92, avatar: "5", rank: 5, trend: "down" },
    { id: 6, name: "Rachel Zane", score: 90, avatar: "6", rank: 6, trend: "up" },
    { id: 7, name: "Harvey Specter", score: 89, avatar: "7", rank: 7, trend: "none" },
    { id: 8, name: "Donna Paulsen", score: 88, avatar: "8", rank: 8, trend: "up" },
  ];

  return (
    <div className="pt-32 pb-20 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex p-3 bg-yellow-100 text-yellow-600 rounded-2xl mb-4">
            <Trophy size={32} />
          </div>
          <h1 className="text-5xl font-bold text-secondary mb-4">Skill <span className="text-primary">Leaderboard</span></h1>
          <p className="text-xl text-gray-500">The top technical talents on SkilStation based on AI Skill Score.</p>
        </div>

        {/* Podium */}
        <div className="flex flex-col md:flex-row items-end justify-center gap-6 mb-20">
          {/* 2nd Place */}
          <div className="order-2 md:order-1 flex flex-col items-center">
            <div className="relative mb-4">
              <img src={`https://i.pravatar.cc/150?img=${topThree[0].avatar}`} className="w-24 h-24 rounded-full border-4 border-gray-200" alt="" />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gray-300 text-secondary rounded-full flex items-center justify-center font-bold">2</div>
            </div>
            <div className="bg-white p-6 rounded-t-3xl shadow-lg w-48 h-40 flex flex-col items-center justify-center border-t-4 border-gray-300">
              <p className="font-bold text-secondary text-center mb-2">{topThree[0].name}</p>
              <p className="text-2xl font-black text-primary">{topThree[0].score}</p>
            </div>
          </div>

          {/* 1st Place */}
          <div className="order-1 md:order-2 flex flex-col items-center">
            <div className="relative mb-6">
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-yellow-400">
                <Trophy size={48} />
              </div>
              <img src={`https://i.pravatar.cc/150?img=${topThree[1].avatar}`} className="w-32 h-32 rounded-full border-4 border-yellow-400 shadow-xl shadow-yellow-100" alt="" />
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-yellow-400 text-white rounded-full flex items-center justify-center font-bold text-xl">1</div>
            </div>
            <div className="bg-white p-8 rounded-t-[2.5rem] shadow-2xl w-56 h-56 flex flex-col items-center justify-center border-t-8 border-yellow-400">
              <p className="font-bold text-secondary text-lg text-center mb-2">{topThree[1].name}</p>
              <p className="text-4xl font-black text-primary">{topThree[1].score}</p>
            </div>
          </div>

          {/* 3rd Place */}
          <div className="order-3 flex flex-col items-center">
            <div className="relative mb-4">
              <img src={`https://i.pravatar.cc/150?img=${topThree[2].avatar}`} className="w-20 h-20 rounded-full border-4 border-orange-200" alt="" />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-orange-400 text-white rounded-full flex items-center justify-center font-bold">3</div>
            </div>
            <div className="bg-white p-6 rounded-t-3xl shadow-lg w-44 h-32 flex flex-col items-center justify-center border-t-4 border-orange-400">
              <p className="font-bold text-secondary text-sm text-center mb-1">{topThree[2].name}</p>
              <p className="text-xl font-black text-primary">{topThree[2].score}</p>
            </div>
          </div>
        </div>

        {/* List */}
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-6">
            <h2 className="text-2xl font-bold text-secondary">Global Rankings</h2>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="text" placeholder="Search student..." className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-primary transition-all text-sm" />
            </div>
          </div>
          
          <div className="divide-y divide-gray-50">
            {others.map((student) => (
              <div key={student.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-6">
                  <span className="w-8 text-xl font-bold text-gray-300">#{student.rank}</span>
                  <img src={`https://i.pravatar.cc/100?img=${student.avatar}`} className="w-12 h-12 rounded-full border border-gray-100" alt="" />
                  <div>
                    <p className="font-bold text-secondary">{student.name}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <TrendingUp size={12} /> Full Stack Track
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-12">
                  <div className="text-right">
                    <p className="text-2xl font-black text-secondary">{student.score}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Skill Score</p>
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    student.trend === 'up' ? 'text-green-500 bg-green-50' : 
                    student.trend === 'down' ? 'text-red-500 bg-red-50' : 'text-gray-400 bg-gray-50'
                  }`}>
                    {student.trend === 'up' ? <ArrowUp size={16} /> : 
                     student.trend === 'down' ? <ArrowDown size={16} /> : <div className="w-2 h-0.5 bg-gray-300 rounded-full" />}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-8 text-center bg-gray-50/50">
            <button className="text-primary font-bold hover:underline">View Full Leaderboard</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
