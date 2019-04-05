"use strict";

var handleNote = function handleNote(e) {
    e.preventDefault();

    $("#noteMessage").animate({ width: 'hide' }, 350);
    if ($("#noteName").val() == '' || $("noteAge").val() == '' || $("noteLevel").val() == '') {
        handleError("RAWR! All fields are required");
        return false;
    }

    sendAjax('POST', $("#noteForm").attr("action"), $("#noteForm").serialize(), function () {
        loadNotesFromServer();
    });
    return false;
};

var NoteForm = function NoteForm(props) {
    return React.createElement(
        "form",
        { id: "noteForm",
            onSubmit: handleNote,
            name: "noteForm",
            action: "/maker",
            method: "POST",
            className: "noteForm"
        },
        React.createElement(
            "label",
            { htmlFor: "title" },
            "Title: "
        ),
        React.createElement("input", { id: "noteTitle", type: "text", name: "title", placeholder: "Note Title" }),
        React.createElement(
            "label",
            { htmlFor: "desc" },
            "Description: "
        ),
        React.createElement("textarea", { id: "noteDesc", type: "text", name: "desc", placeholder: "Note Description" }),
        React.createElement(
            "label",
            { htmlFor: "diffLevel" },
            "Difficulty Level: "
        ),
        React.createElement("input", { id: "noteDiffLevel", type: "number", min: "0", max: "5", name: "diffLevel", placeholder: "Task difficulty" }),
        React.createElement(
            "label",
            { htmlFor: "dueDate" },
            "Due date: "
        ),
        React.createElement("input", { id: "noteDueDate", type: "date", name: "dueDate", placeholder: "Note Description" }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "makeNoteSubmit", type: "submit", value: "Make Note" })
    );
};

var NoteList = function NoteList(props) {
    if (props.notes.length === 0) {
        return React.createElement(
            "div",
            { className: "noteList" },
            React.createElement(
                "h3",
                { className: "emptyNote" },
                "No Notes yet"
            )
        );
    }
    var noteNodes = props.notes.map(function (note) {
        return React.createElement(
            "div",
            { key: note._id, id: note._id, className: "note" },
            React.createElement(
                "h3",
                { className: "noteEdit" },
                "Edit"
            ),
            React.createElement(
                "h3",
                { className: "noteTitle" },
                "Title: ",
                note.title
            ),
            React.createElement(
                "h3",
                { className: "noteDesc" },
                "Description: ",
                note.desc
            ),
            React.createElement(
                "h3",
                { className: "noteDiffLevel" },
                "Difficulty: ",
                note.diffLevel
            ),
            React.createElement(
                "h3",
                { className: "noteDueDate" },
                "Due Date: ",
                note.dueDate
            )
        );
    });

    return React.createElement(
        "div",
        { className: "noteList" },
        noteNodes
    );
};
var loadNotesFromServer = function loadNotesFromServer() {
    sendAjax('GET', '/getNotes', null, function (data) {
        ReactDOM.render(React.createElement(NoteList, { notes: data.notes }), document.querySelector("#notes"));
    });
};

var setup = function setup(csrf) {
    ReactDOM.render(React.createElement(NoteForm, { csrf: csrf }), document.querySelector("#makeNote"));
    ReactDOM.render(React.createElement(NoteList, { notes: [] }), document.querySelector("#notes"));

    //Event bubbling to make edit links trigger Note Edit mode
    //For now it just deletes the note
    document.addEventListener('click', function (event) {
        if (event.target.classList.contains('noteEdit')) {
            event.preventDefault();
            //let noteId = event.target.parentElement.id;
            getEditToken();
        }
    }, false);

    loadNotesFromServer();
};
var getToken = function getToken() {
    sendAjax('GET', '/getToken', null, function (result) {
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    getToken();
});

var handleEditNote = function handleEditNote(e) {
    e.preventDefault();

    $("#noteMessage").animate({ width: 'hide' }, 350);

    sendAjax('POST', $("#noteEditForm").attr("action"), $("#noteEditForm").serialize(), function () {
        loadEditNotesFromServer();
    });
    return false;
};

var NoteEditForm = function NoteEditForm(props) {
    //console.dir(props);
    return React.createElement(
        "form",
        { id: "noteEditForm",
            onSubmit: handleEditNote,
            name: "noteEditForm",
            action: "/deleteNotes",
            method: "POST",
            className: "noteEditForm"
        },
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf })
    );
};

var currentId = void 0;

var NoteDeleteForm = function NoteDeleteForm(props) {
    console.dir("Note Delete Form");
    return React.createElement(
        "form",
        { id: "noteDeleteForm",

            name: "noteDeleteForm",
            action: "/deleteNotes",
            method: "POST",
            className: "noteDeleteForm"
        },
        React.createElement("input", { type: "hidden", name: "_id", value: currentId }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf })
    );
};

var FormHandle = function FormHandle(e) {};

var handleDeleteNote = function handleDeleteNote(e) {
    //e.preventDefault();

    $("#noteMessage").animate({ width: 'hide' }, 350);
    console.log("handle");
    sendAjax('POST', $("#noteDeleteForm").attr("action"), $("#noteDeleteForm").serialize(), function () {

        loadEditNotesFromServer();
    });
    return false;
};

//displays all notes a user owns and adds inputs, delete and update buttons
var NoteEditList = function NoteEditList(props) {
    if (props.notes.length === 0) {
        return React.createElement(
            "div",
            { className: "noteEditList" },
            React.createElement(
                "h3",
                { className: "emptyNote" },
                "No Notes to Edit"
            )
        );
    }
    var noteNodes = props.notes.map(function (note) {
        return React.createElement(
            "div",
            { key: note._id, id: note._id, className: "note" },
            React.createElement(
                "label",
                { htmlFor: "title" },
                "Title: "
            ),
            React.createElement("input", { id: "noteTitle", type: "text", name: "title", placeholder: "Note Title" }),
            React.createElement(
                "label",
                { htmlFor: "desc" },
                "Description: "
            ),
            React.createElement("textarea", { id: "noteDesc", type: "text", name: "desc", placeholder: "Note Description" }),
            React.createElement(
                "label",
                { htmlFor: "diffLevel" },
                "Difficulty Level: "
            ),
            React.createElement("input", { id: "noteDiffLevel", type: "number", min: "0", max: "5", name: "diffLevel", placeholder: "Task difficulty" }),
            React.createElement(
                "label",
                { htmlFor: "dueDate" },
                "Due date: "
            ),
            React.createElement("input", { id: "noteDueDate", type: "date", name: "dueDate", placeholder: "Note Description" }),
            React.createElement(
                "h3",
                { className: "noteDelete", id: "noteDelete" },
                "Delete"
            ),
            React.createElement(
                "h3",
                { className: "noteUpdate", id: "noteUpdate" },
                "Update"
            )
        );
    });

    return React.createElement(
        "div",
        null,
        React.createElement(
            "h1",
            { id: "editMessage" },
            "Select Note to Edit or Delete"
        ),
        React.createElement(
            "div",
            { className: "noteEditList" },
            noteNodes
        )
    );
};
//loads the edit screen
var loadEditNotesFromServer = function loadEditNotesFromServer() {
    sendAjax('GET', '/getNotes', null, function (data) {
        ReactDOM.render(React.createElement(NoteEditList, { notes: data.notes }), document.querySelector("#notes"));
    });
};

//sets up edit screen with CSRF tokens and event listeners
var setupEdit = function setupEdit(csrf) {
    //console.log("test");
    ReactDOM.render(React.createElement(NoteEditList, { notes: [] }), document.querySelector("#notes"));
    ReactDOM.render(React.createElement(NoteEditForm, { csrf: csrf }), document.querySelector("#makeNote"));

    //Event bubbling to make edit links trigger Note Edit mode
    //For now it just deletes the note
    document.addEventListener('click', function (event) {
        if (event.target.classList.contains('noteDelete')) {
            currentId = event.target.parentElement.id;
            ReactDOM.render(React.createElement(NoteDeleteForm, { csrf: csrf }), document.querySelector("#makeNote"));
            handleDeleteNote();
        }
    }, false);

    document.addEventListener('click', function (event) {
        if (event.target.classList.contains('noteUpdate')) {
            console.log("clicked");
        }
    }, false);

    loadEditNotesFromServer();
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
