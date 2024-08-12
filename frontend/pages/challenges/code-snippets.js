export default function CodeSnippets() {
  return (
    <div>
      <h1>Code snippets</h1>
      <h2>Render divs as a grid</h2>
      <pre>
        {`.grid {
  display: grid;
  grid: repeat({rowCount}, 1fr) / repeat({columnCount}, 1fr);
  width: fit-content;
}`}
      </pre>

      <h2>Create array</h2>
      <pre>{`const list = new Array(size).fill(null).map((_, i) => setInitialValue(i))`}</pre>
    </div>
  );
}
