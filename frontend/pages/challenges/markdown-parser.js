const inputText = `This is a paragraph with a soft
line break.

This is another paragraph that has
> Some text that
> is in a
> block quote.

This is another paragraph with a ~~strikethrough~~ word.`;

const outputText = `<p>This is a paragraph with a soft<br />line break.</p>

<p>This is another paragraph that has <br />
  <blockquote>Some text that<br />is in a<br />block quote.</blockquote>
</p>

<p>This is another paragraph with a <del>strikethrough</del> word.</p>`;

export default function markdownParser() {
  return (
    <>
      <h1>Markdown parser</h1>
      <div>
        <p>Write a Markdown to HTML converter. Given the following input:</p>
        <pre>
          {inputText}
        </pre>
        <p>Original</p>
        <pre>{outputText}</pre>
        <p>Produce the following output:</p>
        <pre>
          {parseMarkdown1(inputText)}
        </pre>
      </div>
    </>
  );
}

function parseMarkdown1(input) {
  let out = '<p>';
  let i = 0;
  let lines = input.split('\n');

  let isBlockActive = false;
  let isDelActive = false;

  while (i < lines.length) {
    let charIndex = 0;
    const line = lines[i];

    if (line.substring(0, 2) === '> ') {
      if (!isBlockActive) {
        isBlockActive = true;
        out = out + '<blockquote>';
      }
      charIndex = 2;
    } else if (isBlockActive) {
      isBlockActive = false;
      out = out + '</blockquote></p><p>';
    }

    while (charIndex < line.length) {
      const charPair = line.substring(charIndex, charIndex + 2);
      if (charPair === '~~' && line[charIndex - 1] !== '~' && line[charIndex + 2] !== '~') {
        if (!isDelActive) {
          isDelActive = true;
          out = out + '<del>';
        } else {
          isDelActive = false;
          out = out + '</del>';
        }
        charIndex = charIndex + 2;
      } else {
        out = out + line[charIndex];
        charIndex = charIndex + 1;
      }
    }

    let nextLine = i + 1;

    while (nextLine < lines.length && lines[nextLine] === "") {
      nextLine++;
    }

    if (nextLine === i + 1) {
      out = out + '<br />';
    } else if (!isBlockActive){
      out = out + '</p><p>';
    }

    i = nextLine;
  }
  
  return out + '</p>';
}
