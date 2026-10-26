// Small inline SVG icon set for the platform interface. These are decorative
// vector line icons drawn directly in code, not image assets, so they carry
// no image-policy weight.
function Svg({ children, size = 18, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  )
}

export function SearchIcon(props) {
  return (
    <Svg {...props}>
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.5" y2="16.5" />
    </Svg>
  )
}

export function ChevronIcon(props) {
  return (
    <Svg {...props}>
      <polyline points="15 6 9 12 15 18" />
    </Svg>
  )
}

export function ClockIcon(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 16 14" />
    </Svg>
  )
}

export function BookIcon(props) {
  return (
    <Svg {...props}>
      <path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H12v18H5.5A1.5 1.5 0 0 1 4 19.5Z" />
      <path d="M20 4.5A1.5 1.5 0 0 0 18.5 3H12v18h6.5a1.5 1.5 0 0 0 1.5-1.5Z" />
    </Svg>
  )
}

export function PdfIcon(props) {
  return (
    <Svg {...props}>
      <path d="M7 3h7l4 4v14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
      <path d="M14 3v4h4" />
      <path d="M8.5 17v-4h1a1.5 1.5 0 0 1 0 3h-1" />
      <path d="M12.5 17v-4h1.3a1.4 1.4 0 0 1 0 4h-.3" />
      <path d="M16 13.2h1.6M16 17v-3.8" />
    </Svg>
  )
}

export function VideoIcon(props) {
  return (
    <Svg {...props}>
      <rect x="3" y="5.5" width="13" height="13" rx="1.5" />
      <path d="M16 10.3 21 7v10l-5-3.3Z" />
    </Svg>
  )
}

export function MarkdownIcon(props) {
  return (
    <Svg {...props}>
      <rect x="3" y="5" width="18" height="14" rx="1.5" />
      <path d="M6.5 15.5v-6l2.75 3.3L12 9.5v6" />
      <path d="M16 15.5v-5.3M13.7 13.2 16 15.5l2.3-2.3" />
    </Svg>
  )
}

export function YoutubeIcon(props) {
  return (
    <Svg {...props}>
      <rect x="2.5" y="6" width="19" height="12" rx="3" />
      <path d="M10.5 9.8v4.4L14.5 12Z" fill="currentColor" stroke="none" />
    </Svg>
  )
}

export function FileIcon(props) {
  return (
    <Svg {...props}>
      <path d="M7 3h7l4 4v14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
      <path d="M14 3v4h4" />
    </Svg>
  )
}

export function CloseIcon(props) {
  return (
    <Svg {...props}>
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </Svg>
  )
}

export function BackIcon(props) {
  return (
    <Svg {...props}>
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="11 6 5 12 11 18" />
    </Svg>
  )
}

export function FilterIcon(props) {
  return (
    <Svg {...props}>
      <path d="M4 5h16" />
      <path d="M7 12h10" />
      <path d="M10 19h4" />
    </Svg>
  )
}

export function MailIcon(props) {
  return (
    <Svg {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </Svg>
  )
}

export function ArchIcon(props) {
  return (
    <Svg {...props}>
      <path d="M4 20V10a8 8 0 0 1 16 0v10" />
      <path d="M4 20h16" />
      <path d="M7.5 20v-7M16.5 20v-7" />
    </Svg>
  )
}

export function SortIcon(props) {
  return (
    <Svg {...props}>
      <path d="M7 6v13M7 6 4 9M7 6l3 3" />
      <path d="M17 18V5M17 18l3-3M17 18l-3-3" />
    </Svg>
  )
}

export const MATERIAL_ICONS = {
  pdf: PdfIcon,
  video: VideoIcon,
  youtube: YoutubeIcon,
  md: MarkdownIcon,
}

export function MaterialTypeIcon({ type, ...props }) {
  const Icon = MATERIAL_ICONS[type] ?? FileIcon
  return <Icon {...props} />
}
