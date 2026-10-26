// The persistent right-hand pane of a course page. By default it shows the
// course's hero image; selecting a syllabus material swaps in a viewer for
// that material (PDF, video, YouTube, or Markdown) without leaving the page.
import MarkdownDocument from '../MarkdownDocument.jsx'
import { BackIcon, MaterialTypeIcon } from '../icons.jsx'

const VIEWER_LABELS = {
  pdf: 'PDF reading',
  video: 'Lecture recording',
  youtube: 'Video lecture',
  md: 'Assignment instructions',
}

function MaterialBody({ material }) {
  if (material.type === 'pdf') {
    return <iframe className="material-frame" src={material.url} title={material.title} />
  }
  if (material.type === 'video') {
    return (
      <video className="material-video" src={material.url} controls preload="metadata">
        Your browser cannot play this video.
      </video>
    )
  }
  if (material.type === 'youtube') {
    return (
      <iframe
        className="material-frame material-frame--youtube"
        src={material.embedUrl}
        title={material.title}
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    )
  }
  if (material.type === 'md') {
    return (
      <div className="material-markdown-pane">
        <MarkdownDocument source={material.text} />
      </div>
    )
  }
  return <p className="viewer-empty">This material has no preview available.</p>
}

export default function MaterialViewer({ course, material, onClear }) {
  if (!material) {
    return (
      <div className="viewer-pane viewer-pane--default">
        <img className="viewer-hero-image" src={course.imageUrl} alt={course.name} />
        <div className="viewer-hero-caption">
          <p className="viewer-hero-eyebrow">Now viewing</p>
          <h2>{course.name}</h2>
          <p>Select any item in the syllabus to open it here.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="viewer-pane viewer-pane--material">
      <div className="viewer-toolbar">
        <div className="viewer-toolbar-title">
          <MaterialTypeIcon type={material.type} size={18} />
          <div>
            <p className="viewer-toolbar-kind">{VIEWER_LABELS[material.type] ?? 'Course material'}</p>
            <h3>{material.title}</h3>
          </div>
        </div>
        <button type="button" className="viewer-back-button" onClick={onClear}>
          <BackIcon size={16} />
          Back to course image
        </button>
      </div>
      <div className="viewer-body">
        <MaterialBody material={material} />
      </div>
    </div>
  )
}
