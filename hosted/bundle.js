"use strict";

var handleDomo = function handleDomo(e) {
    e.preventDefault();

    $("#domoMessage").animate({ width: 'hide' }, 350);
    if ($("#domoName").val() == '' || $("domoAge").val() == '' || $("domoLevel").val() == '') {
        handleError("RAWR! All fields are required");
        return false;
    }

    sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function () {
        loadDomosFromServer();
    });
    return false;
};

var DomoForm = function DomoForm(props) {
    return React.createElement(
        "form",
        { id: "domoForm",
            onSubmit: handleDomo,
            name: "domoForm",
            action: "/maker",
            method: "POST",
            className: "domoForm"
        },
        React.createElement(
            "label",
            { htmlFor: "name" },
            "Name: "
        ),
        React.createElement("input", { id: "domoName", type: "text", name: "name", placeholder: "Domo Name" }),
        React.createElement(
            "label",
            { htmlFor: "age" },
            "Age: "
        ),
        React.createElement("input", { id: "domoAge", type: "text", name: "age", placeholder: "Domo Age" }),
        React.createElement(
            "label",
            { htmlFor: "level" },
            "Level: "
        ),
        React.createElement("input", { id: "domoLevel", type: "text", name: "level", placeholder: "Domo Level" }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "makeDomoSubmit", type: "submit", value: "Make Domo" })
    );
};

var DomoList = function DomoList(props) {
    if (props.domos.length === 0) {
        return React.createElement(
            "div",
            { className: "domoList" },
            React.createElement(
                "h3",
                { className: "emptyDomo" },
                "No Domos yet"
            )
        );
    }
    var domoNodes = props.domos.map(function (domo) {
        return React.createElement(
            "div",
            { key: domo._id, id: domo._id, className: "domo" },
            React.createElement("img", { src: "/assets/img/domoface.jpeg", alt: "domo face", className: "domoFace" }),
            React.createElement(
                "h3",
                { className: "domoName" },
                "Name: ",
                domo.name
            ),
            React.createElement(
                "h3",
                { className: "domoAge" },
                "Age: ",
                domo.age
            ),
            React.createElement(
                "h3",
                { className: "domoLevel" },
                "Level: ",
                domo.level
            ),
            React.createElement(
                "h3",
                { className: "domoEdit" },
                "Edit"
            )
        );
    });

    return React.createElement(
        "div",
        { className: "domoList" },
        domoNodes
    );
};
var loadDomosFromServer = function loadDomosFromServer() {
    sendAjax('GET', '/getDomos', null, function (data) {
        ReactDOM.render(React.createElement(DomoList, { domos: data.domos }), document.querySelector("#domos"));
    });
};

var setup = function setup(csrf) {
    ReactDOM.render(React.createElement(DomoForm, { csrf: csrf }), document.querySelector("#makeDomo"));
    ReactDOM.render(React.createElement(DomoList, { domos: [] }), document.querySelector("#domos"));

    //Event bubbling to make edit links trigger Domo Edit mode
    //For now it just deletes the domo
    document.addEventListener('click', function (event) {
        if (event.target.classList.contains('domoEdit')) {
            event.preventDefault();
            var domoId = event.target.parentElement.id;
            getEditToken();
        }
    }, false);

    loadDomosFromServer();
};
var getToken = function getToken() {
    sendAjax('GET', '/getToken', null, function (result) {
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    getToken();
});

var handleEditDomo = function handleEditDomo(e) {
    e.preventDefault();

    $("#domoMessage").animate({ width: 'hide' }, 350);

    sendAjax('POST', $("#domoEditForm").attr("action"), $("#domoEditForm").serialize(), function () {
        loadEditDomosFromServer();
    });
    return false;
};

var DomoEditForm = function DomoEditForm(props) {
    //console.dir(props);
    return React.createElement(
        "form",
        { id: "domoEditForm",
            onSubmit: handleEditDomo,
            name: "domoEditForm",
            action: "/deleteDomos",
            method: "POST",
            className: "domoEditForm"
        },
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf })
    );
};

var DomoDeleteForm = function DomoDeleteForm(props) {
    console.dir(props);
    return React.createElement(
        "form",
        { id: "domoDeleteForm",
            onSubmit: handleDeleteDomo,
            name: "domoDeleteForm",
            action: "/deleteDomos",
            method: "POST",
            className: "domoDeleteForm"
        },
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf })
    );
};

var handleDeleteDomo = function handleDeleteDomo(e) {
    e.preventDefault();

    $("#domoMessage").animate({ width: 'hide' }, 350);

    sendAjax('POST', $("#domoDeleteForm").attr("action"), $("#domoDeleteForm").serialize(), function () {
        loadEditDomosFromServer();
    });
    return false;
};

//displays all domos a user owns and adds inputs, delete and update buttons
var DomoEditList = function DomoEditList(props) {
    if (props.domos.length === 0) {
        return React.createElement(
            "div",
            { className: "domoEditList" },
            React.createElement(
                "h3",
                { className: "emptyDomo" },
                "No Domos to Edit"
            )
        );
    }
    var domoNodes = props.domos.map(function (domo) {
        return React.createElement(
            "div",
            { key: domo._id, id: domo._id, className: "domo" },
            React.createElement("img", { src: "/assets/img/domoface.jpeg", alt: "domo face", className: "domoFace" }),
            React.createElement(
                "h3",
                { className: "domoName" },
                "Name: ",
                React.createElement("input", { id: "domoName", type: "text", name: "name", placeholder: domo.name })
            ),
            React.createElement(
                "h3",
                { className: "domoAge" },
                "Age: ",
                React.createElement("input", { id: "domoAge", type: "text", name: "age", placeholder: domo.age })
            ),
            React.createElement(
                "h3",
                { className: "domoLevel" },
                "Level: ",
                React.createElement("input", { id: "domoLevel", type: "text", name: "level", placeholder: domo.level })
            ),
            React.createElement(
                "h3",
                { className: "domoDelete", id: "domoDelete" },
                "DELETE "
            ),
            React.createElement(
                "h3",
                { className: "domoUpdate", id: "domoUpdate" },
                " UPDATE"
            )
        );
    });

    return React.createElement(
        "div",
        null,
        React.createElement(
            "h1",
            { id: "editMessage" },
            "Select Domo to Edit or Delete"
        ),
        React.createElement(
            "div",
            { className: "domoEditList" },
            domoNodes
        )
    );
};
//loads the edit screen
var loadEditDomosFromServer = function loadEditDomosFromServer() {
    sendAjax('GET', '/getDomos', null, function (data) {
        ReactDOM.render(React.createElement(DomoEditList, { domos: data.domos }), document.querySelector("#domos"));
    });
};

//sets up edit screen with CSRF tokens and event listeners
var setupEdit = function setupEdit(csrf) {
    //console.log("test");
    ReactDOM.render(React.createElement(DomoEditList, { domos: [] }), document.querySelector("#domos"));
    ReactDOM.render(React.createElement(DomoEditForm, { csrf: csrf }), document.querySelector("#makeDomo"));

    //Event bubbling to make edit links trigger Domo Edit mode
    //For now it just deletes the domo
    document.addEventListener('click', function (event) {
        if (event.target.classList.contains('domoDelete')) {
            //console.log("sending delete");
            ReactDOM.render(React.createElement(DomoDeleteForm, { csrf: csrf }), document.querySelector("#makeDomo"));
        }
    }, false);

    document.addEventListener('click', function (event) {
        if (event.target.classList.contains('domoUpdate')) {
            console.log("clicked");
        }
    }, false);

    loadEditDomosFromServer();
};

//added to test CSRF on new page
var getEditToken = function getEditToken() {
    console.log("csrf token");
    sendAjax('GET', '/getToken', null, function (result) {
        setupEdit(result.csrfToken);
    });
};
"use strict";

var handleError = function handleError(message) {
    $("#errorMessage").text(message);
    $("#domoMessage").animate({ width: 'toggle' }, 350);
};
var redirect = function redirect(response) {
    $("#domoMessage").animate({ width: 'hide' }, 350);
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
