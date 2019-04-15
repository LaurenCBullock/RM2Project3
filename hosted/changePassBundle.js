"use strict";

var handlePassChange = function handleSignup(e) {
    e.preventDefault();

    $("#noteMessage").animate({ width: 'hide' }, 350);

    if ($("#pass").val() == '' || $("#pass2").val() == '') {
        handleError("All fields are required");
        return false;
    }

    if ($("#pass").val() !== $("#pass2").val()) {
        handleError("Passwords do not match");
        return false;
    }

    sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);
    return false;
};


var changePassWindow = function changePassWindow (props) {
    return React.createElement(
        "form",
        { id: "signupForm",
            name: "signupForm",
            onSubmit: handlePassChange,
            action: "/changePass",
            method: "POST",
            className: "mainForm"
        },
        React.createElement(
            "div",
            null,
            React.createElement(
                "label",
                { htmlFor: "pass" },
                "New Pass: "
            ),
            React.createElement("input", { id: "pass", type: "password", name: "pass", placeholder: "password" }),
            React.createElement(
                "label",
                { htmlFor: "pass2" },
                "New Pass: "
            ),
            React.createElement("input", { id: "pass2", type: "password", name: "pass2", placeholder: "retype Password" }),
            React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
            React.createElement("input", { className: "formSubmit", type: "submit", value: "Change" })
        )
    );
};


var createChangePassWindow = function createChangePassWindow (csrf) {
    ReactDOM.render(React.createElement(changePassWindow , { csrf: csrf }), document.querySelector("#content"));
};

var setup = function setup(csrf) {

    var back = document.querySelector("#back");

    /*back.addEventListener("back", function (e) {
        e.preventDefault();
        //createSignupWindow(csrf);
        return false;
    });
*/
    createChangePassWindow(csrf);
};

var getToken = function getToken() {
    sendAjax('GET', '/getToken', null, function (result) {
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    getToken();
});
"use strict";

var handleError = function handleError(message) {
    $("#errorMessage").text(message);
    $("#noteMessage").animate({ height: 'toggle' }, 350);
};
var redirect = function redirect(response) {
    $("#noteMessage").animate({ height: 'hide' }, 350);
    window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function error(xhr, status, _error) {
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};
