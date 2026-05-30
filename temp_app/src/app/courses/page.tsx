import { redirect } from 'next/navigation';

// Courses are hidden for now — keep the route from 404-ing by sending
// any direct visitors back to the home page.
export default function CoursesPage() {
  redirect('/');
}
