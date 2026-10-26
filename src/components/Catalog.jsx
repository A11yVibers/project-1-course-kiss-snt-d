// The course catalog: a searchable, filterable grid of every history course.
import { useMemo, useState } from 'react'
import { SearchIcon, ClockIcon, BookIcon, FilterIcon, SortIcon } from '../icons.jsx'

const SORT_OPTIONS = {
  title: { label: 'Title (A–Z)', compare: (a, b) => a.name.localeCompare(b.name) },
  duration: { label: 'Duration (shortest first)', compare: (a, b) => a.numberOfWeeks - b.numberOfWeeks },
  classes: { label: 'Class count (fewest first)', compare: (a, b) => a.numberOfClasses - b.numberOfClasses },
}

const ALL_INSTRUCTORS = 'all'
const ALL_DURATIONS = 'all'

function matchesSearch(course, query) {
  if (!query) return true
  const haystack = `${course.name} ${course.shortDescription} ${course.longDescription} ${course.instructor?.name ?? ''}`.toLowerCase()
  return haystack.includes(query.toLowerCase())
}

function CourseCard({ course }) {
  return (
    <a className="course-card" href={`#/courses/${course.id}`}>
      <div className="course-card-image-wrap">
        <img src={course.imageUrl} alt={course.name} loading="lazy" />
      </div>
      <div className="course-card-body">
        <h3>{course.name}</h3>
        <p className="course-card-description">{course.shortDescription}</p>
        <div className="course-card-footer">
          <span className="course-card-instructor">{course.instructor?.name}</span>
          <span className="course-card-stats">
            <span>
              <ClockIcon size={14} /> {course.numberOfWeeks}w
            </span>
            <span>
              <BookIcon size={14} /> {course.numberOfClasses} classes
            </span>
          </span>
        </div>
      </div>
    </a>
  )
}

export default function Catalog({ courses }) {
  const [query, setQuery] = useState('')
  const [instructorId, setInstructorId] = useState(ALL_INSTRUCTORS)
  const [duration, setDuration] = useState(ALL_DURATIONS)
  const [sortKey, setSortKey] = useState('title')

  const instructors = useMemo(() => {
    const unique = new Map()
    for (const course of courses) {
      if (course.instructor) unique.set(course.instructor.id, course.instructor.name)
    }
    return [...unique.entries()].sort((a, b) => a[1].localeCompare(b[1]))
  }, [courses])

  const durations = useMemo(() => [...new Set(courses.map((course) => course.numberOfWeeks))].sort((a, b) => a - b), [courses])

  const visibleCourses = useMemo(() => {
    const filtered = courses.filter((course) => {
      if (!matchesSearch(course, query)) return false
      if (instructorId !== ALL_INSTRUCTORS && course.instructor?.id !== instructorId) return false
      if (duration !== ALL_DURATIONS && String(course.numberOfWeeks) !== duration) return false
      return true
    })
    return filtered.sort(SORT_OPTIONS[sortKey].compare)
  }, [courses, query, instructorId, duration, sortKey])

  const hasActiveFilters = query !== '' || instructorId !== ALL_INSTRUCTORS || duration !== ALL_DURATIONS

  function resetFilters() {
    setQuery('')
    setInstructorId(ALL_INSTRUCTORS)
    setDuration(ALL_DURATIONS)
    setSortKey('title')
  }

  return (
    <main className="catalog-page">
      <section className="catalog-hero">
        <p className="catalog-hero-eyebrow">Epoch · History Learning Platform</p>
        <h1>Study the past, one course at a time</h1>
        <p className="catalog-hero-sub">
          {courses.length} courses spanning ancient civilizations to the twentieth century, each with a full weekly
          syllabus and course materials.
        </p>
      </section>

      <section className="catalog-controls">
        <label className="search-field">
          <SearchIcon size={18} />
          <input
            type="search"
            placeholder="Search courses, topics, or instructors…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Search courses"
          />
        </label>

        <label className="filter-field">
          <FilterIcon size={16} />
          <select value={instructorId} onChange={(event) => setInstructorId(event.target.value)} aria-label="Filter by instructor">
            <option value={ALL_INSTRUCTORS}>All instructors</option>
            {instructors.map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </label>

        <label className="filter-field">
          <ClockIcon size={16} />
          <select value={duration} onChange={(event) => setDuration(event.target.value)} aria-label="Filter by duration">
            <option value={ALL_DURATIONS}>Any duration</option>
            {durations.map((weeks) => (
              <option key={weeks} value={weeks}>
                {weeks} weeks
              </option>
            ))}
          </select>
        </label>

        <label className="filter-field">
          <SortIcon size={16} />
          <select value={sortKey} onChange={(event) => setSortKey(event.target.value)} aria-label="Sort courses">
            {Object.entries(SORT_OPTIONS).map(([key, option]) => (
              <option key={key} value={key}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        {hasActiveFilters && (
          <button type="button" className="reset-button" onClick={resetFilters}>
            Reset
          </button>
        )}
      </section>

      <p className="catalog-result-count">
        {visibleCourses.length} of {courses.length} courses
      </p>

      {visibleCourses.length > 0 ? (
        <section className="course-grid">
          {visibleCourses.map((course) => (
            <CourseCard course={course} key={course.id} />
          ))}
        </section>
      ) : (
        <div className="catalog-empty">
          <p>No courses match your search or filters.</p>
          <button type="button" className="reset-button" onClick={resetFilters}>
            Clear filters
          </button>
        </div>
      )}
    </main>
  )
}
