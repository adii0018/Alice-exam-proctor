import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowLeft } from 'lucide-react';

const Documentation = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white">
      <div className="container mx-auto px-6 py-16">
        <Link to="/" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
        
        <div className="flex items-center gap-4 mb-8">
          <BookOpen className="w-12 h-12 text-blue-400" />
          <h1 className="text-5xl font-bold">Documentation</h1>
        </div>
        
        <div className="prose prose-invert max-w-none">
          <p className="text-xl text-gray-300 mb-8">
            Complete guide to using Alice Exam Proctor
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
              <h3 className="text-2xl font-bold mb-3">Getting Started</h3>
              <p className="text-gray-400">Learn the basics of setting up and conducting your first exam</p>
            </div>
            
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
              <h3 className="text-2xl font-bold mb-3">Teacher Guide</h3>
              <p className="text-gray-400">Comprehensive guide for educators and administrators</p>
            </div>
            
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
              <h3 className="text-2xl font-bold mb-3">Student Guide</h3>
              <p className="text-gray-400">Everything students need to know about taking proctored exams</p>
            </div>
            
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
              <h3 className="text-2xl font-bold mb-3">AI Proctoring</h3>
              <p className="text-gray-400">Understanding how our AI monitoring system works</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documentation;
