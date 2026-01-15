// Matching algorithm for connecting readers in Likemindr

import { User, UserBook, Book } from '@/types/database';

export interface MatchCriteria {
  sameBook: boolean;
  readingProgress: number; // Similarity in page progress (0-1)
  genreOverlap: number; // Shared genre preferences (0-1)
  activityRecency: number; // Recently active (0-1)
  timeZoneCompatibility: number; // Similar time zones (0-1)
}

export interface PotentialMatch {
  user: User;
  userBook: UserBook;
  book: Book;
}

/**
 * Calculate match score between current user and potential match
 * Returns a score between 0-100
 */
export function calculateMatchScore(
  currentUser: User,
  currentUserBook: UserBook,
  potentialMatch: PotentialMatch
): number {
  // Base score: same book (required)
  let score = 0;

  // 1. Reading progress similarity (max 30 points)
  // Users within ±50 pages get higher scores
  const progressDiff = Math.abs(
    currentUserBook.current_page - potentialMatch.userBook.current_page
  );
  const progressScore = Math.max(0, 30 - progressDiff / 5);
  score += progressScore;

  // 2. Genre compatibility (max 25 points)
  const genreOverlap = calculateGenreOverlap(
    currentUser.favorite_genres,
    potentialMatch.user.favorite_genres
  );
  score += genreOverlap * 25;

  // 3. Activity recency (max 25 points)
  // Users active in last 24 hours get higher scores
  const hoursInactive = getHoursInactive(potentialMatch.user.last_active);
  const activityScore = Math.max(0, 25 - hoursInactive);
  score += activityScore;

  // 4. Time zone compatibility (max 20 points)
  // For now, we'll use a placeholder - could be enhanced with actual timezone data
  score += 15; // Default medium compatibility

  return Math.min(100, Math.max(0, score));
}

/**
 * Calculate genre overlap between two users (0-1)
 */
function calculateGenreOverlap(
  genres1: string[],
  genres2: string[]
): number {
  if (genres1.length === 0 || genres2.length === 0) {
    return 0;
  }

  const set1 = new Set(genres1.map((g) => g.toLowerCase()));
  const set2 = new Set(genres2.map((g) => g.toLowerCase()));

  const intersection = new Set([...set1].filter((g) => set2.has(g)));
  const union = new Set([...set1, ...set2]);

  return intersection.size / union.size;
}

/**
 * Get hours since user was last active
 */
function getHoursInactive(lastActive: string): number {
  const lastActiveDate = new Date(lastActive);
  const now = new Date();
  const diffMs = now.getTime() - lastActiveDate.getTime();
  return diffMs / (1000 * 60 * 60); // Convert to hours
}

/**
 * Filter potential matches by minimum score threshold
 */
export function filterMatchesByThreshold(
  matches: Array<{ score: number; match: PotentialMatch }>,
  threshold: number = 40
): Array<{ score: number; match: PotentialMatch }> {
  return matches.filter((m) => m.score >= threshold);
}

/**
 * Sort matches by score (highest first)
 */
export function sortMatchesByScore(
  matches: Array<{ score: number; match: PotentialMatch }>
): Array<{ score: number; match: PotentialMatch }> {
  return matches.sort((a, b) => b.score - a.score);
}

/**
 * Get top N matches
 */
export function getTopMatches(
  matches: Array<{ score: number; match: PotentialMatch }>,
  limit: number = 10
): Array<{ score: number; match: PotentialMatch }> {
  return sortMatchesByScore(matches).slice(0, limit);
}

/**
 * Check if user is currently reading (active in last 7 days)
 */
export function isActiveReader(userBook: UserBook): boolean {
  if (userBook.status !== 'currently_reading') {
    return false;
  }

  const updatedAt = new Date(userBook.updated_at);
  const now = new Date();
  const daysSinceUpdate =
    (now.getTime() - updatedAt.getTime()) / (1000 * 60 * 60 * 24);

  return daysSinceUpdate <= 7;
}

/**
 * Generate a friendly match reason for display
 */
export function generateMatchReason(
  currentUser: User,
  match: PotentialMatch,
  score: number
): string {
  const reasons: string[] = [];

  // Genre overlap
  const genreOverlap = calculateGenreOverlap(
    currentUser.favorite_genres,
    match.user.favorite_genres
  );
  if (genreOverlap > 0.5) {
    const commonGenres = currentUser.favorite_genres.filter((g) =>
      match.user.favorite_genres
        .map((mg) => mg.toLowerCase())
        .includes(g.toLowerCase())
    );
    if (commonGenres.length > 0) {
      reasons.push(`Both love ${commonGenres[0]}`);
    }
  }

  // Reading pace
  const hoursInactive = getHoursInactive(match.user.last_active);
  if (hoursInactive < 24) {
    reasons.push('Active reader');
  }

  // Page proximity
  // Similar reading pace

  if (reasons.length === 0) {
    reasons.push('Reading the same book');
  }

  return reasons.join(' • ');
}
