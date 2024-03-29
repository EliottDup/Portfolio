const projectsContainer = document.getElementById("projects-showoff");
const favoriteProjectContainer = document.getElementById("favorite-project");

function loadProjects(showAll) {
  console.log("loading projects");
  fetch("../json/projects.json")
    .then((response) => response.json())
    .then((data) => {
      sorted = data.projects.sort(
        (a, b) => (a.placement || 10000) - (b.placement || 10000)
      );
      sorted.forEach((project, i) => {
        if (showAll || project.show) {
          createProjectElement(project, projectsContainer, data.statusses);
        }
      });
    })
    .catch((error) => console.error("Error fetching projects data: ", error));

  console.log("loaded projects");
}

function createProjectElement(project, parent, banners) {
  // create main element
  const projectContainer = document.createElement("div");
  projectContainer.classList.add("project");

  // add title
  const titleContainer = document.createElement("div");
  titleContainer.classList.add("projectTitle");

  const titleElement = document.createElement("h1");
  titleElement.classList.add("highlight");
  titleElement.textContent = project.title || "Project Title";

  titleContainer.appendChild(titleElement);
  projectContainer.appendChild(titleContainer);

  if (UrlExists("media/projects/" + project.id + ".png")) {
    // add images
    const imageContainer = document.createElement("a");
    imageContainer.classList.add("image-container");

    const projectImage = document.createElement("img");
    projectImage.classList.add("project-image");
    projectImage.src = "media/projects/" + project.id + ".png";

    imageContainer.appendChild(projectImage);

    projectContainer.appendChild(imageContainer);
  }

  // add description
  const descriptionElement = document.createElement("h3");
  descriptionElement.classList.add("paragraph");
  descriptionElement.innerHTML = project.description || "project description";

  projectContainer.appendChild(descriptionElement);
  highlight(descriptionElement);

  // add buttons if necessary
  if ((project.buttons || []).length != 0) {
    // create button container
    const buttonsContainer = document.createElement("div");
    buttonsContainer.classList.add("project-buttons");

    //for each button
    project.buttons.forEach((button) => {
      // add button
      const buttonElement = document.createElement("a");
      buttonElement.target = "_blank";
      buttonElement.textContent = button.text;
      buttonElement.href = button.destination;

      buttonsContainer.appendChild(buttonElement);
    });

    projectContainer.appendChild(buttonsContainer);
  }

  //add banner
  var banner = banners[project.status];

  const statusBanner = document.createElement("div");
  statusBanner.classList.add("status-banner");
  statusBanner.classList.add(banner.class);
  statusBanner.innerHTML = "<p>" + banner.text + "</p>";

  projectContainer.appendChild(statusBanner);

  parent.appendChild(projectContainer);
}

function UrlExists(url) {
  var http = new XMLHttpRequest();
  http.open("HEAD", url, false);
  http.send();
  return http.status != 404;
}
