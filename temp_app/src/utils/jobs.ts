export type ApplyTarget =
  | { type: 'link'; href: string }
  | { type: 'email'; email: string; mailto: string }
  | { type: 'none' };

type JobLike = {
  title?: string;
  company_name?: string;
  apply_link?: string | null;
  apply_email?: string | null;
};

/**
 * Decide how a candidate applies to a job:
 *  1. If an external apply link is set -> open it (new tab).
 *  2. Else if a contact email is set -> mailto the recruiter (prefilled).
 *  3. Else -> nothing we can do.
 */
export function resolveApplyTarget(job: JobLike): ApplyTarget {
  const link = job.apply_link?.trim();
  if (link) {
    return { type: 'link', href: link };
  }

  const email = job.apply_email?.trim();
  if (email) {
    const subject = encodeURIComponent(`Application for ${job.title ?? 'the role'}`);
    const body = encodeURIComponent(
      `Hi,\n\nI'd like to apply for the ${job.title ?? 'advertised'} position` +
        `${job.company_name ? ` at ${job.company_name}` : ''}.\n\n`,
    );
    return { type: 'email', email, mailto: `mailto:${email}?subject=${subject}&body=${body}` };
  }

  return { type: 'none' };
}
