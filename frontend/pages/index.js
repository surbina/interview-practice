import Link from 'next/link'

const paths = [
  'code-snippets',
  'file-tree-viewer',
  'hooks',
  'market',
  'signup',
  'sudoku',
  'tetris',
  'tetris-firstAttempt',
  'questionnaire',
  'markdown-parser',
  'grid',
]

export default function Home() {
  return (
    <div style={{ padding: '20px', margin: '20px' }}>
      <h1> React Challenges </h1>
      <ol>
        {paths.map((path,i)=> (
          <li key={i} style={{ margin: '10px' }}>
            <Link href={`/challenges/${path}`}>{path}</Link>
          </li>
        ))}
        <li style={{ margin: '10px' }}>
          <Link href={`/coding-exercise/arrays`}>Arrays</Link>
        </li>
        <li style={{ margin: '10px' }}>
          <Link href={`/coding-exercise/linked-list`}>Linked List</Link>
        </li>
      </ol>
    </div>
  )
}
