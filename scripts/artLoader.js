const artContainers = document.querySelectorAll(".art-column");

function loadArt() {
  console.log("loading art...");
  fetch("json/art.json")
    .then((response) => response.json())
    .then((data) => {
      sorted = data.renders.sort((a, b) => a.placement - b.placement);

      sorted.forEach((render) => {
        var containerId = render.col;
        if (render.col == undefined) {
          containerId = getEmptiestElementPos(artContainers);
        }
        console.log(render.col);
        createArtElement(render, containerId);
      });
    });
}

function createArtElement(render, parentId) {
  console.log("creating", render.id, "in", parentId.toString());
  const renderUrl = "media/art/" + render.id + "." + render.filetype;

  const renderContainer = document.createElement("div");
  renderContainer.classList.add("art-item");
  renderContainer.onclick = function () {
    console.log("loading", render.id);
    loadModal(render);
  };

  if (isVideo(render)) {
    const video = document.createElement("video");
    video.loop = true;
    video.muted = true;

    const source = document.createElement("source");
    source.type = "video/" + render.filetype;
    source.src = renderUrl;
    video.appendChild(source);

    video.currentTime = render.starttime || 0;

    renderContainer.addEventListener("mouseenter", () => {
      video.play();
    });

    renderContainer.addEventListener("mouseleave", () => {
      video.pause();
    });
    renderContainer.appendChild(video);
  } else {
    const image = document.createElement("img");
    image.src = renderUrl;
    renderContainer.appendChild(image);
  }

  artContainers[parentId].appendChild(renderContainer);
}

function getEmptiestElementPos(elements) {
  var smallest = 0;

  elements.forEach((element, i) => {
    if (element.childElementCount < elements[smallest].childElementCount) {
      smallest = i;
    }
  });

  return smallest;
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
