"use strict";
//deletes user account
var handleDelete = function handleDelete(e) {
    e.preventDefault();

    $("#noteMessage").animate({ width: 'hide' }, 350);

    if ($("#pass").val() == '') {
        handleError("All fields are required");
        return false;
    }
    sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);
    return false;
};

//populates the page with inputs
var deleteWindow = function deleteWindow (props) {
    return React.createElement(
        "form",
        { id: "signupForm",
            name: "signupForm",
            onSubmit: handleDelete,
            action: "/deleteAccount",
            method: "POST",
            className: "mainForm"
        },
            React.createElement(
                "h1",
                { htmlFor: "pass" },
                "Confirm pass to delete:"
            ),
        React.createElement(
            "div",
            null,
            
            React.createElement(
                "label",
                { htmlFor: "pass" },
                "Password: "
            ),
            React.createElement("input", { id: "pass", type: "password", name: "pass", placeholder: "password" }),
         
            React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
            React.createElement("input", { className: "formSubmit", type: "submit", value: "Delete" })
        )//,
         //React.createElement("input", { id:"back", className: "formSubmit", type: "submit", value: "Back" }),
    );
};

//renders delete window to page to give us inputs
var createDeleteWindow = function createChangePassWindow (csrf) {
    ReactDOM.render(React.createElement(deleteWindow , { csrf: csrf }), document.querySelector("#content"));
};

//calls create delete window which populates the page
var setup = function setup(csrf) {
    createDeleteWindow(csrf);
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
