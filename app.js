async function searchWord() {
  const searchInput = document.getElementById('searchInput');
  const resultDiv = document.getElementById('result');
  const word = searchInput.value.trim();

  if (!word) {
    resultDiv.innerHTML = '<p>Please enter a word.</p>';
    return;
  }

  // Show loading state
  resultDiv.innerHTML = '<p style="text-align:center; color: var(--text-muted);">Searching...</p>';

  try {
    const response = await fetch(`/api/word/${word}`);

    if (!response.ok) {
      if (response.status === 404) {
        resultDiv.innerHTML = `<p>Word not found.</p>`;
      } else {
        resultDiv.innerHTML = `<p>Error occurred while fetching data.</p>`;
      }
      return;
    }

    const data = await response.json();
    displayResult(data);
  } catch (error) {
    console.error('Error:', error);
    resultDiv.innerHTML = `<p>Something went wrong.</p>`;
  }
}

function displayResult(data) {
  const resultDiv = document.getElementById('result');
  let html = `<h2>${data.word}</h2>`;

  if (data.phonetic) {
    html += `<p><em>${data.phonetic}</em></p>`;
  }

  // Meanings
  if (data.meanings) {
    for (const [partOfSpeech, definitions] of Object.entries(data.meanings)) {
      html += `<div class="section">
        <h3>${partOfSpeech}</h3>
        <ul>
          ${definitions.map(def => `
            <li>
              ${def.definition}
              ${def.example ? `<small>"${def.example}"</small>` : ''}
            </li>
          `).join('')}
        </ul>
      </div>`;
    }
  }

  // Synonyms
  if (data.synonyms && data.synonyms.length > 0) {
    html += `<div class="section">
      <h3>Synonyms</h3>
      <div class="list">
        ${data.synonyms.map(syn => `<span>${syn}</span>`).join('')}
      </div>
    </div>`;
  }

  // Antonyms
  if (data.antonyms && data.antonyms.length > 0) {
    html += `<div class="section">
      <h3>Antonyms</h3>
      <div class="list">
        ${data.antonyms.map(ant => `<span>${ant}</span>`).join('')}
      </div>
    </div>`;
  }

  resultDiv.innerHTML = html;
}

// Add event listener for Enter key on the input
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        searchWord();
      }
    });
  }
});
