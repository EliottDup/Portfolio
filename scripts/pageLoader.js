converter = new showdown.Converter({
  tasklists: true,
  openLinksInNewWindow: true,
  parseImgDimensions: true,
});

const prevPageBtn = document.getElementById("prevPage");
const nextPageBtn = document.getElementById("nextPage");

let pageCount = 0;

async function loadPage() {
  const urlParams = new URLSearchParams(window.location.search);

  const blogId = urlParams.get("blog");
  let pageNumber = parseInt(urlParams.get("page")) || 0;
  if (pageNumber == 0) {
    setUrlValue("page", 0);
  }
  console.log(pageNumber);

  let blogName;
  let pageName;
  let pageId;

  let blogJson;

  await fetch("blog/blogs.json")
    .then((response) => response.json())
    .then((data) => {
      blogJson = data.blogs[blogId];
      blogName = blogJson.name;
      pageName = blogJson.pages[pageNumber].name;
      pageId = blogJson.pages[pageNumber].id;
      pageCount = blogJson.pages.length;
    });

  await fetch("blog/" + blogId + "/" + pageId + ".md")
    .then((response) => {
      if (!response.ok) {
        console.log(`Error: Couldn\'t find blog "${blogId}" page "${page}"`);
        return `Error: Couldn\'t find blog: **${blogId}**, or page: **${page}**`;
      }
      return response.text();
    })
    .then((data) => {
      if (pageNumber != 0) {
        prevPageBtn.classList.remove("off-blog-page-link");
      } else {
        prevPageBtn.classList.add("off-blog-page-link");
      }

      if (pageNumber < blogJson.pages.length - 1) {
        nextPageBtn.classList.remove("off-blog-page-link");
      } else {
        nextPageBtn.classList.add("off-blog-page-link");
      }

      document.title = blogName + " | Eliott Duparc";

      var htmlOutput = converter.makeHtml(data);

      document.getElementById("blogContent").innerHTML = htmlOutput;
      document.getElementById("blogTitle").innerHTML = pageName;

      document.getElementById("blog-buttons").innerHTML = "";
      for (let i = 0; i < blogJson.buttons.length; i++) {
        const button = blogJson.buttons[i];

        document
          .getElementById("blog-buttons")
          .appendChild(CreateButton(button.text, button.destination));
      }
      for (let i = 0; i < blogJson.pages[pageNumber].buttons.length; i++) {
        const button = blogJson.pages[pageNumber].buttons[i];
        document
          .getElementById("blog-buttons")
          .appendChild(CreateButton(button.text, button.destination));
      }

      runHighlighter();
    });
}

function CreateButton(text, destination) {
  const button = document.createElement("a");
  button.target = "_blank";
  button.classList.add("blog-page-link");
  button.href = destination;
  button.textContent = text;

  return button;
}

function setUrlValue(key, value) {
  const oldSearchParams = new URLSearchParams(window.location.search);
  const params = {};
  for (const [key, value] of oldSearchParams) {
    params[key] = value;
  }
  params[key] = value;
  const newSearchParams = new URLSearchParams(params);
  const newUrl = `${window.location.pathname}?${newSearchParams.toString()}`;
  history.pushState({}, "", newUrl);
}

function nextPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const pageNumber = parseInt(urlParams.get("page"));
  if (pageNumber + 1 < pageCount) {
    setUrlValue("page", pageNumber + 1);
  }
}

function prevPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const pageNumber = parseInt(urlParams.get("page"));
  if (pageNumber - 1 >= 0) {
    setUrlValue("page", pageNumber - 1);
  }
}

nextPageBtn.addEventListener("click", function () {
  nextPage();
  loadPage();
});

prevPageBtn.addEventListener("click", function () {
  prevPage();
  loadPage();
});
