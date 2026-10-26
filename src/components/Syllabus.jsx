// The course syllabus table: one row per class, grouped visually by week.
// Each Class Content cell shows the class title and, when present, the list
// of materials for that class (lecture slides, readings, assignments, video).
import { MaterialTypeIcon } from '../icons.jsx'

function formatDate(isoDate) {
  const date = new Date(`${isoDate}T00:00:00`)
  // A fixed locale keeps the rendered date deterministic regardless of the
  // visitor's or test runner's system locale.
  return date.toLocaleDateString('en-GB', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
}

function countWeekOccurrences(classes) {
  const counts = new Map()
  for (const item of classes) counts.set(item.week, (counts.get(item.week) ?? 0) + 1)
  return counts
}

export default function Syllabus({ classes, selectedMaterialId, onSelectMaterial }) {
  const weekSpans = countWeekOccurrences(classes)
  const seenWeeks = new Set()

  return (
    <table className="syllabus-table">
      <thead>
        <tr>
          <th scope="col" className="syllabus-week-col">
            Week
          </th>
          <th scope="col" className="syllabus-date-col">
            Date
          </th>
          <th scope="col">Class Content</th>
        </tr>
      </thead>
      <tbody>
        {classes.map((classInfo) => {
          const showWeekCell = !seenWeeks.has(classInfo.week)
          seenWeeks.add(classInfo.week)
          return (
            <tr key={classInfo.id}>
              {showWeekCell && (
                <td className="syllabus-week-col" rowSpan={weekSpans.get(classInfo.week)}>
                  {classInfo.week}
                </td>
              )}
              <td className="syllabus-date-col">{formatDate(classInfo.date)}</td>
              <td className="syllabus-content-col">
                <p className="class-title">{classInfo.name}</p>
                {classInfo.materials.length > 0 ? (
                  <ul className="material-list">
                    {classInfo.materials.map((material) => (
                      <li key={material.id}>
                        <button
                          type="button"
                          className={
                            material.id === selectedMaterialId
                              ? 'material-chip material-chip--active'
                              : 'material-chip'
                          }
                          onClick={() => onSelectMaterial(material)}
                        >
                          <MaterialTypeIcon type={material.type} size={15} />
                          <span>{material.title}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="class-no-materials">Materials for this class are coming soon.</p>
                )}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
