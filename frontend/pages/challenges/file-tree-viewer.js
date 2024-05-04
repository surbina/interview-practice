import { useState } from 'react';

// Estimated time to solve: 45min
export default function FileTreeViewer() {
  return (
    <>
      <h1>File Tree Viewer</h1>
      {/* <div>
        Build a file tree viewer.
        <br />
        <img src="https://i.ibb.co/ftvw6d1/Whats-App-Image-2023-10-12-at-18-30-38.jpg" />
        <br />
        <br />
        <ol>
          <li>It should allow arbitrary levels of depth</li>
          <li>You should be able to expand/collapse any part of the tree</li>
          <li>Basic aesthetics with pure CSS</li>
        </ol>
      </div> */}

      <TreeViewer tree={tree} parentPath="/" />
    </>
  );
}

function TreeViewer({ tree = {}, parentPath }) {
  const children = Object.entries(tree)
    .sort(([nameA], [nameB]) => nameA.localeCompare(nameB))
    .map(([, value]) => value)

  return (
    <nav className='tree-viewer'>
      {children.map(child => child.type === 'dir'
        ? <Directory
            key={`${parentPath}/${child.name}`}
            path={`${parentPath}/${child.name}`}
            name={child.name} tree={child.children}
            children={child.children}
          />
        : <File key={`${parentPath}/${child.name}`} file={child} />
      )}
    </nav>
  );
}


function Directory({ children, name, path }) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <li>
      <div
        className='tree-viewer__directory-name'
        onClick={(e) => {
          e.stopPropagation()
          setIsOpen(open => !open)
        }}
      >
        {isOpen ? '📂' : '📁'} {name}
      </div>
      <div className={!isOpen && 'tree-viewer--hidden'}>
        <TreeViewer tree={children} parentPath={path} />
      </div>
    </li>
  )
}

function File({ file }) {
  return (
    <li className='tree-viewer__file'>
      📄 {file.name}{' '}
      <span className='tree-viewer__file-size'>
        ({file.size > 1 ? file.size : file.size * 1000} {file.size > 1 ? 'KB' : 'B'})
      </span>
    </li>
  );
}

const tree = {
  codebooks: {
    type: 'dir',
    name: 'codebooks',
    children: {
      'codebook.pdf': {
        type: 'file',
        name: 'codebook.pdf',
        size: 50.5
      },
      'format.txt': {
        type: 'file',
        name: 'format.txt',
        size: 1.9
      },
      empty: {
        type: 'dir',
        name: 'empty'
      }
    }
  },
  data: {
    type: 'dir',
    name: 'data',
    children: {
      aggregate: {
        type: 'dir',
        name: 'aggregate',
        children: {
          'aggregates.tab': {
            type: 'file',
            name: 'aggregates.tab',
            size: 0.04
          }
        }
      },
      raw: {
        type: 'dir',
        name: 'raw',
        children: {
          'output_data.tab': {
            type: 'file',
            name: 'output_data.tab',
            size: 126.7
          },
          'quality_data.tab': {
            type: 'file',
            name: 'quality_data.tab',
            size: 121.7
          }
        }
      },
      'README.txt': {
        type: 'file',
        name: 'README.txt',
        size: 0.109
      }
    }
  }
};
