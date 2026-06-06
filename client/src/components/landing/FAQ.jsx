import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(null);

  const faqs = [
    {
      q: 'What file formats are supported?',
      a: 'For resume parsing/imports, you can upload existing PDF or DOCX documents. Our parsing rules-engine tokenizes headers, sections, bullet points, and contacts. For exports, we output premium high-contrast PDF documents.'
    },
    {
      q: 'Is the ATS score AI-powered?',
      a: 'The core match score uses a rules-based tokenizer engine that checks exact keyword presence, section formatting, and structure constraints. Recommendations, summaries, skill enhancements, and tailoring suggestions are powered by advanced AI models.'
    },
    {
      q: 'Can I export PDF resumes?',
      a: 'Yes, you can export pixel-perfect PDFs at any time. Our templates utilize standard printing margins and include avoided layout breaks to ensure cards are never sliced across page breaks. Email, phone, portfolio, LinkedIn, and GitHub links remain fully clickable in the exported PDF.'
    },
    {
      q: 'Are resumes ATS-friendly?',
      a: 'Yes, all of our template styles (Modern, Corporate, Minimal, Executive, Tech, and Creative) are single-column formatted and fully validated to ensure they are easily parsed by standard ATS scanners. We do not use tables, text-boxes, or complex multi-column bodies which typically cause systems to fail.'
    }
  ];

  return (
    <section id="faq" className="py-20 md:py-28 bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest block mb-3">
            Got Questions?
          </span>
          <h2 className="text-3xl font-extrabold sm:text-4xl text-white tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-800 bg-slate-900/10 overflow-hidden backdrop-blur-xl transition-colors duration-200"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left text-white hover:bg-slate-900/20 transition-all cursor-pointer"
                >
                  <span className="text-sm font-bold flex items-center gap-3">
                    <HelpCircle className={`h-4.5 w-4.5 shrink-0 ${isOpen ? 'text-indigo-400' : 'text-slate-500'}`} />
                    {faq.q}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180 text-indigo-400' : ''}`} />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="px-5 pb-5 pt-1 text-slate-400 text-xs leading-relaxed font-medium pl-10 border-t border-slate-850/50 bg-slate-950/20">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
