console.log("loading art");

const artContainer = document.getElementById("art-showoff");
const favoriteRenderContainer = document.getElementById("favorite-render");

videoFileTypes = ["mp4", "avi"];

fetch("json/art.json")
  .then((response) => response.json())
  .then((data) => {
    let fav = -1;
    if (data.favorite == "none" && false) {
      fav = getRandomInt(data.renders.length);
    }

    data.renders.forEach((render, index) => {
      if (data.favorite == render.id || index == fav) {
        createArtElement(render, favoriteRenderContainer);
      } else {
        createArtElement(render, artContainer);
      }
    });
  })
  .catch((error) => console.log("Error fetching art data: ", error));

console.log("art loaded");

function createArtElement(render, parent) {
  const renderContainer = document.createElement("div");
  renderContainer.classList.add("project");

  // add title container
  const titleContainer = document.createElement("div");
  titleContainer.classList.add("projectTitle");

  // add title element
  const titleElement = document.createElement("h1");
  titleElement.classList.add("highlight");
  titleElement.textContent = render.title;

  titleContainer.appendChild(titleElement);
  renderContainer.appendChild(titleContainer);

  //add the actual art work
  renderContainer.appendChild(addArtWork(render, renderContainer));

  // add description
  const descriptionElement = document.createElement("h4");
  descriptionElement.classList.add("paragraph");
  descriptionElement.innerHTML = render.description;

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
  //BROKEN, FIX ME

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
