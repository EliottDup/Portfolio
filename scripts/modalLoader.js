const modalBackground = document.getElementById("art-modal");
const videoFileTypes = ["mp4", "avi"];
const displaytype = modalBackground.style.display;
modalBackground.style.display = "none";

modalBackground.onclick = function () {
  modalBackground.innerHTML = "";
  modalBackground.style.display = "none";
};

function loadModal(render) {
  console.log("loading", render.id);
  modalBackground.innerHTML = "";
  modalBackground.style.display = displaytype;
  modalBackground.appendChild(getArtNode(render));
  highlight();
}

function getArtNode(render) {
  const renderContainer = document.createElement("div");
  renderContainer.classList.add("project");
  renderContainer.setAttribute("id", "modal-content");

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
  renderContainer.appendChild(getArtWork(render, renderContainer));

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

  return renderContainer;
}

function getRenderToLoad(id) {
  fetch("json/art.json")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((render) => {
        if (render.id == id) {
          return render;
        }
      });
    });
  return null;
}

function getArtWork(render) {
  const renderUrl = "media/art/" + render.id + "." + render.filetype;

  const imageContainer = document.createElement("a");
  imageContainer.href = renderUrl;

  if (render.filetype == "mp4") {
    imageContainer.href = renderUrl;
    const video = document.createElement("video");
    video.loop = true;
    video.autoplay = true;
    video.muted = true;
    video.classList.add("project-image");
    video.classList.add("project-video");

    const source = document.createElement("source");
    source.type = "video/" + render.filetype;
    source.src = renderUrl;

    video.appendChild(source);
    imageContainer.appendChild(video);
  } else {
    const image = document.createElement("img");
    image.src = renderUrl;
    image.classList.add("project-image");

    imageContainer.appendChild(image);
  }
  return imageContainer;
}

function isVideo(render) {
  return containsObject(videoFileTypes, render.filetype);
}

function containsObject(array, object) {
  for (let i = 0; i < array.length; i++) {
    if (array[i] == object) {
      return true;
    }
  }
  return false;
}
