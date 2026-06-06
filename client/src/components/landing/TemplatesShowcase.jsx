import { motion } from 'framer-motion';
import { LayoutGrid, CheckCircle } from 'lucide-react';

export default function TemplatesShowcase() {
  const templates = [
    {
      name: 'Modern',
      desc: 'Balanced dual-header design, structured grid dividers, and optimized vertical spacing. Best for general professional applications.',
      accent: 'border-blue-500/30',
      preview: (
        <div className="flex flex-col h-full bg-slate-950 p-3.5 space-y-2 text-[6px]">
          <div className="h-4 bg-blue-500/10 rounded flex items-center justify-between px-2 text-[5px] text-blue-400 font-extrabold uppercase">
            <span>Alex Carter</span>
            <span>Software Architect</span>
          </div>
          <div className="h-0.5 bg-slate-800" />
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2 space-y-1.5">
              <div className="h-1 bg-slate-800 rounded w-1/3" />
              <div className="h-10 bg-slate-900 rounded p-1 space-y-1">
                <div className="h-1 bg-slate-700 rounded w-2/3" />
                <div className="h-1 bg-slate-800 rounded w-full" />
                <div className="h-1 bg-slate-800 rounded w-5/6" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="h-1 bg-slate-800 rounded w-2/3" />
              <div className="h-1.5 bg-blue-500/10 rounded" />
              <div className="h-1.5 bg-blue-500/10 rounded" />
              <div className="h-1.5 bg-blue-500/10 rounded" />
            </div>
          </div>
        </div>
      )
    },
    {
      name: 'Corporate',
      desc: 'Formal sidebar layout, distinct headers, and a robust summary section. Designed for executive positions in finance, operations, and enterprise environments.',
      accent: 'border-cyan-500/30',
      preview: (
        <div className="flex h-full bg-slate-950 p-3.5 gap-2 text-[6px]">
          <div className="w-1/3 bg-slate-900 rounded p-1.5 space-y-2 border-r border-slate-800">
            <div className="h-4 bg-cyan-500/10 rounded flex items-center justify-center text-[5px] text-cyan-400 font-extrabold uppercase text-center">
              <span>AC</span>
            </div>
            <div className="h-1 bg-slate-700 rounded w-full" />
            <div className="space-y-1">
              <div className="h-1 bg-slate-800 rounded w-full" />
              <div className="h-1 bg-slate-800 rounded w-5/6" />
            </div>
          </div>
          <div className="flex-1 space-y-2">
            <div className="h-2 bg-slate-800 rounded w-1/3" />
            <div className="space-y-1">
              <div className="h-8 bg-slate-900 rounded w-full" />
              <div className="h-8 bg-slate-900 rounded w-full" />
            </div>
          </div>
        </div>
      )
    },
    {
      name: 'Minimal',
      desc: 'Extreme whitespace optimization, minimalist single-column typography, and zero clutter. Tailored for creatives and technical pros who value pure text clarity.',
      accent: 'border-slate-500/30',
      preview: (
        <div className="flex flex-col h-full bg-slate-950 p-3.5 space-y-2 text-[6px]">
          <div className="space-y-0.5">
            <div className="h-2.5 bg-slate-200 rounded w-1/4" />
            <div className="h-1 bg-slate-500 rounded w-1/3" />
          </div>
          <div className="space-y-1.5">
            <div className="h-1 bg-slate-700 rounded w-1/6" />
            <div className="space-y-1">
              <div className="h-1 bg-slate-800 rounded w-full" />
              <div className="h-1 bg-slate-850 rounded w-5/6" />
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="h-1 bg-slate-700 rounded w-1/6" />
            <div className="space-y-1">
              <div className="h-1 bg-slate-800 rounded w-full" />
              <div className="h-1 bg-slate-850 rounded w-5/6" />
            </div>
          </div>
        </div>
      )
    },
    {
      name: 'Executive',
      desc: 'Elegant centered headers, classic serif headings, and dual borders. Designed for senior leadership, managers, directors, and MBA graduates.',
      accent: 'border-purple-500/30',
      preview: (
        <div className="flex flex-col h-full bg-slate-950 p-3.5 space-y-2 text-[6px] items-center text-center">
          <div className="space-y-1 w-full flex flex-col items-center">
            <div className="h-3 bg-purple-500/10 rounded w-1/3 flex items-center justify-center text-[5px] text-purple-400 font-extrabold uppercase" />
            <div className="h-1 bg-slate-700 rounded w-1/2" />
          </div>
          <div className="w-full h-px bg-slate-800" />
          <div className="w-full text-left space-y-2">
            <div className="h-1 bg-slate-700 rounded w-1/6" />
            <div className="h-10 bg-slate-900 rounded p-1 space-y-1">
              <div className="h-1.5 bg-slate-800 rounded w-full" />
              <div className="h-1.5 bg-slate-850 rounded w-5/6" />
            </div>
          </div>
        </div>
      )
    },
    {
      name: 'Tech Professional',
      desc: 'Developer-oriented, double-column sections, Monospace fonts, and dedicated inline technology tags. Optimized for software engineers, developers, and analysts.',
      accent: 'border-indigo-500/30',
      preview: (
        <div className="flex flex-col h-full bg-slate-950 p-3.5 space-y-2 text-[6px]">
          <div className="flex justify-between items-start">
            <div className="space-y-0.5">
              <div className="h-2.5 bg-indigo-400/10 rounded px-1 text-[5px] text-indigo-400 font-mono font-extrabold uppercase">Alex_Carter</div>
              <div className="h-1 bg-slate-700 rounded w-1/2" />
            </div>
            <div className="h-1 bg-slate-700 rounded w-1/4" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2 space-y-1">
              <div className="h-1 bg-slate-700 rounded w-1/3" />
              <div className="h-12 bg-slate-900 rounded p-1 space-y-1">
                <div className="flex justify-between">
                  <div className="h-1 bg-slate-700 w-1/3" />
                  <div className="h-1.5 bg-indigo-500/10 rounded w-1/3" />
                </div>
                <div className="h-1 bg-slate-800 rounded w-full" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="h-1 bg-slate-700 rounded w-2/3" />
              <div className="flex flex-wrap gap-0.5">
                <span className="text-[3px] px-1 bg-indigo-500/10 text-indigo-400 rounded">React</span>
                <span className="text-[3px] px-1 bg-indigo-500/10 text-indigo-400 rounded">Node</span>
                <span className="text-[3px] px-1 bg-indigo-500/10 text-indigo-400 rounded">AWS</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      name: 'Creative',
      desc: 'Vibrant timeline alignment, colored timeline badges, single-column body structure, and modern typography layouts. 100% ATS-friendly visual design.',
      accent: 'border-pink-500/30',
      preview: (
        <div className="flex flex-col h-full bg-slate-950 p-3.5 space-y-2 text-[6px]">
          <div className="flex gap-2 items-center">
            <div className="h-4 w-4 bg-pink-500/10 rounded-full flex items-center justify-center text-[5px] text-pink-400 font-extrabold">AC</div>
            <div className="space-y-0.5">
              <div className="h-2 bg-slate-100 rounded w-20" />
              <div className="h-1 bg-slate-700 rounded w-12" />
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-1 border-r border-dashed border-pink-500/40 relative">
              <div className="absolute top-2 -left-0.5 h-1 w-1 bg-pink-500 rounded-full" />
              <div className="absolute top-8 -left-0.5 h-1 w-1 bg-pink-500 rounded-full" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="space-y-1">
                <div className="h-1 bg-slate-700 rounded w-1/4" />
                <div className="h-6 bg-slate-900 rounded w-full" />
              </div>
              <div className="space-y-1">
                <div className="h-1 bg-slate-700 rounded w-1/4" />
                <div className="h-6 bg-slate-900 rounded w-full" />
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <section id="templates" className="py-20 md:py-28 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest block mb-3">
            Premium Design Layouts
          </span>
          <h2 className="text-3xl font-extrabold sm:text-4xl text-white tracking-tight">
            ATS-Friendly Layout Showcase
          </h2>
          <p className="mt-4 text-slate-400 text-sm md:text-base leading-relaxed">
            Choose from six beautifully balanced templates carefully vetted for applicant tracking systems, keeping your data perfectly parseable while maintaining professional layouts.
          </p>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((tpl, idx) => (
            <motion.div
              key={tpl.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-55px' }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              whileHover={{ y: -6 }}
              className="rounded-3xl border border-slate-800/80 bg-slate-900/35 overflow-hidden shadow-2xl relative group flex flex-col justify-between"
            >
              
              {/* Template Preview Section */}
              <div className={`p-4 bg-slate-900/40 border-b border-slate-850 h-44 flex flex-col justify-end`}>
                <div className="h-full rounded-xl border border-slate-800 overflow-hidden shadow-inner relative">
                  {tpl.preview}
                </div>
              </div>

              {/* Template Details Section */}
              <div className="p-6">
                <h3 className="text-base font-extrabold text-white group-hover:text-indigo-400 transition-colors duration-200">
                  {tpl.name}
                </h3>
                <p className="text-slate-400 text-xs mt-3 leading-relaxed font-medium min-h-[50px]">
                  {tpl.desc}
                </p>
                <div className="mt-6 flex items-center gap-2 text-indigo-400 text-xs font-semibold">
                  <CheckCircle className="h-4 w-4" />
                  <span>Applicant Tracking System Validated</span>
                </div>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
