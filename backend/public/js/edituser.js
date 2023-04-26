import ToastMesage, {
  renderKingofModalStatus,
  validatorImage,
} from "./style.module.js";
import { modal_btnApply, modalStatus } from "./utils.module.js";
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
// id input
const idUserInput = document.getElementById("iduser");
//delete icon
const iconsContainer = document.getElementById("icons_container");
iconsContainer.addEventListener("click", (e) => {
  if (e.target.closest(".icon_delete")) {
    const buttonDelete = e.target.closest(".icon_delete");
    const idUser = idUserInput.value;
    const idIcon = buttonDelete.dataset.id;
    if (!idUser) {
      console.log("Không tìm thấy idUser");
      return;
    }
    renderKingofModalStatus(
      `Bạn có muốn xóa icon <span class="text-red-600"> ${buttonDelete.dataset.title}</span> không`
    );
    modal_btnApply.onclick = () => {
      fetch("/user/deleteicon", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ idUser, idIcon }),
      })
        .then((res) => res.json())
        .then((data) => {
          ToastMesage.success(data.message);
          e.target.closest(".icon_content-box").classList.add("hideElement");
        })
        .catch((err) => {
          ToastMesage.warning(err.message);
        });
      modalStatus.classList.add("hideElement");
    };
  }
});

// change password submitPassword
const btnSubmitPassword = document.getElementById("submitPassword");
const passwordInput = document.getElementById("password");
const rpasswordInput = document.getElementById("rpassword");

btnSubmitPassword.onclick = () => {
  if (!idUserInput.value) return;
  const valuePassword = passwordInput.value.trim();
  const valueRPassword = rpasswordInput.value.trim();

  if (!valuePassword || !valueRPassword) {
    ToastMesage.warning("Dữ liệu không được bỏ trống !");
  } else if (valuePassword != valueRPassword) {
    ToastMesage.warning("Dữ liệu không khớp nhau!");
  } else {
    fetch("/user/admin/changePassword", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        idUser: idUserInput.value,
        newpassword: valueRPassword,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        ToastMesage.success(data.message);
        passwordInput.value = "";
        rpasswordInput.value = "";
      });
  }
};
// change avata
const avataInputFile = document.getElementById("avata");
const showAvata = document.getElementById("showAvata");
avataInputFile.onchange = (e) => {
  validatorImage(e, showAvata);
};

// show comment
// render comment list follow user
const comment = document.getElementById("comment");
const renderList = (dataSource) => {
  $("#pagination").pagination({
    dataSource,
    pageSize: 4,
    formatResult: function (listComment) {
      return listComment.map(
        (
          comment
        ) => `  <tr class="bg-[#151F30] border-y-[10px] border-[#131720] rounded-3xl">
      <td>
          <div class="max-w-[80px] overflow-auto scroll_with-none mt-4 mx-2">
              #asdsdasdasda
          </div>
      </td>
      <td>hoài Nam</td>
      <td>
          <div class="whitespace-nowrap text-ellipsis overflow-hidden max-w-[120px] py-4">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Rerum aspernatur amet, architecto dolor aliquid magni
              perferendis excepturi quis ipsa esse praesentium tenetur
              vero quidem temporibus repellendus pariatur hic.
              Consequuntur, ad!
          </div>
      </td>
      <td>hoài Nam</td>
      <td>12</td>
      <td>hoài Nam</td>
      <td class="btn_actions">
          <div class="min-w-[160px]">
              <button class="btn_view">
                  <i class="fa-solid fa-eye"></i>
              </button>

              <button class="btn_delete">
                  <i class="fa-solid fa-trash-can"></i>
              </button>
          </div>
      </td>
  </tr>`
      );
    },
    callback: function (data, pagination) {
      comment.innerHTML = data.join("");
    },
  });
};
mobiscroll.setOptions({
  theme: "ios",
  themeVariant: "light",
});

mobiscroll.select("#icons", {
  inputElement: document.getElementById("icons-input"),
});
