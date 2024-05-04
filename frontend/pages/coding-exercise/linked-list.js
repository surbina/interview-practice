export default function LinkedListPage() {
  const [lower, higher] = partition(createList([3, 5, 8, 5, 10, 2, 1]), 5);

  return (
    <div>
      <h1>Linked List Exercises</h1>

      <h2>Remove duplicates</h2>
      <div>[1, 2, 3, 4, 5]: {new List([1, 2, 3, 4, 5]).removeDuplicates().toString()}</div>
      <div>[2, 1, 2, 3, 4, 2, 5, 2]: {new List([1, 2, 3, 4, 2, 5, 2]).removeDuplicates().toString()}</div>

      <h2>Kth To Last</h2>
      <div>[1, 2, 3, 4, 5]: {new List([1, 2, 3, 4, 5]).kthToLast(5)?.toString()}</div>
      <div>[1, 2, 3, 4, 5]: {new List([1, 2, 3, 4, 5]).kthToLastWithRunner(1)?.toString()}</div>

      <h2>Partition</h2>
      <div>[3, 5, 8, 5, 10, 2, 1]: {lower.listToString()} | {higher.listToString()}</div>

      <h2>Sum</h2>
      <div>[7, 1, 6], [5, 9 ,2]: {sumReversed(createList([7, 1, 6]), createList([5, 9 ,2])).listToString()}</div>
    </div>
  );
}

class Node {
  data;
  next = null;
  previous = null;

  constructor(d, next, previous) {
    this.data = d
    this.next = next ?? null
    this.previous = previous ?? null
  }

  toString() {
    return `<${this.data}>`
  }
}

class List {
  head
  size = 0

  constructor(arrayList) {
    if (arrayList.length > 0) {
      this.head = new Node(arrayList[0])
      this.size++

      let current = this.head
      for(let i = 1; i < arrayList.length; i++) {
        const node = new Node(arrayList[i], null, current)
        current.next = node
        current = node
        this.size++
      }
    }
  }

  toString() {
    if (this.size === 0) {
      return '[]';
    }

    let out = ''
    let current = this.head
    for(let i = 0; i < this.size; i++) {
      out = out + current.data
      if (i < this.size - 1) {
        out = `${out}, `
      }
      current = current.next
    }

    return `[${out}]`
  }

  append(d) {
    if (size === 0) {
      this.head = new Node(d)
    } else {
      let lastNode = head

      for(let i = 0; i < this.size - 1; i++) {
        lastNode = head.next
      }
  
      const node = new Node(d, null, lastNode)
      lastNode.next = n
    }

    this.size++
    return this
  }

  remove(n) {
    const next = n.next
    const previous = n.previous
    if (previous) {
      previous.next = next
    }
    if (next) {
      next.previous = previous
    }
    this.size-- // assuming the node is part of the list, otherwise we would have to check the whole list or keep a reference to the list?
    return this
  }

  removeDuplicates() {
    const charCount = {}

    let current = this.head
    const size = this.size
    for(let i = 0; i < size; i++) {
      if(charCount[current.data]) {
        this.remove(current)
      } else {
        charCount[current.data] = true
      }
      current = current.next
    }

    return this
  }

  kthToLast(k) {
    if (k > this.size) {
      return null
    }

    const l = this.size - k

    let current = this.head
    for(let i = 0; i < l; i++) {
      current = current.next
    }

    return current
  }

  kthToLastWithRunner(k) {
    let current = this.head
    let i = 0
    // Move current cursor k positions ahead
    while(i < k && current !== null) {
      current = current.next
      i++
    }

    // If we reached the end it means there are less than k elements
    if (current === null) {
      return null
    }

    // The current and out are separated by k elements
    // We'll move both of them at the same speed until current reached the end
    let out = this.head
    while(current !== null) {
      out = out.next
      current = current.next
    }

    return out
  }

  deleteMiddleNode(n) {
    if (!n || !n.next) {
      return false
    }

    n.data = n.next.data
    n.next = n.next.next
    this.size--

    return this
  }
}

function createList(a) {
  const list = new SingleLinkNode(a[0])

  a.slice(1).forEach(d => list.appendToTail(d));

  return list
}

class SingleLinkNode {
  next = null
  data

  constructor(d) {
    this.data = d
  }

  appendToTail(d) {
    const end = new SingleLinkNode(d)
    let current = this

    while(current.next) {
      current = current.next
    }

    current.next = end
  }

  listToString() {
    let out = ''
    let current = this

    while(current) {
      out = out + current.data
      if (current.next) {
        out = out + ', '
      } 
      current = current.next
    }

    return `[${out}]`
  }
}

function partition(list, value) {
  const lowerValues = new SingleLinkNode('dummy')
  const higherValues = new SingleLinkNode('dummy')

  let current = list
  let lowerValuesCurrent = lowerValues
  let higherValuesCurrent = higherValues
  while (current) {
    const next = current.next

    if (current.data < value) {
      lowerValuesCurrent.next = current
      lowerValuesCurrent.next.next = null
      lowerValuesCurrent = lowerValuesCurrent.next
    } else {
      higherValuesCurrent.next = current
      higherValuesCurrent.next.next = null
      higherValuesCurrent = higherValuesCurrent.next
    }

    current = next
  }

  return [lowerValues.next, higherValues.next]
}

function sumReversed(a, b) {
  let currentA = a
  let currentB = b
  let carry = 0

  let res = new SingleLinkNode('dummy')
  
  while(currentA || currentB) {
    const aData = currentA ? currentA.data : 0
    const bData = currentB ? currentB.data : 0

    const result = aData + bData + carry
    const digit = result % 10
    carry = (result - digit) / 10

    res.appendToTail(digit) // this makes the function O(n^2), but if we keep a reference to the last node we can reduce it to O(n)

    currentA = currentA?.next
    currentB = currentB?.next
  }

  return res.next
}

