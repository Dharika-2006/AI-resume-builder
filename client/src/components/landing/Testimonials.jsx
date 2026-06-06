import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

export default function Testimonials() {
  const reviews = [
    {
      author: 'Sample Profile: Software Engineer',
      title: 'Demo Review - Simulated Outcome',
      quote: 'The ATS Analyzer identified critical missing keywords in my experience section. Rebuilt my template to Tech Professional and increased response rates.',
      accent: 'border-blue-500/20'
    },
    {
      author: 'Sample Profile: Product Manager',
      title: 'Demo Review - Simulated Outcome',
      quote: 'Restoring to previous snapshots saved me from losing edits during version changes. The Corporate template formats bullet points cleanly.',
      accent: 'border-cyan-500/20'
    },
    {
      author: 'Sample Profile: Technical Writer',
      title: 'Demo Review - Simulated Outcome',
      quote: 'Helped align formatting structure and kept margins perfect on PDF export. Clickable hyperlinks made it simple for recruiters to click my portfolio.',
      accent: 'border-indigo-500/20'
    }
  ];

  return (
    <section className="py-20 md:py-28 bg-slate-950/40 relative border-t border-b border-slate-900 overflow-hidden">
      
      {/* Background highlight */}
      <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[90px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold text-blue-400 uppercase tracking-widest block mb-3">
            Community Feedback
          </span>
          <h2 className="text-3xl font-extrabold sm:text-4xl text-white tracking-tight">
            User Experience Mockups
          </h2>
          <p className="mt-4 text-slate-400 text-sm md:text-base leading-relaxed">
            Review simulated user experiences demonstrating core product capabilities. We represent demo outcomes transparently until we launch production services.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {reviews.map((rev, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              className={`rounded-3xl border ${rev.accent} bg-slate-900/25 p-6 backdrop-blur-xl relative overflow-hidden flex flex-col justify-between min-h-[220px]`}
            >
              <Quote className="absolute top-6 right-6 h-8 w-8 text-slate-800/40 pointer-events-none" />
              
              <p className="text-slate-300 text-xs italic leading-relaxed font-medium mt-4">
                "{rev.quote}"
              </p>

              <div className="mt-8 pt-4 border-t border-slate-850/60">
                <h4 className="text-xs font-bold text-white leading-none">{rev.title}</h4>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1.5">{rev.author}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
