// Loads and normalizes the platform's course catalog from the immutable data
// files in project-assets/. Nothing here is ever written back to that
// directory; this module only reads, parses, and joins the supplied records.
import coursesCsv from '../project-assets/history_courses.csv?raw'
import classesCsv from '../project-assets/history_classes.csv?raw'
import instructorsCsv from '../project-assets/history_instructors.csv?raw'
import materialsCsv from '../project-assets/course_materials.csv?raw'

// Local binary materials (PDF, video) are fetched by URL; the Markdown
// assignment is fetched as raw text so it can be rendered in the viewer.
const materialFileUrls = import.meta.glob('../project-assets/materials/*', {
  eager: true,
  query: '?url',
  import: 'default',
})
const materialFileText = import.meta.glob('../project-assets/materials/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})

/**
 * Parses RFC4180-style CSV text (quoted fields, embedded commas, escaped
 * quotes) into an array of plain objects keyed by the header row.
 */
function parseCsv(text) {
  const rows = []
  let row = []
  let field = ''
  let inQuotes = false
  const pushField = () => {
    row.push(field)
    field = ''
  }
  const pushRow = () => {
    pushField()
    rows.push(row)
    row = []
  }

  const source = text.replace(/\r\n/g, '\n')
  for (let i = 0; i < source.length; i++) {
    const char = source[i]
    if (inQuotes) {
      if (char === '"' && source[i + 1] === '"') {
        field += '"'
        i++
      } else if (char === '"') {
        inQuotes = false
      } else {
        field += char
      }
    } else if (char === '"') {
      inQuotes = true
    } else if (char === ',') {
      pushField()
    } else if (char === '\n') {
      pushRow()
    } else {
      field += char
    }
  }
  if (field !== '' || row.length > 0) pushRow()

  const [header, ...dataRows] = rows.filter((r) => r.length > 1 || r[0] !== '')
  return dataRows.map((cells) => Object.fromEntries(header.map((key, i) => [key, cells[i] ?? ''])))
}

/** Finds the imported URL or raw text for a materials/ file referenced by file_path. */
function resolveLocalFile(filePath) {
  const fileName = filePath.split('/').pop()
  const urlEntry = Object.entries(materialFileUrls).find(([key]) => key.endsWith(fileName))
  const textEntry = Object.entries(materialFileText).find(([key]) => key.endsWith(fileName))
  return {
    url: urlEntry ? urlEntry[1] : null,
    text: textEntry ? textEntry[1] : null,
  }
}

/** Converts a youtu.be / youtube.com URL into a privacy-enhanced embed URL. */
function toYoutubeEmbedUrl(rawUrl) {
  const match = rawUrl.match(/(?:youtu\.be\/|[?&]v=)([\w-]{11})/)
  return match ? `https://www.youtube-nocookie.com/embed/${match[1]}` : rawUrl
}

const instructorRows = parseCsv(instructorsCsv)
const courseRows = parseCsv(coursesCsv)
const classRows = parseCsv(classesCsv)
const materialRows = parseCsv(materialsCsv)

export const instructorsById = Object.fromEntries(
  instructorRows.map((row) => [
    row.instructor_id,
    { id: row.instructor_id, name: row.name, email: row.email, photoUrl: row.photo_url },
  ]),
)

const materialsByClassId = {}
for (const row of materialRows) {
  const material = {
    id: row.material_id,
    classId: row.class_id,
    order: Number(row.display_order),
    title: row.material_title,
    type: row.material_type,
  }
  if (material.type === 'youtube') {
    material.sourceUrl = row.file_path
    material.embedUrl = toYoutubeEmbedUrl(row.file_path)
  } else {
    const { url, text } = resolveLocalFile(row.file_path)
    material.url = url
    material.text = text
  }
  ;(materialsByClassId[material.classId] ??= []).push(material)
}
for (const list of Object.values(materialsByClassId)) list.sort((a, b) => a.order - b.order)

const classesByCourseId = {}
for (const row of classRows) {
  const classInfo = {
    id: row.class_id,
    courseId: row.course_id,
    week: Number(row.week_number),
    date: row.date,
    name: row.class_name,
    materials: materialsByClassId[row.class_id] ?? [],
  }
  ;(classesByCourseId[classInfo.courseId] ??= []).push(classInfo)
}
for (const list of Object.values(classesByCourseId)) {
  list.sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id))
}

export const courses = courseRows.map((row) => ({
  id: row.course_id,
  name: row.name,
  shortDescription: row.short_description,
  longDescription: row.long_description,
  numberOfClasses: Number(row.number_of_classes),
  numberOfWeeks: Number(row.number_of_weeks),
  instructor: instructorsById[row.instructor_id],
  imageUrl: row.image_url,
  classes: classesByCourseId[row.course_id] ?? [],
}))

export function findCourse(courseId) {
  return courses.find((course) => course.id === courseId)
}
