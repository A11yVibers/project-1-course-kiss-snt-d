// Hash-based router: "#/" shows the catalog, "#/courses/:id" opens a course.
import { useEffect, useState } from 'react'
import { courses, findCourse } from './data.js'
import Catalog from './components/Catalog.jsx'
import CoursePage from './components/CoursePage.jsx'

const COURSE_ROUTE = /^#\/courses\/([A-Za-z0-9_-]+)/

function useHash() {
  const [hash, setHash] = useState(() => window.location.hash || '#/')
  useEffect(() => {
    function onHashChange() {
      setHash(window.location.hash || '#/')
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])
  return hash
}

export default function App() {
  const hash = useHash()
  const courseMatch = hash.match(COURSE_ROUTE)

  if (courseMatch) {
    return <CoursePage course={findCourse(courseMatch[1])} />
  }
  return <Catalog courses={courses} />
}
