function searchWord() {
  const searchInput = document.getElementById("searchInput");
  const resultDiv = document.getElementById("result");
  const word = searchInput.value.trim();

  if (!word) {
    resultDiv.innerHTML = "<p>Please enter a word.</p>";
    return;
  }

  resultDiv.innerHTML = "<p>Searching...</p>";

  loadWord(word)
    .then((data) => {
      displayResult(data);
    })
    .catch((error) => {
      resultDiv.innerHTML = `<p>Word not found.</p>`;
    });
}

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

function displayResult(data) {
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = "";

  // Title and Phonetic
  const title = document.createElement("h2");
  title.textContent = data.word;
  resultDiv.appendChild(title);

  if (data.phonetic) {
    const phonetic = document.createElement("p");
    phonetic.innerHTML = `<em>${data.phonetic}</em>`;
    resultDiv.appendChild(phonetic);
  }

  // Meanings
  if (data.meanings) {
    for (const [partOfSpeech, definitions] of Object.entries(data.meanings)) {
      const section = document.createElement("div");
      section.className = "section";

      const h3 = document.createElement("h3");
      h3.textContent = partOfSpeech;
      section.appendChild(h3);

      const ul = document.createElement("ul");
      definitions.forEach((def) => {
        const li = document.createElement("li");
        li.innerHTML = `${def.definition}`;
        if (def.example) {
          li.innerHTML += ` <small>"${def.example}"</small>`;
        }
        ul.appendChild(li);
      });
      section.appendChild(ul);
      resultDiv.appendChild(section);
    }
  }

  // Synonyms & Antonyms Helper
  const createListSection = (title, items) => {
    if (items && items.length > 0) {
      const section = document.createElement("div");
      section.className = "section";
      section.innerHTML = `<h3>${title}</h3>`;
      const list = document.createElement("div");
      list.className = "list";
      items.forEach((item) => {
        const span = document.createElement("span");
        span.textContent = item;
        list.appendChild(span);
      });
      section.appendChild(list);
      resultDiv.appendChild(section);
    }
  };

  createListSection("Synonyms", data.synonyms);
  createListSection("Antonyms", data.antonyms);
}

// Add Enter key listener
document.getElementById("searchInput").addEventListener("keyup", (e) => {
  if (e.key === "Enter") searchWord();
});
