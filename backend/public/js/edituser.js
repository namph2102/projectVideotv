import ToastMesage, {
  renderKingofModalStatus,
  validatorImage,
  dateTimeFormat,
  coverNumber,
} from "./style.module.js";
import { modal_btnApply, modalStatus, modalView } from "./utils.module.js";
let listComment,
  listTopup = [];
const hideAllElement = (list = [], elementHidden = "hideElement") => {
  [...list].forEach((item) => item.classList.add(elementHidden));
};
const removeAllActive = (list = [], classActive = "active") => {
  [...list].forEach((item) => item.classList.remove(classActive));
};
const handleOpenContainerContent = (e) => {
  if (e.target.closest("li")) {
    hideAllElement(content_menuList, "hideElement");
    const liElement = e.target.closest("li");

    const nameMenu = liElement.dataset.menu;
    menuActive.innerHTML = `<span class="capitalize">${nameMenu}</span>`;
    console.log(document.getElementById(nameMenu));
    document.getElementById(nameMenu).classList.remove("hideElement");
    removeAllActive(listLiNameMenu);
    removeAllActive(listLinameMenuMobile);

    liElement.classList.add("active");
  }
};

// change UI view container main
const menuContainerLarge = document.getElementById("menu_tablet-large");
const menu_mobile = document.getElementById("menu_mobile");
const listLiNameMenu = menuContainerLarge.querySelectorAll("li");
const listLinameMenuMobile = menu_mobile.querySelectorAll("li");
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

// handle  comment

//render viewComment
const renderDisplayViewComment = (comment) => {
  const html = `
  <div class="flex gap-3 mb-2  min-w-[300px]">
  <img
    src="${comment.user_comment.avata}"
    width="40"
    height="40"
    class="object-cover rounded-lg"
    alt=""
  />
  <div>
    <p><strong>Auhor:</strong> <sub>${comment.user_comment.fullname}</sub></p>
    <p class="text-base"> ${dateTimeFormat(
      comment.updatedAt
    )}   <sub class="text-xs">${moment(comment.updatedAt).fromNow()}</sub> </p>
  </div>
</div>
<article id="view_container" class="lg:max-w-[600px] sm:max-w-[400px] w-full mt-4 text-sm">
 ${comment.comment}
</article>

<button
title="Close (Esc)"
type="button"
class="absolute -top-2 right-1 text-4xl hover:text-red-500 btn_close-modal"
>
×
</button>
  `;
  document.querySelector("#modal_views-container").innerHTML = html;
  modalView.classList.remove("hideElement");
};
// render comment list follow user
const commentContainer = document.getElementById("comment_body");
commentContainer.onclick = (e) => {
  if (e.target.closest("button")) {
    const buttonElement = e.target.closest("button");
    const idComment = buttonElement.closest(".btn_actions").dataset.id || 0;
    if (!idComment) {
      return false;
    }

    if (buttonElement.classList.contains("btn_view")) {
      const comment = listComment.find((comment) => comment._id == idComment);
      if (!comment) return false;
      renderDisplayViewComment(comment);
    } else if (buttonElement.classList.contains("btn_delete")) {
      renderKingofModalStatus("Bạn có chắc chắn xóa bình luận này không !");
      modal_btnApply.onclick = () => {
        fetch("/comments/admin/delete", {
          method: "post",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ data: { idcommemt: idComment } }),
        })
          .then((res) => res.json())
          .then((res) => {
            ToastMesage.success(res.message);
            e.target.closest(".comment_list-item").classList.add("hideElement");
            listComment.splice(Number(buttonElement.dataset.index), 1);
            modalStatus.classList.add("hideElement");
            renderListComment(listComment);
          })
          .catch((err) => ToastMesage.warning(err.message));
      };
    }
  }
};
const renderListComment = (dataSource) => {
  $("#paginacomment").pagination({
    dataSource,
    pageSize: 4,
    formatResult: function (listComment) {
      return listComment.map(
        (
          comment,
          index
        ) => ` <tr class="bg-[#151F30] border-y-[10px] border-[#131720] rounded-3xl comment_list-item">
      <td>
          <div class="max-w-[80px] overflow-auto scroll_with-none mt-4 mx-2">
              #${comment._id}
          </div>
      </td>
      <td>${comment.user_comment.fullname}</td>
      <td>
          <div class="whitespace-nowrap text-ellipsis overflow-hidden max-w-[120px] py-4">
             ${comment.comment}
          </div>
      </td>
      <td> ${comment.subcomment?.length || 0}</td>
      <td> ${comment.total_like}</td>
      <td>${comment.is_edit ? "Edited" : "No"}</td>
      <td>${dateTimeFormat(comment.createdAt)}</td>
  
      <td data-index="${index}" data-id="${comment._id}" class="btn_actions">
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
      commentContainer.innerHTML = data.join("");
    },
  });
};

//end handle comment

// handle Topup
const payment_container = document.getElementById("payment_container");
const renderListTopup = (dataSource) => {
  $("#pagination_payment").pagination({
    dataSource,
    pageSize: 4,
    formatResult: function (listTopup) {
      return listTopup.map(
        (
          topup,
          index
        ) => ` <tr class="bg-[#151F30] border-y-[10px] border-[#131720] rounded-3xl topup_item">
        <td>
            <div class="max-w-[80px] overflow-auto scroll_with-none mt-4 mx-2">
                #${topup._id}
            </div>
        </td>
        <td>${topup.payCode}</td>

        <td>${topup.nameWallet || topup.nameBank}</td>
        <td>${coverNumber(topup.money)}</td>
        <td>${
          topup.status == 1
            ? `<span class="text-yellow-300">Chờ xử lý</span>`
            : topup.status == 2
            ? `<span class="text-green-500">Thành công</span>`
            : `<span class="text-red-500">Thất bại</span>`
        }</td>
        <td>${dateTimeFormat(topup.createdAt)}</td>
        <td data-id="${topup._id}" data-index="${index}" class="btn_actions">
            <div class="min-w-[160px]">
            ${
              (topup.status == 1 &&
                ` <button title="Đồng ý" class="btn_agree">
            <i class="fa-solid fa-handshake"></i>
        </button>
        <button title="Thất bại" class="btn_fail">
            <i class="fa-solid fa-heart-crack"></i>
        </button>`) ||
              ""
            }
                <button title="View" class="btn_view">
                    <i class="fa-solid fa-eye"></i>
                </button>

                <button title="Xóa" class="btn_delete">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        </td>
    </tr>`
      );
    },
    callback: function (data, pagination) {
      payment_container.innerHTML = data.join("");
    },
  });
};
const renderDisplayviewTopup = (topupItem) => {
  const html = `
<div class="flex gap-3 mb-2  min-w-[300px]">
  <img
    src="${topupItem.account.avata}"
    width="40"
    height="40"
    class="object-cover rounded-lg"
    alt=""
  />
  <div>
    <p><strong>Auhor:</strong> <sub>${topupItem.account.fullname}</sub></p>
    <p class="text-base"> ${dateTimeFormat(
      topupItem.updatedAt
    )}   <sub class="text-xs">${moment(
    topupItem.createdAt
  ).fromNow()}</sub> </p>
  </div>
</div>
</div>
  <article
  class="lg:max-w-[800px] sm:max-w-full  w-full mt-4 text-sm"
>
  <h2 class="mb-2 text-xl text-center font-bold">TopUp Detail</h2>
  <div class="grid sm:grid-cols-2 grid-cols-1   gap-3">
    <div>
      <label for="idpaycode"> ID </label>
      <input
        type="text"
        readonly
        class="input_style"
        value="#${topupItem._id}"
        id="idpaycode"
      />
    </div>
    <div>
      <label for="paycode">Payment </label>
      <input type="text" readonly class="input_style" value="${
        topupItem.nameWallet || topupItem.nameBank
      }" />
    </div>
    <div>
      <label for="paycode"> Pay Code </label>
      <input
        type="text"
        readonly
        class="input_style"
        value="${topupItem.payCode}"
        id="paycode"
      />
    </div>
    <div>
      <label for="Seri"> Seri </label>
      <input
        type="text"
        readonly
        id="Seri"
        class="input_style"
        value="${topupItem.seri}"
      />
    </div>
    <div>
      <label for="Money"> Money </label>
      <input
        type="text"
        readonly
        id="Money"
        class="input_style"
        value="${coverNumber(topupItem.money)}"
      />
    </div>
    <div>
      <label for="Status"> Status </label>
      <input
        type="text"
        readonly
        id="Status"
        class="input_style"
        value="${
          topupItem.status == 1
            ? `Chờ xử lý`
            : topupItem.status == 2
            ? `Thành công`
            : `Thất bại`
        }"
      />
    </div>
    <div>
      <label for="CreateAt"> CreateAt </label>
      <input
        type="text"
        readonly
        id="CreateAt"
        class="input_style"
        value="${dateTimeFormat(topupItem.createdAt)}"
      />
    </div>
    <div>
      <label for="UpdateAt"> UpdateAt </label>
      <input
        type="text"
        readonly
        id="UpdateAt"
        class="input_style"
        value="${dateTimeFormat(topupItem.updatedAt)}"
      />
    </div>
  </div>
</article>
<button
  title="Close (Esc)"
  type="button"
  class="absolute -top-2 right-1 text-4xl hover:text-red-500 btn_close-modal"
>
  ×
</button>`;
  document.querySelector("#modal_views-container").innerHTML = html;
  modalView.classList.remove("hideElement");
};
payment_container.onclick = (e) => {
  if (e.target.closest("button")) {
    const buttonElement = e.target.closest("button");
    const idTopup = buttonElement.closest(".btn_actions").dataset.id;
    const index = buttonElement.closest(".btn_actions").dataset.index;

    if (!idTopup) return false;

    if (buttonElement.classList.contains("btn_view")) {
      const itemTopup = listTopup.find((item) => item._id == idTopup);
      itemTopup && renderDisplayviewTopup(itemTopup);
      return;
    } else if (buttonElement.classList.contains("btn_delete")) {
      renderKingofModalStatus("Bạn muốn xóa nội dung nạp này!");
      modal_btnApply.onclick = () => {
        fetch("/topup/admin/" + idTopup, {
          method: "delete",
        })
          .then((res) => res.json())
          .then((data) => {
            ToastMesage.success(data.message);
            listTopup.splice(index, 1);
            buttonElement.closest(".topup_item").classList.add("hideElement");
            modalStatus.classList.add("hideElement");
            renderListTopup(listTopup);
          })
          .catch((err) => {
            ToastMesage.warning(err.message);
          });
      };
    } else {
      const status = buttonElement.classList.contains("btn_agree")
        ? 2
        : buttonElement.classList.contains("btn_fail")
        ? 3
        : 0;

      if (status) {
        renderKingofModalStatus(
          `Thanh toán này là ${status == 2 ? "thành công" : "thất bại"}?`
        );
        modal_btnApply.onclick = () => {
          fetch("/topup/admin/checktopup", {
            method: "post",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify({ idTopup, status }),
          })
            .then((res) => res.json())
            .then((data) => {
              const { coin, expLv, vip } = data.account;

              document.querySelector("#vip").value = vip;
              document.querySelector("#expLv").value = expLv;
              document.querySelector("#coin").value = coin;

              ToastMesage.success(data.message);
              const itemTopup = listTopup.find((item) => item._id == idTopup);
              itemTopup.status = status;
              modalStatus.classList.add("hideElement");
              renderListTopup(listTopup);
            })
            .catch((err) => {
              ToastMesage.warning(err.message);
            });
        };
      }
    }
  }
};
// end handle Topup
fetch("/user/admin/getinfomation", {
  method: "post",
  headers: {
    "content-type": "application/json",
  },
  body: JSON.stringify({ idUser: idUserInput.value }),
})
  .then((res) => res.json())
  .then((data) => {
    listComment = data.listcomment;
    listTopup = data.listTopup;

    renderListComment(listComment);
    renderListTopup(listTopup);
  })
  .catch((err) => {
    ToastMesage.warning(err.message);
  });
mobiscroll.setOptions({
  theme: "ios",
  themeVariant: "light",
});

mobiscroll.select("#icons", {
  inputElement: document.getElementById("icons-input"),
});
