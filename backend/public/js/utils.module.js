export const btnFilterSort = document.getElementById("btn_filter");
export const sortContainer = document.getElementById("sort_container");
btnFilterSort.addEventListener("click", function () {
  this.classList.toggle("btn_close");
  sortContainer.classList.toggle("hideElement");
});
export const listItem_container = document.querySelector("#listItem_container");
export const btnSearch = document.getElementById("btn_search");
export const inputSearch = document.getElementById("search");
export const inputKeyword = document.getElementById("input_keyword");
export const resultContainer = document.getElementById("result_container");
export const searchcontent = document.getElementById("search_content");
export const search_box = document.getElementById("search_box");

const iconSearch = btnSearch?.querySelector("i");
// Search
export const handleSearch = (e, renderSearchItem) => {
  if (e.target.value) {
    inputKeyword.innerHTML = e.target.value;
    const valueSearch = e.target.value.toLowerCase().trim();
    searchcontent.innerHTML = renderSearchItem(valueSearch);
    resultContainer.classList.remove("hidden");
    search_box.classList.remove("rounded-full");
  } else {
    resultContainer.classList.add("hidden");
    search_box.classList.add("rounded-full");
  }
  changeStatusbtnSearch();
};

if (iconSearch && btnSearch && resultContainer) {
  resultContainer.querySelector("h5").onclick = (e) => e.preventDefault();
  //end search
  btnSearch.onclick = changeStatusbtnSearch;
}

function changeStatusbtnSearch() {
  if (!iconSearch) return;
  if (inputSearch.value) {
    resultContainer.classList.remove("hidden");
  } else {
    resultContainer.classList.add("hidden");
  }
  const checkIconisSearch = iconSearch.classList.contains(
    "fa-magnifying-glass"
  );
  if (!inputSearch.value && !checkIconisSearch) {
    iconSearch.className =
      "fa-solid fa-magnifying-glass text-blue-600 hover:text-blue-700";
  } else if (checkIconisSearch && inputSearch.value) {
    iconSearch.className =
      "fa-solid fa-circle-xmark text-blue-600 hover:text-blue-700";
  }
}

// modal select
export const modalView = document.getElementById("modal_views");
export const modalStatus = document.getElementById("modal_status");
modalView.addEventListener("click", closeModalPro);
modalStatus.addEventListener("click", closeModalPro);
export const modal_btnApply = modalStatus.querySelector(".modal__btn--apply");
function closeModalPro(e) {
  if (
    e.target.closest(".modal-content") &&
    !e.target.closest(".btn_close-modal")
  ) {
    return;
  }
  this.classList.toggle("hideElement");
}
//close modal
document.addEventListener("keydown", function (e) {
  if (e.key == "Escape") {
    modalView.classList.add("hideElement");
    modalStatus.classList.add("hideElement");
    inputSearch.value = "";
  }
  changeStatusbtnSearch();
});
document.addEventListener("click", () => {
  if (!inputSearch) return;
  if (inputSearch.value) {
    inputSearch.value = "";
  }
  changeStatusbtnSearch();
});
