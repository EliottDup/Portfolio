converter = new showdown.Converter({
  tasklists: true,
  openLinksInNewWindow: true,
  parseImgDimensions: true,
});

const prevPageBtn = document.getElementById("prevPage");
const nextPageBtn = document.getElementById("nextPage");

let nextPageId;
let prevPageId;

async function loadPage() {
  prevPageId = "none";
  nextPageId = "none";

  const urlParams = new URLSearchParams(window.location.search);

  const blogId = urlParams.get("blog");
  let pageId = urlParams.get("page") || 0;
  if (pageId == 0) {
    setUrlValue("page", 0);
  }

  let blogJson;
  let blogName;

  let page;
  let pageNum;
  let pageCount = 0;

  await fetch("json/blogs.json")
    .then((response) => response.json())
    .then((data) => {
      blogJson = data.blogs[blogId];
      blogName = blogJson.name;
      page = blogJson.pages[pageId];

      pageNum = page.pageNum;
      let pages = Object.entries(blogJson.pages);
      for (let i = 0; i < pages.length; i++) {
        if (pages[i][1].pageNum == pageNum + 1) {
          nextPageId = pages[i][0];
        }
        if (pages[i][1].pageNum == pageNum - 1) {
          prevPageId = pages[i][0];
        }
      }

      pageCount = blogJson.pages.length;
    });

  await fetch("blog/" + blogId + "/" + pageId + ".md")
    .then((response) => {
      if (!response.ok) {
        console.log(`Error: Couldn\'t find blog "${blogId}" page "${pageId}"`);
        return `Error: Couldn\'t find blog: **${blogId}**, or page: **${pageId}**`;
      }
      return response.text();
    })
    .then((data) => {
      if (prevPageId != "none") {
        prevPageBtn.classList.remove("off-blog-page-link");
      } else {
        prevPageBtn.classList.add("off-blog-page-link");
      }

      if (nextPageId != "none") {
        nextPageBtn.classList.remove("off-blog-page-link");
      } else {
        nextPageBtn.classList.add("off-blog-page-link");
      }

      document.title = blogName + " | Eliott Duparc";

      var htmlOutput = converter.makeHtml(data);

      document.getElementById("dateDisplay").innerHTML = page.date;
      document.getElementById("blogContent").innerHTML = htmlOutput;
      document.getElementById("blogTitle").innerHTML = page.name;

      document.getElementById("blog-buttons").innerHTML = "";
      for (let i = 0; i < blogJson.buttons.length; i++) {
        const button = blogJson.buttons[i];

        document
          .getElementById("blog-buttons")
          .appendChild(CreateButton(button.text, button.destination));
      }
      for (let i = 0; i < blogJson.pages[pageId].buttons.length; i++) {
        const button = blogJson.pages[pageId].buttons[i];
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
  setUrlValue("page", nextPageId);
}

function prevPage() {
  setUrlValue("page", prevPageId);
}

nextPageBtn.addEventListener("click", function () {
  nextPage();
  loadPage();
});

prevPageBtn.addEventListener("click", function () {
  prevPage();
  loadPage();
});
