const artContainer = document.getElementById("art-showoff");
const favoriteRenderContainer = document.getElementById("favorite-render");
const videoFileTypes = ["mp4", "avi"];

function loadArt(showAll) {
  console.log("loading art");
  fetch("json/art.json")
    .then((response) => response.json())
    .then((data) => {
      sorted = data.renders.sort((a, b) => a.placement - b.placement);

      if (!showAll) {
        sorted = getRelevantPieces(sorted, data.mainpage);
      }
      sorted.forEach((render, index) => {
        createArtElement(render, artContainer);
      });
    })
    .catch((error) => console.log("Error fetching art data: ", error));

  console.log("art loaded");
}

function getRelevantPieces(renders, filters) {
  arr = [];

  filters.forEach((filter) => {
    arr.push(renders.find((render) => render.id == filter));
  });

  return arr;
}

function createArtElement(render, parent) {
  const renderContainer = document.createElement("div");
  renderContainer.classList.add("project");

  // add title container
  const titleContainer = document.createElement("div");
  titleContainer.classList.add("projectTitle");

  // add title element
  const titleElement = document.createElement("h1");
  titleElement.classList.add("highlight");
  titleElement.textContent = render.title || "Render Title";

  titleContainer.appendChild(titleElement);
  renderContainer.appendChild(titleContainer);

  //add the actual art work
  renderContainer.appendChild(addArtWork(render, renderContainer));

  // add description
  const descriptionElement = document.createElement("h4");
  descriptionElement.classList.add("paragraph");
  descriptionElement.innerHTML = render.description || "Render Description";

  renderContainer.appendChild(descriptionElement);

  //add banner
  if (isVideo(render.filetype)) {
    // add banner

    const statusBanner = document.createElement("div");
    statusBanner.classList.add("status-banner");
    statusBanner.classList.add("hover-banner");
    statusBanner.innerHTML = "<p>Hover over me!</p>";

    renderContainer.appendChild(statusBanner);
  }
  highlight(descriptionElement);

  parent.appendChild(renderContainer);
}

function isVideo(filetype) {
  return containsObject(videoFileTypes, filetype);
}

function addArtWork(render, renderContainer) {
  const renderUrl = "media/art/" + render.id + "." + render.filetype;

  const imageContainer = document.createElement("a");
  imageContainer.href = renderUrl;

  if (isVideo(render.filetype)) {
    imageContainer.href = "";
    const video = document.createElement("video");
    video.loop = true;
    // video.autoplay = true;
    video.muted = true;
    video.classList.add("project-image");
    video.classList.add("project-video");

    const source = document.createElement("source");
    source.type = "video/" + render.filetype;
    source.src = renderUrl;

    video.appendChild(source);
    imageContainer.appendChild(video);
    video.currentTime = render.starttime || 0;

    renderContainer.addEventListener("mouseenter", () => {
      video.play();
    });

    renderContainer.addEventListener("mouseleave", () => {
      video.pause();
      // video.currentTime = render.starttime || 0;
    });
  } else {
    const image = document.createElement("img");
    image.src = renderUrl;
    image.classList.add("project-image");

    imageContainer.appendChild(image);
  }
  return imageContainer;
}

function containsObject(array, object) {
  for (let i = 0; i < array.length; i++) {
    if (array[i] == object) {
      return true;
    }
  }
  return false;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
