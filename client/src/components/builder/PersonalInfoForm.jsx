import { User } from 'lucide-react';
import SectionWrapper from './SectionWrapper';

/**
 * PersonalInfoForm
 * - Input fields for user personal contact details
 * - Displays active validation errors directly under required Name and Email boxes
 */
export default function PersonalInfoForm({ data = {}, onChange, errors = {} }) {
  const fields = [
    { key: 'name', label: 'Full Name', placeholder: 'e.g. John Doe', required: true },
    { key: 'email', label: 'Email Address', placeholder: 'e.g. johndoe@example.com', type: 'email', required: true },
    { key: 'phone', label: 'Phone Number', placeholder: 'e.g. +1 (555) 019-2834' },
    { key: 'location', label: 'Location', placeholder: 'e.g. San Francisco, CA' },
    { key: 'linkedin', label: 'LinkedIn URL', placeholder: 'e.g. linkedin.com/in/johndoe' },
    { key: 'github', label: 'GitHub Link', placeholder: 'e.g. github.com/johndoe' },
    { key: 'portfolio', label: 'Portfolio Link', placeholder: 'e.g. johndoe.dev' },
  ];

  return (
    <SectionWrapper
      title="Personal Information"
      description="Provide your essential contact details and links. This information forms the header of your professional resume."
      icon={User}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {fields.map((field) => {
          const hasError = errors[field.key];
          return (
            <div
              key={field.key}
              className={`flex flex-col ${
                field.key === 'name' || field.key === 'email' ? 'col-span-1' : 'col-span-1'
              }`}
            >
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                {field.label} {field.required && <span className="text-rose-500">*</span>}
              </label>

              <input
                type={field.type || 'text'}
                placeholder={field.placeholder}
                value={data[field.key] || ''}
                onChange={(e) => onChange(field.key, e.target.value)}
                className={`px-4 py-2.5 rounded-xl text-sm text-white bg-slate-950/60 border placeholder-slate-600 focus:outline-none focus:ring-1 transition-all ${
                  hasError
                    ? 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/30'
                    : 'border-slate-800 focus:border-blue-500/50 focus:ring-blue-500/30'
                }`}
              />

              {hasError && (
                <span className="text-[11px] font-semibold text-rose-400 mt-1.5 flex items-center gap-1">
                  ⚠️ {hasError}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
