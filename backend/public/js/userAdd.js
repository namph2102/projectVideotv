import "./style.module.js";
const hideAllElement = (list = [], elementHidden = "hideElement") => {
  [...list].forEach((item) => item.classList.add(elementHidden));
};
const removeAllActive = (list = [], classActive = "active") => {
  [...list].forEach((item) => item.classList.remove(classActive));
};
const handleOpenContainerContent = (e) => {
  if (e.target.closest("li")) {
    console.log(e.target.closest("li"));
    hideAllElement(content_menuList, "hideElement");
    const liElement = e.target.closest("li");

    const nameMenu = liElement.dataset.menu;
    menuActive.innerHTML = `<span class="capitalize">${nameMenu}</span>`;
    console.log(document.getElementById(nameMenu));
    document.getElementById(nameMenu).classList.remove("hideElement");
    removeAllActive(listLiNameMenu);
    liElement.classList.add("active");
  }
};

// change UI view container main
const menuContainerLarge = document.getElementById("menu_tablet-large");
const menu_mobile = document.getElementById("menu_mobile");
const listLiNameMenu = menuContainerLarge.querySelectorAll("li");
const menuActive = document.getElementById("name_menu-selector");
const content_menuList = document.querySelectorAll(".content_menu");
menuContainerLarge.addEventListener("click", handleOpenContainerContent);
menu_mobile.addEventListener("click", handleOpenContainerContent);

const btnFilterSort = document.getElementById("btn_filter");

btnFilterSort.addEventListener("click", function () {
  this.classList.toggle("btn_close");
  menu_mobile.classList.toggle("hideElement");
});

mobiscroll.setOptions({
  theme: "ios",
  themeVariant: "light",
});

mobiscroll.select("#icons", {
  inputElement: document.getElementById("icons-input"),
});
