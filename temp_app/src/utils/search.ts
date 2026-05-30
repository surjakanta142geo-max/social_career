export type JobSearchInput = {
  keyword?: string;
  location?: string;
  experience?: string;
};

/**
 * Build the query string for the /jobs route from search-bar input.
 * Empty/whitespace-only fields are omitted.
 */
export function buildJobsSearchParams(input: JobSearchInput): string {
  const params = new URLSearchParams();
  const keyword = input.keyword?.trim();
  const location = input.location?.trim();
  const experience = input.experience?.trim();

  if (keyword) params.set('query', keyword);
  if (location) params.set('location', location);
  if (experience) params.set('experience', experience);

  return params.toString();
}

/** Full target path for the /jobs route (e.g. "/jobs?query=react"). */
export function buildJobsHref(input: JobSearchInput): string {
  const qs = buildJobsSearchParams(input);
  return qs ? `/jobs?${qs}` : '/jobs';
}
