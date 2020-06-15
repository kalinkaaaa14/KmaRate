$(document).ready(function () {

    function addUpload() {
        $(".custom-file-input").on("change", function () {
            let fileName = $(this).val().split("\\").pop();
            $(this).siblings(".custom-file-label").addClass("selected").html(fileName);

            let reader = new FileReader();
            reader.onload = function (event) {
                console.log(event);
                console.log(event.target.result.length);
                // get loaded data and render thumbnail.
                if(event.target.result.startsWith('data:image/')) {
                    document.getElementById("userImage").src = event.target.result;
                }
            };
            // read the image file as a data URL.
            reader.readAsDataURL(this.files[0]);
        });
    }


    getInfoEdit();


    function getInfoEdit() {
        let urlPartsArr = window.location.href.split('/');
        let user_nick = urlPartsArr[urlPartsArr.length - 1];

        $.ajax({
//url: /settings/data
            url: "/settings/data",
            type: 'GET',
            success: function (data, textStatus, xhr) {
                // console.log(data);
                console.log(data);

                formatData(data.userData, data.branchs);
                document.getElementById('userImage').src = data.userData.image_string;
                $('#saveEdit').click(sendInfo);
                $('#saveEditPassword').click(changePassword);
                addUpload();
            },
            error: function (xhr, textStatus, errorThrown) {

                console.log('Error in Operation');
            }
        });
    }

    function sendInfo() {
        let subj = {
            nickname: document.getElementsByName('nick')[0].value,
            branch_id: document.getElementsByName('userBranch')[0].value.split(" ")[0],
            branch_title: document.getElementsByName('userBranch')[0].value.slice(4),
            email: document.getElementsByName('mailUser')[0].value,
            facebook: document.getElementsByName('fb')[0].value,
            instagram: document.getElementsByName('insta')[0].value,
            telegram: document.getElementsByName('telega')[0].value,
            image_string: document.getElementById('userImage').src
        }

        if (subj.email === "" || subj.nickname === "") {
            return alert("Поля, позначені *, не можуть бути порожніми.");
        }
        if (subj.email.indexOf(".") == -1) {

            return  alert("У пошті повинен бути символ \".\"");
        }

        let dog = subj.email.indexOf("@");
        if (dog == -1) {
            return alert("У пошті повинен бути символ \"@\".");
        }

        if ((subj.email.charAt(dog - 1) == '.') || (subj.email.charAt(dog + 1) == '.')
            || (subj.email.indexOf(",")>=0) || (subj.email.indexOf(";")>=0)
        || (subj.email.indexOf(" ")>=0) || (dog < 1) || (dog > subj.email.length - 5)) {
            return   alert("Адреса електронної пошти введена невірно.");
        }


        $.ajax({
            //url: /settings/data
            url: "/settings/data",
            type: 'POST',
            data: subj,
            success: function (data, textStatus, xhr) {
                // console.log(data);
                //formatData(data);
                alert(data.message);
                if (data.redirect) {
                    window.location = data.redirect;
                }
                return false;
            },
            error: function (xhr, textStatus, errorThrown) {

                console.log('Error in Operation');
            }
        });


    }

    function changePassword() {

        if (document.getElementsByName('newPsw1')[0].value === document.getElementsByName('newPsw2')[0].value) {
            var changePswrd = {
                oldPassword: document.getElementsByName('oldPsw')[0].value,
                newPassword: document.getElementsByName('newPsw1')[0].value
            }

            $.ajax({
                //url: /settings/password
                url: "/settings/password",
                type: 'POST',
                data: changePswrd,
                success: function (data, textStatus, xhr) {
                    alert(data.message);
                    if (data.redirect) {
                        window.location = data.redirect;
                    }
                    return false;
                },
                error: function (xhr, textStatus, errorThrown) {

                    console.log('Error in Operation');
                }
            });

        } else {
            alert("Підтверджений пароль не співпадає");
        }
    }

    function formatData(data, branchs) {
        data.branch_title = " " + data.branch_title[0].toUpperCase() + data.branch_title.slice(1) + " ";
        if (data.telegram == null) {
            data.telegram = "";
        }
        if (data.facebook == null) {
            data.facebook = "";
        }
        if (data.instagram == null) {
            data.instagram = "";
        }
        $('#editProfileInfo').html(showEditProfile(data, branchs));
    }

    function showEditProfile(data, branchs) {
        let res = "";
        res += "<div class='row'>" +
            "<div class='col-sm-12'>" +
            "<br>" +
            "<p class='editHeader mb-4'> Редагування профілю</p>" +
            "<form id='editFormId' class='editForm'>" +
            "<div class='container'>" +
            "<p class='userInfoEdit mt-4 ml-5'> Особиста інформація</p>" +
            "</div>" +

            "<div class='container'>" +
            "<div class='row'>" +
            "<div class='col-sm-3'></div>" +
            "<div class='col-sm-6'>" +
            "<div class='text-center'>" +
            "<img id='userImage' src='/images/defUser.png' alt='avatar' class='mt-1 rounded-circle editAvatar'>" +
            "</div>" +
            "</div>" +
            "<div class='col-sm-3'></div>" +
            "</div>" +
            "<div class='row mt-3'>" +
            "<div class='col-sm-3'></div>" +
            "<div class='col-sm-6 custom-file ml-2 mr-2'>" +
            //  "<input type='file' class='custom-file-input' id='customFile'>"+
            `<div class="custom-file mb-3">
            <input type="file" class="custom-file-input" id="customFile" name="filename">
            <label class="custom-file-label" for="customFile">Завантажити фото</label>
        </div>` +
            // "<label class='custom-file-label' for='customFile'><i class='fa fa-picture-o mr-1' aria-hidden='true'></i>Завантажити фото</label>" +
            "</div>" +
            "<div class='col-sm-3'></div>" +
            "</div>" +
            "</div>" +
            "<br>" +
            "<div class='container'>" +
            "<div class='form-inline'>" +
            "<label class='ml-5 mr-5 loginEdit' for='uname2'>Логін *</label>" +
            "<input type='text' name='nick' class='form-control'   id='uname2' value='" + data.nickname + "' placeholder='Твій нікнейм...'>" +
            "</div>" +
            "<br>" +
            "<div class='form-inline'>" +
            "<label class='ml-5 mr-5 loginEdit' >Спеціальність</label>" +
            "<select name='userBranch' id='userBranch' class='custom-select' required>";
        // "<option>" + data.branch_id + data.branch_title + " </option>";

        for (let branch of branchs) {
            let title = branch.id + " " + branch.title[0].toUpperCase() + branch.title.slice(1);
            if (data.branch_id === branch.id) {
                res += "<option selected=\"selected\">" + title + " </option>";
            } else {
                res += "<option>" + title + " </option>";
            }
        }

        res +=
            "</select>" +
            "</div>" +
            "</div>" +
            "<br>" +
            "<div class='container'>" +
            "<h5 class='userInfoEdit ml-5 mt-4'> Безпека</h5>" +
            "<button data-toggle='modal' data-target='#changePswrd' class='ml-5 btn btn-primary text-white mt-3 editChangePswrd' type='button'><i class='fa fa-key' aria-hidden='true'></i> Змінити пароль</button>" +
            "</div>" +
            "<br>" +

            "<div class='container'>" +
            "<h5 class='userInfoEdit ml-5 mt-4 mb-3'> Контакти</h5>" +

            "<div class='form-inline'>" +
            "<label class='ml-5 mr-5 loginEdit' for='mailUser'><b>Пошта *</b></label>" +
            "<input name='mailUser' class='form-control' type='email' id='mailUser' required value='" + data.email + "'>" +

            "</div>" +
            "<br>" +
            "<div class='form-inline'>" +
            "<label class='ml-5 mr-5 loginEdit' for='telega'><b>Telegram @</b></label>" +
            "<input name='telega' class='form-control' type='text' id='telega' value='" + data.telegram + "'>" +
            "</div>" +
            "<br>" +
            "<div class='form-inline'>" +
            "<label class='ml-5 mr-5 loginEdit' for='fb'><b>Facebook @</b></label>" +
            "<input name='fb' class='form-control' type='text' id='fb' value='" + data.facebook + "'>" +
            "</div>" +
            "<br>" +
            "<div class='form-inline'>" +
            "<label class='ml-5 mr-5 loginEdit' for='insta'><b>Instagram @</b></label>" +
            "<input name='insta' class='form-control' type='text'  id='insta' value='" + data.instagram + "'>" +
            "</div>" +
            "<br>" +
            "</div>" +
            "<div class='input-container-fluid endEditForm'>" +
            "<button id='saveEdit' class='btn btn-lg mr-5 mb-4 text-white saveEditForm' type='button'>Зберегти</button>" +
            "</div>" +
            "</form>" +
            "</div>" +
            "<div class='col-sm-3'>" +
            "</div>" +
            "</div>";

        return res;

    }
});