const artContainer = document.getElementById("art-showoff");
const favoriteRenderContainer = document.getElementById("favorite-render");

videoFileTypes = ["mp4", "avi"];

fetch("json/art.json")
  .then((response) => response.json())
  .then((data) => {
    data.renders.forEach((render) => {
      if (data.favorite == render.id) {
        //make fav here
      } else {
        createArtElement(render, artContainer);
      }
    });
  })
  .catch((error) => console.log("Error fetching art data: ", error));

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
  renderContainer.appendChild(addArtWork(render));

  // add description
  const descriptionElement = document.createElement("h4");
  descriptionElement.classList.add("paragraph");
  descriptionElement.innerHTML = render.description;

  renderContainer.appendChild(descriptionElement);

  parent.appendChild(renderContainer);
}

function isVideo(filetype) {
  return containsObject(videoFileTypes, filetype);
}

function addArtWork(render) {
  const renderUrl = "images/art/" + render.id + "." + render.filetype;

  const imageContainer = document.createElement("a");
  imageContainer.href = renderUrl;

  if (isVideo()) {
    imageContainer.href = "";
    const video = document.createElement("video");
    video.loop = true;
    video.autoplay = true;
    video.muted = true;
    video.classList.add("project-image");

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

function containsObject(array, object) {
  //BROKEN, FIX ME
  var i;
  for (i = 0; i < array.length; i++) {
    if (array[i] == object) {
      return true;
    }
  }

  return false;
}
