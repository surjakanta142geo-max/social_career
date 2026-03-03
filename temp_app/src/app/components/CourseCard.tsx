"use client";
import { useToast } from '../layout';

export default function CourseCard({ title, instructor, rating, students, hours, price, originalPrice, icon, bg, badge, category }: any) {
  const showToast = useToast();

  return (
    <div className="ccard">
      <div className="cimg" style={{ background: bg }}>
        {icon}
        {badge && <span className={`cb-badge ${badge.includes('Live') ? 'cb-live' : 'cb-best'}`}>{badge}</span>}
        <span className="cb-cat">{category}</span>
      </div>
      <div className="cbody">
        <h3>{title}</h3>
        <div className="inst">{instructor}</div>
        <div className="stars">
          <span className="rt">⭐ {rating}</span>
          <span className="cnt">👥 {students} · ⏱ {hours} hrs</span>
        </div>
        <div className="cfoot">
          <div className="price">
            <span className="cur">{price}</span>
            <span className="ori">{originalPrice}</span>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => showToast('Enrolled! 🎓')}>Enroll</button>
        </div>
      </div>
    </div>
  );
}