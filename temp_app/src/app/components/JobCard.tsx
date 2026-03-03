"use client";
import { useToast } from '../layout';

export default function JobCard({ title, company, location, type, salary, skills, isNew, icon, isList }: any) {
  const showToast = useToast();

  if (isList) {
    // List layout for the Jobs page
    return (
      <div className="jrow">
        <div className="jrow-logo">{icon}</div>
        <div className="jrow-info">
          <div className="jtop">
            <h3>{title}</h3>
            {isNew && <span className="badge-new">New</span>}
          </div>
          <div className="co">{company}</div>
          <div className="meta-row">
            <span className="meta-t">📍 {location}</span>
            <span className="meta-t">💼 {type}</span>
            <span className="meta-t" style={{ color: '#22c55e', fontWeight: 600 }}>{salary}</span>
          </div>
          <div className="skills">
            {skills?.map((skill: string, i: number) => <span key={i} className="stag">{skill}</span>)}
          </div>
        </div>
        <div className="jrow-btns">
          <button className="btn btn-primary btn-sm" onClick={() => showToast('Applied! ✅')}>Apply Now</button>
          <button className="btn btn-sm" style={{ background: 'var(--light)', color: 'var(--muted)', border: '1px solid var(--border)' }} onClick={() => showToast('Saved 🔖')}>Save</button>
        </div>
      </div>
    );
  }

  // Grid layout for the Home page
  return (
    <div className="jcard">
      <div className="jc-top">
        <div className="jc-logo">{icon}</div>
        {isNew && <span className="badge-new">New</span>}
      </div>
      <h3>{title}</h3>
      <div className="co">{company}</div>
      <div className="meta-row">
        <span className="meta-t">📍 {location}</span>
        <span className="meta-t">💼 {type}</span>
      </div>
      <div className="sal">{salary}</div>
      <div className="skills">
        {skills?.map((skill: string, i: number) => <span key={i} className="stag">{skill}</span>)}
      </div>
      <div className="jcard-actions">
        <button className="btn btn-primary btn-sm" onClick={() => showToast('Applied! ✅')}>Apply Now</button>
        <button className="btn-save" onClick={() => showToast('Saved 🔖')}>Save</button>
      </div>
    </div>
  );
}