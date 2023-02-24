import eorum from "./eorum.js";

const e = {
  resultsContainer: document.querySelector("#results .container"),
  searchField: document.getElementById("searchField"),
  searchButton: document.getElementById("searchButton"),
  resultTemplate: document.getElementById("result"),
  linkTemplate: document.getElementById("link")
};

function populateResult(account, info) {
  const result = e.resultTemplate.content.cloneNode(true);
  result.querySelector("h2.title").innerText = info.name;
  result.querySelector("h3.subtitle").innerText = account;
  result.querySelector("img.picture").src = info.picture;

  const ext = info[eorum.extensions.links];
  if (ext !== undefined) {
    let buttons = result.querySelector("div.buttons")
    for (let link of ext.links || []) {
      let fragment = e.linkTemplate.content.cloneNode(true);

      let button = fragment.querySelector("a");
      button.href = link.url;
      button.appendChild(document.createTextNode(link.title));

      let favicon = button.querySelector(".icon img");
      favicon.src = "https://icon.horse/icon/" + new URL(link.url).hostname;

      buttons.appendChild(button);
    }
  }

  e.resultsContainer.replaceChildren(result);
}

function search(account) {
  eorum.lookup(account).then(infos => populateResult(account, infos[account]));
}

e.searchField.onkeypress = function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    search(e.searchField.value);
  }
}

e.searchButton.onclick = function(event) {
  event.preventDefault();
  search(e.searchField.value);
};
