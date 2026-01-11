/* -------------------------
   Utility: Format Labels
-------------------------- */
function formatLabel(key) {
  return key
    .replace(/_/g, " ") // remove underscores
    .replace(/\b\w/g, (c) => c.toUpperCase()); // capitalize words
}

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
    .then((entry) => {
      displayResult(entry);
    })
    .catch(() => {
      resultDiv.innerHTML = `<p>❌ Word not found</p>`;
    });
}

function loadWord(word) {
  // Convert to lowercase to match the data structure (e.g. data/w/wonder.json)
  const lowerWord = word.toLowerCase();
  const firstLetter = lowerWord[0];

  return fetch(`data/${firstLetter}/${lowerWord}.json`)
    .then((res) => {
      if (!res.ok) throw new Error("Word not found");
      return res.json();
    });
}

function displayResult(entry) {
  const resultDiv = document.getElementById("result");

  resultDiv.innerHTML = `
    <h2>${entry.word}</h2>
    <p><em>${entry.phonetic || ""}</em></p>

    <div class="section">
      <h3>Meanings</h3>
      ${Object.entries(entry.meanings || {})
        .map(
          ([pos, meanings]) =>
            `<b>${formatLabel(pos)}</b>
         <ul>
           ${meanings
             .map(
               (m) =>
                 `<li>
                ${m.definition}
                ${m.example ? `<br><small>Example: ${m.example}</small>` : ""}
              </li>`
             )
             .join("")}
         </ul>`
        )
        .join("")}
    </div>

    ${
      entry.tense_forms
        ? `
    <div class="section">
      <h3>Tense Forms</h3>
      <ul>
        ${Object.entries(entry.tense_forms)
          .map(
            ([k, v]) => `
            <li>
              <strong>${formatLabel(k)}</strong>: ${v}
            </li>`
          )
          .join("")}
      </ul>
    </div>`
        : ""
    }

    ${
      entry.synonyms && entry.synonyms.length > 0
        ? `
    <div class="section">
      <h3>Synonyms</h3>
      <div class="list">
        ${entry.synonyms.map((s) => `<span>${s}</span>`).join("")}
      </div>
    </div>`
        : ""
    }

    ${
      entry.antonyms && entry.antonyms.length > 0
        ? `
    <div class="section">
      <h3>Antonyms</h3>
      <div class="list">
        ${entry.antonyms.map((a) => `<span>${a}</span>`).join("")}
      </div>
    </div>`
        : ""
    }

    ${
      entry.usage_examples && entry.usage_examples.length > 0
        ? `
    <div class="section">
      <h3>Usage Examples</h3>
      <ul>
        ${entry.usage_examples.map((e) => `<li>${e}</li>`).join("")}
      </ul>
    </div>`
        : ""
    }
  `;
}

// Add Enter key listener
document.getElementById("searchInput").addEventListener("keyup", (e) => {
  if (e.key === "Enter") searchWord();
});
