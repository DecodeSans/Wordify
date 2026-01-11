function loadWord(word) {
  // Convert to lowercase to match the data structure (e.g. data/w/wonder.json)
  const lowerWord = word.toLowerCase();
  const firstLetter = lowerWord[0];

  return fetch(`data/${firstLetter}/${lowerWord}.json`)
    .then(res => {
      if (!res.ok) throw new Error("Word not found");
      return res.json();
    });
}
