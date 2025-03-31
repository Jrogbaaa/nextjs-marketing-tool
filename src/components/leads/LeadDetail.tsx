import React from 'react';
import { Lead } from '@/lib/types';

interface LeadDetailProps {
  lead: Lead;
}

const LeadDetail: React.FC<LeadDetailProps> = ({ lead }) => {
  if (!lead) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-500 text-center">No lead selected</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">{lead.name}</h2>
        <p className="text-gray-600 mt-1">{lead.title} at {lead.company}</p>
        <p className="text-gray-500 mt-1">{lead.location}</p>
        <div className="mt-3">
          <a 
            href={lead.profile_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-800 text-sm inline-flex items-center"
            aria-label="View LinkedIn profile"
          >
            <svg 
              className="h-4 w-4 mr-1" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
            View LinkedIn Profile
          </a>
        </div>
      </div>

      {lead.summary && (
        <div className="mb-6">
          <h3 className="text-base font-medium text-gray-900 mb-2">Summary</h3>
          <div className="text-gray-600 text-sm whitespace-pre-line">{lead.summary}</div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {lead.skills && lead.skills.length > 0 && (
          <div>
            <h3 className="text-base font-medium text-gray-900 mb-2">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {lead.skills.map((skill, index) => (
                <span 
                  key={index} 
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {lead.connections && (
          <div>
            <h3 className="text-base font-medium text-gray-900 mb-2">Network</h3>
            <div className="flex items-center">
              <svg 
                className="h-5 w-5 text-gray-400 mr-2" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span className="text-gray-600">
                {lead.connections.toLocaleString()} connections
                {lead.connection_degree && (
                  <span className="ml-2 text-gray-500">(
                    {lead.connection_degree === 1 ? '1st' : 
                     lead.connection_degree === 2 ? '2nd' : 
                     lead.connection_degree === 3 ? '3rd' : 
                     `${lead.connection_degree}th`} degree)
                  </span>
                )}
              </span>
            </div>
          </div>
        )}
      </div>

      {lead.experience && lead.experience.length > 0 && (
        <div className="mt-6">
          <h3 className="text-base font-medium text-gray-900 mb-3">Experience</h3>
          <div className="space-y-4">
            {lead.experience.map((exp, index) => (
              <div key={index} className="border-l-2 border-gray-200 pl-4 ml-1">
                <h4 className="text-sm font-medium text-gray-900">{exp.title}</h4>
                <p className="text-sm text-gray-600">{exp.company}</p>
                {(exp.start_date || exp.end_date) && (
                  <p className="text-xs text-gray-500 mt-1">
                    {exp.start_date && exp.start_date}
                    {exp.start_date && exp.end_date && ' - '}
                    {exp.end_date ? exp.end_date : 'Present'}
                    {exp.duration && ` · ${exp.duration}`}
                  </p>
                )}
                {exp.location && (
                  <p className="text-xs text-gray-500">{exp.location}</p>
                )}
                {exp.description && (
                  <p className="text-sm text-gray-600 mt-2 whitespace-pre-line">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {lead.education && lead.education.length > 0 && (
        <div className="mt-6">
          <h3 className="text-base font-medium text-gray-900 mb-3">Education</h3>
          <div className="space-y-4">
            {lead.education.map((edu, index) => (
              <div key={index}>
                <h4 className="text-sm font-medium text-gray-900">{edu.school}</h4>
                {edu.degree && edu.field_of_study && (
                  <p className="text-sm text-gray-600">
                    {edu.degree}, {edu.field_of_study}
                  </p>
                )}
                {edu.degree && !edu.field_of_study && (
                  <p className="text-sm text-gray-600">{edu.degree}</p>
                )}
                {!edu.degree && edu.field_of_study && (
                  <p className="text-sm text-gray-600">{edu.field_of_study}</p>
                )}
                {(edu.start_date || edu.end_date) && (
                  <p className="text-xs text-gray-500 mt-1">
                    {edu.start_date && edu.start_date}
                    {edu.start_date && edu.end_date && ' - '}
                    {edu.end_date ? edu.end_date : 'Present'}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadDetail; 