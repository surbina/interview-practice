export default function Arrays() {
  return (
    <div>
      <h1>Array exercises</h1>
      <div>
        <h2>isUniqueWithMap?</h2>
        <div>Perro: {JSON.stringify(isUniqueWithMap('Perro'))}</div>
        <div>ASD: {JSON.stringify(isUniqueWithMap('ASD'))}</div>

        <h2>isUniqueWithoutMap?</h2>
        <div>Perro: {JSON.stringify(isUniqueWithoutMap('Perro'))}</div>
        <div>ASD: {JSON.stringify(isUniqueWithoutMap('ASD'))}</div>

        <h2>Is Permutation?</h2>
        <div>sapo, posa: {JSON.stringify(isPermutation2('sapo', 'posa'))}</div>
        <div>aaaa, posa: {JSON.stringify(isPermutation2('aaaa', 'posa'))}</div>
        <div>posa, aaaa: {JSON.stringify(isPermutation2('sapo', 'aaaa'))}</div>
        <div>pos, aaaa: {JSON.stringify(isPermutation2('pos', 'aaaa'))}</div>

        <h2>URLify</h2>
        <div>Mr John Smith: |{URLify(Array.from('Mr John Smith    '))}|</div>

        <h2>Palindrome Permutation</h2>
        <div>Tact Coa: {JSON.stringify(isPermutationOfPalindrome('Tact Coa'))}</div>
        <div>Tact Coa12: {JSON.stringify(isPermutationOfPalindrome('Tact Coa12'))}</div>

        <h2>One away</h2>
        <div>pale, ple: {JSON.stringify(oneAway('pale', 'ple'))}</div>
        <div>pale, bake: {JSON.stringify(oneAway('pale', 'bake'))}</div>
        <div>pale, le: {JSON.stringify(oneAway('pale', 'le'))}</div>

        <h2>Compression</h2>
        <div>aabccccccaaa: {compression('aabccccccaaa')}</div>
      </div>
    </div>
  );
}

function isUniqueWithMap(word) {
  // O(n), n = word.length
  const charMap = {};

  for(let i = 0; i < word.length; i++) {
    if (charMap[word[i]]) {
      return false;
    } else {
      charMap[word[i]] = true;
    }
  }

  return true;
}

function isUniqueWithoutMap(word) {
  // n = word.length
  // 1 + 2 + 3 + ... + (n - 1)
  // m = n - 1
  // 1 + 2 + 3 + ... + m = m(m + 1) / 2
  // O(m^2)
  for(let i = 0; i < word.length - 1; i++) {
    for (let j = i + 1; j < word.length; j++) {
      if (word[i] === word[j]) {
        return false;
      }
    }
  }

  return true;
}

function isPermutation(a, b) {
  if(a.length !== b.length) {
    return false;
  }

  const aMap = {};
  const bMap = {};

  // O(n)
  for(let i = 0; i < a.length; i++) {
    aMap[a[i]] = true;
    bMap[b[i]] = true;
  }

  // O(n)
  for(let i = 0; i < a.length; i++) {
    if (!aMap[b[i]] || !bMap[a[i]]) {
      return false;
    }
  }

  return true;
}

function isPermutation2(a, b) {
  if(a.length !== b.length) {
    return false;
  }

  const occurrences = new Array(128).fill(0);

  for(let i = 0; i < a.length; i++){
    const index = a[i].charCodeAt(0);
    occurrences[index] = occurrences[index] + 1;
  }

  for(let i = 0; i < b.length; i++){
    const index = b[i].charCodeAt(0);
    occurrences[index] = occurrences[index] - 1;
    if(occurrences[index] < 0) {
      return false;
    }
  }

  return true;
}

function URLify(a) {
  let read = a.length - 1;
  let write = a.length - 1;

  // skip spaces at the end
  while(read > -1 && a[read] === ' ') {
    read--;
  }

  while(write > -1) {
    if (a[read] === ' ') {
      // copy %20
      // decrease write by 3
      // decrease read by 1
      a[write] = '0'
      a[write - 1] = '2'
      a[write - 2] = '%'
      write = write - 3
      read--
    } else {
      a[write] = a[read];
      write--;
      read--;
    }
  }

  return a
}

function isPermutationOfPalindrome(word) {

  if(word.length === 1) {
    return true
  }

  const letterCount = new Array(128).fill(0)

  for(let i = 0; i < word.length; i++) {
    const character = word.charAt(i)
    if (character !== ' ') {
      letterCount[character.toLowerCase().charCodeAt(0)]++
    }
  }

  let oddCounts = 0;

  for(let i = 0; i < letterCount.length; i++) {
    if (letterCount[i] % 2 !== 0) {
      oddCounts++

      if(oddCounts > 1) {
        return false
      }
    }
  }

  return true
}

function oneAway(a, b) {
  if (a === b) {
    return true;
  }

  if (Math.abs(a.length - b.length) > 1) {
    // We'll need more than one insert/delete
    return false;
  }

  if (a.length === b.length) {
    // If they have the same length string can have at most one difference
    let foundDiff = false;
    for(let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) {
        if (foundDiff) {
          return false
        } else {
          foundDiff = true;
        }
      }
    }

    return true;
  }

  // The difference is a single character

  const largeWord = a.length > b.length ? a : b
  const shortWord = a.length > b.length ? b : a
  const charCount = {} // we could do the same thing with an array if the alphabet is ASCII

  for(let i = 0; i < largeWord.length; i++) {
    if(!charCount[largeWord[i]]) {
      charCount[largeWord[i]] = 0
    }
    charCount[largeWord[i]]++
  }

  console.log({ largeWord, shortWord, charCount })

  let foundMissing = false

  for(let i = 0; i < shortWord.length; i++) {
    if (!charCount[shortWord[i]]) {
      if (foundMissing) {
        return false
      }
      foundMissing = true
    }
  }

  return true
}

function compression(w) {
  let i = 0;
  let out = '';

  while(i < w.length) {
    let currentChar = w[i]
    let repetitionCount = 0

    while(i < w.length && w[i] === currentChar) {
      repetitionCount++
      i++
    }

    out = out + currentChar

    if(repetitionCount > 1) {
      out = out + repetitionCount
    }
  }

  return out
}
