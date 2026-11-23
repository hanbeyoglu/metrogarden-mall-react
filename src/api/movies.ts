import type { Movie, MovieFilters, Showtime } from '@/types'
import { getPublicData, getPublicList } from './public'
import { mapActiveMovies, mapShowtime } from './cmsAdapters'
import type { CmsActiveMovie, CmsMovieSession } from './cmsTypes'

export async function getMovies(filters?: MovieFilters): Promise<Movie[]> {
  const activeMovies = await getPublicList<CmsActiveMovie>('/public/movies', undefined, 100)
  const movies = mapActiveMovies(activeMovies)
  return filters?.limit ? movies.slice(0, filters.limit) : movies
}

export async function getMovie(slug: string): Promise<Movie> {
  const movies = await getMovies()
  const movie = movies.find((item) => item.slug === slug)
  if (!movie) throw new Error(`Film bulunamadı: ${slug}`)
  return movie
}

export async function getMovieShowtimes(slug: string, date: string): Promise<Showtime[]> {
  const sessions = await getPublicData<CmsMovieSession[]>('/public/movie-sessions', { date, limit: 200 })
  return sessions.filter((session) => session.movie.slug === slug).map(mapShowtime)
}
