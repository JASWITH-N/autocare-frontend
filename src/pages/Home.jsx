import { Link } from 'react-router-dom';
import { Calendar, Shield, Wrench, Clock, ArrowRight } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-indigo-900 to-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
            Professional Vehicle <br/> <span className="text-indigo-400">Maintenance & Service</span>
          </h1>
          <p className="mt-4 text-xl text-slate-300 max-w-2xl mx-auto mb-10">
            Book trusted service centers, track your vehicle status in real-time, and get back on the road safely.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/signup" className="flex items-center px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-bold transition-all transform hover:scale-105 shadow-lg shadow-indigo-500/30">
              Book a Service <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link to="/login" className="flex items-center px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-full font-bold backdrop-blur-sm transition-all">
              Partner with Us
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Why Choose AutoCare?</h2>
            <p className="mt-4 text-lg text-slate-600">Everything you need complete peace of mind.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: <Calendar className="w-8 h-8 text-indigo-500"/>,
                title: 'Easy Scheduling',
                desc: 'Book your service online in minutes at your preferred date and time.'
              },
              {
                icon: <Wrench className="w-8 h-8 text-indigo-500"/>,
                title: 'Expert Mechanics',
                desc: 'Access verified and trusted service centers for top-tier quality.'
              },
              {
                icon: <Clock className="w-8 h-8 text-indigo-500"/>,
                title: 'Real-time Tracking',
                desc: 'Know exactly when your vehicle is being worked on and when it\'s ready.'
              }
            ].map((feature, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 line-height-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-slate-900 py-12 text-slate-400 text-center border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          <p>&copy; {new Date().getFullYear()} AutoCare Web Application. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
