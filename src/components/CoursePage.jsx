// The course content page: a collapsible left pane (course info + syllabus)
// next to a persistent right-hand material viewer.
import { useState } from 'react'
import Syllabus from './Syllabus.jsx'
import MaterialViewer from './MaterialViewer.jsx'
import { BackIcon, ChevronIcon, ClockIcon, BookIcon, MailIcon } from '../icons.jsx'

export default function CoursePage({ course }) {
  const [collapsed, setCollapsed] = useState(false)
  const [selectedMaterial, setSelectedMaterial] = useState(null)

  if (!course) {
    return (
      <main className="course-page course-page--missing">
        <a href="#/" className="back-link">
          <BackIcon size={16} />
          Back to catalog
        </a>
        <h1>Course not found</h1>
        <p>We could not find a course with that address. It may have been removed or mistyped.</p>
      </main>
    )
  }

  return (
    <div className="course-page">
      <header className="course-topbar">
        <a href="#/" className="back-link">
          <BackIcon size={16} />
          All courses
        </a>
        <h1 className="course-topbar-title">{course.name}</h1>
        <button
          type="button"
          className="collapse-toggle collapse-toggle--mobile"
          onClick={() => setCollapsed((value) => !value)}
          aria-expanded={!collapsed}
        >
          <ChevronIcon size={16} style={{ transform: collapsed ? 'rotate(-90deg)' : 'rotate(90deg)' }} />
          Syllabus
        </button>
      </header>

      <div className={collapsed ? 'course-layout course-layout--collapsed' : 'course-layout'}>
        <aside className="course-pane course-pane--left">
          <button
            type="button"
            className="collapse-toggle collapse-toggle--desktop"
            onClick={() => setCollapsed((value) => !value)}
            aria-expanded={!collapsed}
            aria-label={collapsed ? 'Expand course information' : 'Collapse course information'}
          >
            <ChevronIcon size={16} style={{ transform: collapsed ? 'rotate(180deg)' : 'none' }} />
          </button>

          <div className="course-pane-inner" aria-hidden={collapsed} hidden={collapsed}>
            <section className="course-info-card">
              <p className="course-id-tag">{course.id}</p>
              <p className="course-long-description">{course.longDescription}</p>
              <div className="course-meta-row">
                <span className="course-meta-item">
                  <ClockIcon size={16} />
                  {course.numberOfWeeks} weeks
                </span>
                <span className="course-meta-item">
                  <BookIcon size={16} />
                  {course.numberOfClasses} classes
                </span>
              </div>
              {course.instructor && (
                <div className="instructor-card">
                  <img src={course.instructor.photoUrl} alt={course.instructor.name} className="instructor-photo" />
                  <div>
                    <p className="instructor-name">{course.instructor.name}</p>
                    <a className="instructor-email" href={`mailto:${course.instructor.email}`}>
                      <MailIcon size={14} />
                      {course.instructor.email}
                    </a>
                  </div>
                </div>
              )}
            </section>

            <section className="syllabus-section">
              <h2>Syllabus</h2>
              <div className="syllabus-scroll">
                <Syllabus
                  classes={course.classes}
                  selectedMaterialId={selectedMaterial?.id}
                  onSelectMaterial={setSelectedMaterial}
                />
              </div>
            </section>
          </div>
        </aside>

        <section className="course-pane course-pane--right">
          <MaterialViewer course={course} material={selectedMaterial} onClear={() => setSelectedMaterial(null)} />
        </section>
      </div>
    </div>
  )
}
