console.log("loading projects");
const projectsContainer = document.getElementById("projects-showoff");
const favoriteProjectContainer = document.getElementById("favorite-project");

const banners = [
  "media/icons/banner-wip.png",
  "media/icons/banner-done.png",
  "media/icons/banner-abandoned.png",
];

fetch("../json/projects.json")
  .then((response) => response.json())
  .then((data) => {
    data.projects.forEach((project, i) => {
      if (project.id == data.favorite) {
        project.title = "Featured Project: " + project.title;
        createProjectElement(project, favoriteProjectContainer);
      } else {
        createProjectElement(project, projectsContainer);
      }
    });
  })
  .catch((error) => console.error("Error fetching projects data: ", error));

console.log("loaded projects");

function createProjectElement(project, parent) {
  // create main element
  const projectContainer = document.createElement("div");
  projectContainer.classList.add("project");

  // add title
  const titleContainer = document.createElement("div");
  titleContainer.classList.add("projectTitle");

  const titleElement = document.createElement("h1");
  titleElement.classList.add("highlight");
  titleElement.textContent = project.title;

  titleContainer.appendChild(titleElement);
  projectContainer.appendChild(titleContainer);

  // add images
  const imageContainer = document.createElement("a");
  imageContainer.classList.add("image-container");

  const projectImage = document.createElement("img");
  projectImage.classList.add("project-image");
  projectImage.src = "media/projects/" + project.id + ".png";

  imageContainer.appendChild(projectImage);

  projectContainer.appendChild(imageContainer);

  // add description
  const descriptionElement = document.createElement("h3");
  descriptionElement.classList.add("paragraph");
  descriptionElement.innerHTML = project.description;

  projectContainer.appendChild(descriptionElement);
  highlight(descriptionElement);

  // add buttons if necessary
  if (project.buttons.length != 0) {
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

  const statusBanner = document.createElement("img");
  statusBanner.classList.add("status-banner");
  statusBanner.src = banners[project.status];

  projectContainer.appendChild(statusBanner);

  parent.appendChild(projectContainer);
}
