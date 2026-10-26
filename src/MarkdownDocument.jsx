// Renders the supplied Markdown assignment instructions as React elements.
// The parser covers the subset of Markdown the course materials use
// (headings, paragraphs, bold/italic text, lists, and tables) and builds
// React elements directly, so no raw HTML is ever injected into the page.

const HEADING_RE = /^(#{1,6})\s+(.+)$/
const UNORDERED_ITEM_RE = /^\s*[-*]\s+(.+)$/
const ORDERED_ITEM_RE = /^\s*\d+\.\s+(.+)$/
const TABLE_ROW_RE = /^\|.*\|\s*$/
const TABLE_DIVIDER_RE = /^\|?[\s:-]+\|[\s:|-]*$/

function splitTableRow(line) {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cell.trim())
}

function parseBlocks(source) {
  const lines = source.replace(/\r\n/g, '\n').split('\n')
  const blocks = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    if (line.trim() === '') {
      i++
      continue
    }

    const heading = line.match(HEADING_RE)
    if (heading) {
      blocks.push({ type: 'heading', level: heading[1].length, text: heading[2] })
      i++
      continue
    }

    if (TABLE_ROW_RE.test(line) && lines[i + 1] && TABLE_DIVIDER_RE.test(lines[i + 1])) {
      const header = splitTableRow(line)
      const rows = []
      let j = i + 2
      while (j < lines.length && TABLE_ROW_RE.test(lines[j])) {
        rows.push(splitTableRow(lines[j]))
        j++
      }
      blocks.push({ type: 'table', header, rows })
      i = j
      continue
    }

    if (UNORDERED_ITEM_RE.test(line)) {
      const items = []
      while (i < lines.length && UNORDERED_ITEM_RE.test(lines[i])) {
        items.push(lines[i].match(UNORDERED_ITEM_RE)[1])
        i++
      }
      blocks.push({ type: 'ul', items })
      continue
    }

    if (ORDERED_ITEM_RE.test(line)) {
      const items = []
      while (i < lines.length && ORDERED_ITEM_RE.test(lines[i])) {
        items.push(lines[i].match(ORDERED_ITEM_RE)[1])
        i++
      }
      blocks.push({ type: 'ol', items })
      continue
    }

    const paragraphLines = [line]
    i++
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !HEADING_RE.test(lines[i]) &&
      !UNORDERED_ITEM_RE.test(lines[i]) &&
      !ORDERED_ITEM_RE.test(lines[i]) &&
      !TABLE_ROW_RE.test(lines[i])
    ) {
      paragraphLines.push(lines[i])
      i++
    }
    blocks.push({ type: 'paragraph', text: paragraphLines.join(' ') })
  }

  return blocks
}

function renderInline(text) {
  const tokens = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter((token) => token !== '')
  return tokens.map((token, index) => {
    if (token.startsWith('**') && token.endsWith('**')) {
      return <strong key={index}>{token.slice(2, -2)}</strong>
    }
    if (token.startsWith('*') && token.endsWith('*')) {
      return <em key={index}>{token.slice(1, -1)}</em>
    }
    return token
  })
}

function HeadingBlock({ block }) {
  const Tag = `h${Math.min(block.level + 1, 6)}`
  return <Tag>{renderInline(block.text)}</Tag>
}

function TableBlock({ block }) {
  return (
    <table>
      <thead>
        <tr>
          {block.header.map((cell, index) => (
            <th key={index}>{renderInline(cell)}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {block.rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <td key={cellIndex}>{renderInline(cell)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

const BLOCK_RENDERERS = {
  heading: (block, key) => <HeadingBlock block={block} key={key} />,
  paragraph: (block, key) => <p key={key}>{renderInline(block.text)}</p>,
  ul: (block, key) => (
    <ul key={key}>
      {block.items.map((item, index) => (
        <li key={index}>{renderInline(item)}</li>
      ))}
    </ul>
  ),
  ol: (block, key) => (
    <ol key={key}>
      {block.items.map((item, index) => (
        <li key={index}>{renderInline(item)}</li>
      ))}
    </ol>
  ),
  table: (block, key) => <TableBlock block={block} key={key} />,
}

/** Renders a trusted Markdown string (assignment instructions) as React content. */
export default function MarkdownDocument({ source }) {
  const blocks = parseBlocks(source)
  return <div className="markdown-document">{blocks.map((block, index) => BLOCK_RENDERERS[block.type](block, index))}</div>
}
