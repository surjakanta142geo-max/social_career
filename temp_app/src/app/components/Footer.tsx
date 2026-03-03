"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Footer() {
    const router = useRouter();
    return (
        <footer>
            <div className="fg4">
                <div className="fb">
                    <h3><div className="fli">💼</div> Social Career</h3>
                    <p>Your one-stop platform for jobs, courses, and career growth. Build your future with us.</p>
                    <div className="socials">
                        <button className="sbtn">f</button>
                        <button className="sbtn">𝕏</button>
                        <button className="sbtn">in</button>
                        <button className="sbtn">▶</button>
                    </div>
                </div>
                <div className="fcol">
                    <h4>Quick Links</h4>
                    <Link href="/jobs">Browse Jobs</Link>
                    <Link href="/courses">Explore Courses</Link>
                    <Link href="/tips">Career Tips</Link>
                    <Link href="#">Post a Job</Link>
                </div>
                <div className="fcol">
                    <h4>Resources</h4>
                    <Link href="#">Privacy Policy</Link>
                    <Link href="#">Terms of Service</Link>
                    <Link href="#">FAQ</Link>
                    <Link href="#">Contact Us</Link>
                </div>
                <div className="fcol">
                    <h4>Contact Us</h4>
                    <div className="fci">✉️ support@socialcareer.in</div>
                    <div className="fci">📞 +91 98765 43210</div>
                    <div className="fci">📍 123 Career Street, Mumbai</div>
                </div>
            </div>
            <div className="fbot">© 2024 Social Career. All rights reserved.</div>
        </footer>
    );
}
