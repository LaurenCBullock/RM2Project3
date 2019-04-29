"use strict";

var handleNote = function handleNote(e) {
    e.preventDefault();

    $("#noteMessage").animate({ width: 'hide' }, 350);
    if ($("#noteTitle").val() == '' || $("noteDesc").val() == '' || $("noteDiffLevel").val() == '' || $("noteDueTime").val() == '' || $("noteDueDate").val() == '' || $("noteFinished").val() == '') {
        handleError("All fields are required");
        return false;
    }

    sendAjax('POST', $("#noteForm").attr("action"), $("#noteForm").serialize(), function () {
        loadNotesFromServer();
    });
    return false;
};

var NoteForm = function NoteForm(props) {
    return React.createElement(
        "div",
        null,
        React.createElement(
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
            React.createElement("input", { className: "noteTitle", type: "text", name: "title", placeholder: "Note Title" }),
            React.createElement("br", null),
            React.createElement(
                "label",
                { htmlFor: "desc" },
                "Description: "
            ),
            React.createElement("textarea", { className: "noteDesc", type: "text", name: "desc", placeholder: "Note Description" }),
            React.createElement("br", null),
            React.createElement(
                "label",
                { htmlFor: "diffLevel" },
                "Difficulty Level: "
            ),
            React.createElement("input", { className: "noteDiffLevel", type: "number", min: "0", max: "5", name: "diffLevel", placeholder: "Task difficulty" }),
            React.createElement("br", null),
            React.createElement(
                "label",
                { htmlFor: "dueDate" },
                "Due date: "
            ),
            React.createElement("input", { className: "noteDueDate", type: "date", name: "dueDate", placeholder: "Note Description" }),
            React.createElement("br", null),
            React.createElement(
                "label",
                { htmlFor: "dueTime" },
                "Time due: "
            ),
            React.createElement("input", { className: "noteDueTime", type: "time", name: "dueTime", placeholder: "Note Description" }),
            React.createElement("br", null),
            React.createElement("input", { className: "noteFinished", type: "hidden", name: "noteFinished", value: "false" }),
            React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
            React.createElement("input", { className: "makeNoteSubmit", type: "submit", value: "Make Note" })
        ),
        React.createElement(
            "div",
            { id: "filters" },
            React.createElement(
                "label",
                { htmlFor: "sort" },
                "Sort By:"
            ),
            React.createElement(
                "select",
                { className: "sort" },
                React.createElement(
                    "option",
                    { value: "dueSoonest" },
                    "Due Soonest"
                ),
                React.createElement(
                    "option",
                    { value: "diffLowHigh" },
                    "Diff Low-High"
                ),
                React.createElement(
                    "option",
                    { value: "diffHighLow" },
                    "Diff High-Low"
                )
            ),
            React.createElement(
                "label",
                { htmlFor: "tasks" },
                "Task Type:"
            ),
            React.createElement(
                "select",
                { className: "task" },
                React.createElement(
                    "option",
                    { value: "allTasks" },
                    "All Tasks"
                ),
                React.createElement(
                    "option",
                    { value: "completedTasks" },
                    "Completed Tasks"
                ),
                React.createElement(
                    "option",
                    { value: "incompleteTasks" },
                    "Incomplete Tasks"
                )
            )
        )
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
        var d = new Date(note.dueDate);
        if (note.noteFinished == true) {
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
                    d.toDateString()
                ),
                React.createElement(
                    "h3",
                    { className: "noteDueTime" },
                    "Due Time: ",
                    note.dueTime
                ),
                React.createElement(
                    "h3",
                    { className: "noteFinished" },
                    "Finished?:"
                ),
                React.createElement("input", { className: "noteFinished", type: "checkbox", name: "finished", checked: true })
            );
        } else if (note.noteFinished == false) {
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
                    d.toDateString()
                ),
                React.createElement(
                    "h3",
                    { className: "noteDueTime" },
                    "Due Time: ",
                    note.dueTime
                ),
                React.createElement(
                    "h3",
                    { className: "noteFinished" },
                    "Finished?:"
                ),
                React.createElement("input", { className: "noteFinished", type: "checkbox", name: "finished" })
            );
        }
    });

    return React.createElement(
        "div",
        { className: "noteList" },
        React.createElement(
            "h1",
            null,
            "All Notes"
        ),
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

    //Delete account button
    document.addEventListener('click', function (event) {
        if (event.target.classList.contains('accountDelete')) {
            event.preventDefault();

            getDAToken();
        }
    }, false);

    //Change Finished Status
    document.addEventListener('click', function (event) {
        if (event.target.classList.contains('noteFinished')) {
            currentId = event.target.parentElement.id;
            ReactDOM.render(React.createElement(NoteFinishedForm, { csrf: csrf }), document.querySelector("#hiddenData"));
            handleFinishedNote();
        }
    }, false);

    document.addEventListener('change', function (event) {
        if (event.target.classList.contains('sort')) {
            /*
            */
            switch (event.target.value) {
                case "dueSoonest":
                    sendAjax('GET', '/getNotes', null, function (data) {
                        ReactDOM.render(React.createElement(NoteDueSoonList, { notes: data.notes }), document.querySelector("#notes"));
                    });
                    break;
                case "diffLowHigh":
                    sendAjax('GET', '/getNotes', null, function (data) {
                        ReactDOM.render(React.createElement(NoteDiffLowHighList, { notes: data.notes }), document.querySelector("#notes"));
                    });

                    break;
                case "diffHighLow":
                    sendAjax('GET', '/getNotes', null, function (data) {
                        ReactDOM.render(React.createElement(NoteDiffHighLowList, { notes: data.notes }), document.querySelector("#notes"));
                    });
                    break;
            }
        }
    }, false);

    document.addEventListener('change', function (event) {
        if (event.target.classList.contains('task')) {

            switch (event.target.value) {
                case "allTasks":
                    sendAjax('GET', '/getNotes', null, function (data) {
                        ReactDOM.render(React.createElement(NoteList, { notes: data.notes }), document.querySelector("#notes"));
                    });
                    break;
                case "completedTasks":
                    sendAjax('GET', '/getNotes', null, function (data) {
                        ReactDOM.render(React.createElement(NoteCompletedList, { notes: data.notes }), document.querySelector("#notes"));
                    });

                    break;
                case "incompleteTasks":
                    sendAjax('GET', '/getNotes', null, function (data) {
                        ReactDOM.render(React.createElement(NoteIncompleteList, { notes: data.notes }), document.querySelector("#notes"));
                    });
                    break;
            }
            console.log(event.target.value);
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

    $("#noteMessage").animate({ height: 'hide' }, 350);

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

//variables
var title = void 0;
var desc = void 0;
var dueDate = void 0;
var dueTime = void 0;
var Level = void 0;
var finished = '';

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

var NoteUpdateForm = function NoteUpdateForm(props) {
    console.dir("Note Update Form");
    return React.createElement(
        "form",
        { id: "noteUpdateForm",

            name: "noteUpdateForm",
            action: "/updateNotes",
            method: "POST",
            className: "noteUpdateForm"
        },
        React.createElement("input", { type: "hidden", name: "title", value: title }),
        React.createElement("input", { type: "hidden", name: "desc", value: desc }),
        React.createElement("input", { type: "hidden", name: "dueDate", value: dueDate }),
        React.createElement("input", { type: "hidden", name: "dueTime", value: dueTime }),
        React.createElement("input", { type: "hidden", name: "Level", value: Level }),
        React.createElement("input", { type: "hidden", name: "noteFinished", value: finished }),
        React.createElement("input", { type: "hidden", name: "_id", value: currentId }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf })
    );
};

var handleDeleteNote = function handleDeleteNote(e) {
    //e.preventDefault();

    $("#noteMessage").animate({ width: 'hide' }, 350);
    console.log("handle");
    sendAjax('POST', $("#noteDeleteForm").attr("action"), $("#noteDeleteForm").serialize(), function () {});
    sendAjax('GET', '/getNotes', null, function (data) {
        ReactDOM.render(React.createElement(NoteEditList, { notes: data.notes }), document.querySelector("#notes"));
    });
    return false;
};

var handleUpdateNote = function handleUpdateNote(e) {
    //e.preventDefault();


    $("#noteMessage").animate({ width: 'hide' }, 350);
    console.log("handle");
    sendAjax('POST', $("#noteUpdateForm").attr("action"), $("#noteUpdateForm").serialize(), function () {});
    getToken();
    return false;
};

//displays all notes a user owns and adds inputs, delete and update buttons
var NoteEditList = function NoteEditList(props) {
    if (props.notes.length === 0) {
        return React.createElement(
            "div",
            null,
            React.createElement(
                "h1",
                { id: "editMessage" },
                "Select Note to Edit or Delete"
            ),
            React.createElement(
                "h3",
                { className: "emptyNote" },
                "No Notes to Edit"
            ),
            React.createElement(
                "h1",
                { className: "backMessage" },
                "BACK"
            )
        );
    }
    var noteNodes = props.notes.map(function (note) {
        var d = new Date(note.dueDate);

        return React.createElement(
            "div",
            { key: note._id, id: note._id, className: "note" },
            React.createElement(
                "label",
                { htmlFor: "title" },
                "Title: "
            ),
            React.createElement("input", { className: "noteTitle", type: "text", name: "title", placeholder: note.title }),
            React.createElement(
                "label",
                { htmlFor: "desc" },
                "Description: "
            ),
            React.createElement("textarea", { className: "noteDesc", type: "text", name: "desc", placeholder: note.desc }),
            React.createElement(
                "label",
                { htmlFor: "diffLevel" },
                "Difficulty Level: "
            ),
            React.createElement("input", { className: "noteDiffLevel", type: "number", min: "0", max: "5", name: "diffLevel", placeholder: note.diffLevel }),
            React.createElement(
                "label",
                { htmlFor: "dueDate" },
                "Due date: "
            ),
            React.createElement("input", { className: "noteDueDate", type: "date", name: "dueDate", placeholder: d.toDateString() }),
            React.createElement(
                "label",
                { htmlFor: "dueTime" },
                "Time due: "
            ),
            React.createElement("input", { className: "noteDueTime", type: "time", name: "dueTime", placeholder: note.dueTime }),
            React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
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
        return React.createElement(
            "div",
            { key: note._id, id: note._id, className: "note" },
            React.createElement(
                "h3",
                { className: "noteTitle" },
                "Title: "
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
                d.toDateString()
            ),
            React.createElement(
                "h3",
                { className: "noteDueTime" },
                "Due Time: ",
                note.dueTime
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
        ),
        React.createElement(
            "h1",
            { className: "backMessage" },
            "BACK"
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
        if (event.target.classList.contains('backMessage')) {
            getToken();
        }
    }, false);

    //emptyNote
    document.addEventListener('click', function (event) {
        if (event.target.classList.contains('noteUpdate')) {
            console.log(event.target.parentElement.querySelector(".noteTitle").value);
            currentId = event.target.parentElement.id;
            title = event.target.parentElement.querySelector(".noteTitle").value;
            desc = event.target.parentElement.querySelector(".noteDesc").value;
            dueDate = event.target.parentElement.querySelector(".noteDueDate").value;
            dueTime = event.target.parentElement.querySelector(".noteDueTime").value;
            Level = event.target.parentElement.querySelector(".noteDiffLevel").value;
            console.log(event.target.parentElement.querySelector(".noteDiffLevel").value);

            ReactDOM.render(React.createElement(NoteUpdateForm, { csrf: csrf }), document.querySelector("#makeNote"));
            handleUpdateNote();
        }
    }, false);

    loadEditNotesFromServer();
};

//added to test CSRF on new page
//send and setup edit page
var getEditToken = function getEditToken() {
    console.log("csrf token");
    sendAjax('GET', '/getToken', null, function (result) {
        setupEdit(result.csrfToken);
    });
};

var handleFinishedNote = function handleFinishedNote(e) {
    $("#noteMessage").animate({ width: 'hide' }, 350);
    console.log("handle");
    sendAjax('POST', $("#noteFinishedForm").attr("action"), $("#noteFinishedForm").serialize(), function () {});
    return false;
};

var NoteFinishedForm = function NoteFinishedForm(props) {
    console.dir("Note Finished Form");
    return React.createElement(
        "form",
        { id: "noteFinishedForm",

            name: "noteFinishedForm",
            action: "/finishedNotes",
            method: "POST",
            className: "noteFinishedForm"
        },
        React.createElement("input", { type: "hidden", name: "_id", value: currentId }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf })
    );
};

//form to show all completed tasks
var NoteCompletedList = function NoteCompletedList(props) {
    if (props.notes.length === 0) {
        return React.createElement(
            "div",
            null,
            React.createElement(
                "h1",
                { id: "editMessage" },
                "Select Note to Edit or Delete"
            ),
            React.createElement(
                "h3",
                { className: "emptyNote" },
                "No Notes to Edit"
            ),
            React.createElement(
                "h1",
                { className: "backMessage" },
                "BACK"
            )
        );
    }
    var noteNodes = props.notes.map(function (note) {

        var d = new Date(note.dueDate);
        if (note.noteFinished) {
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
                    d.toDateString()
                ),
                React.createElement(
                    "h3",
                    { className: "noteDueTime" },
                    "Due Time: ",
                    note.dueTime
                ),
                React.createElement(
                    "h3",
                    { className: "noteFinished" },
                    "Finished?:"
                ),
                React.createElement("input", { className: "noteFinished", type: "checkbox", name: "finished", checked: true })
            );
        } else {
            return;
        }
    });
    var noteNodes1 = props.notes.map(function (note) {

        var d = new Date(note.dueDate);
        if (!note.noteFinished) {
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
                    d.toDateString()
                ),
                React.createElement(
                    "h3",
                    { className: "noteDueTime" },
                    "Due Time: ",
                    note.dueTime
                ),
                React.createElement(
                    "h3",
                    { className: "noteFinished" },
                    "Finished?:"
                ),
                React.createElement("input", { className: "noteFinished", type: "checkbox", name: "finished" })
            );
        } else {
            return;
        }
    });

    return React.createElement(
        "div",
        { className: "noteEditList" },
        React.createElement(
            "h1",
            null,
            "Completed Tasks"
        ),
        noteNodes,
        React.createElement(
            "h1",
            null,
            "Incomplete Tasks"
        ),
        noteNodes1
    );
};

var NoteIncompleteList = function NoteIncompleteList(props) {
    if (props.notes.length === 0) {
        return React.createElement(
            "div",
            null,
            React.createElement(
                "h1",
                { id: "editMessage" },
                "Select Note to Edit or Delete"
            ),
            React.createElement(
                "h3",
                { className: "emptyNote" },
                "No Notes to Edit"
            ),
            React.createElement(
                "h1",
                { className: "backMessage" },
                "BACK"
            )
        );
    }
    var noteNodes1 = props.notes.map(function (note) {

        var d = new Date(note.dueDate);
        if (note.noteFinished) {
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
                    d.toDateString()
                ),
                React.createElement(
                    "h3",
                    { className: "noteDueTime" },
                    "Due Time: ",
                    note.dueTime
                ),
                React.createElement(
                    "h3",
                    { className: "noteFinished" },
                    "Finished?:"
                ),
                React.createElement("input", { className: "noteFinished", type: "checkbox", name: "finished", checked: true })
            );
        } else {
            return;
        }
    });
    var noteNodes = props.notes.map(function (note) {

        var d = new Date(note.dueDate);
        if (!note.noteFinished) {
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
                    d.toDateString()
                ),
                React.createElement(
                    "h3",
                    { className: "noteDueTime" },
                    "Due Time: ",
                    note.dueTime
                ),
                React.createElement(
                    "h3",
                    { className: "noteFinished" },
                    "Finished?:"
                ),
                React.createElement("input", { className: "noteFinished", type: "checkbox", name: "finished" })
            );
        } else {
            return;
        }
    });

    return React.createElement(
        "div",
        { className: "noteEditList" },
        React.createElement(
            "h1",
            null,
            "Incomplete Tasks"
        ),
        noteNodes,
        React.createElement(
            "h1",
            null,
            "Completed Tasks"
        ),
        noteNodes1
    );
};

var NoteDiffLowHighList = function NoteDiffLowHighList(props) {
    if (props.notes.length === 0) {
        return React.createElement(
            "div",
            null,
            React.createElement(
                "h1",
                { id: "editMessage" },
                "Select Note to Edit or Delete"
            ),
            React.createElement(
                "h3",
                { className: "emptyNote" },
                "No Notes to Edit"
            ),
            React.createElement(
                "h1",
                { className: "backMessage" },
                "BACK"
            )
        );
    }
    props.notes.sort(function (a, b) {
        return a.diffLevel - b.diffLevel;
    });
    console.log(props.notes);
    //props.notes.sort(function (a, b) {a.diffLevel > b.diffLevel});
    var noteNodes = props.notes.map(function (note) {

        var d = new Date(note.dueDate);
        if (note.noteFinished == true) {
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
                    d.toDateString()
                ),
                React.createElement(
                    "h3",
                    { className: "noteDueTime" },
                    "Due Time: ",
                    note.dueTime
                ),
                React.createElement(
                    "h3",
                    { className: "noteFinished" },
                    "Finished?:"
                ),
                React.createElement("input", { className: "noteFinished", type: "checkbox", name: "finished", checked: true })
            );
        }
        if (note.noteFinished == false) {
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
                    d.toDateString()
                ),
                React.createElement(
                    "h3",
                    { className: "noteDueTime" },
                    "Due Time: ",
                    note.dueTime
                ),
                React.createElement(
                    "h3",
                    { className: "noteFinished" },
                    "Finished?:"
                ),
                React.createElement("input", { className: "noteFinished", type: "checkbox", name: "finished" })
            );
        }
    });

    return React.createElement(
        "div",
        { className: "noteEditList" },
        React.createElement(
            "h1",
            null,
            "Least to Most Difficult"
        ),
        noteNodes
    );
};

var NoteDiffHighLowList = function NoteDiffHighLowList(props) {
    if (props.notes.length === 0) {
        return React.createElement(
            "div",
            null,
            React.createElement(
                "h1",
                { id: "editMessage" },
                "Select Note to Edit or Delete"
            ),
            React.createElement(
                "h3",
                { className: "emptyNote" },
                "No Notes to Edit"
            ),
            React.createElement(
                "h1",
                { className: "backMessage" },
                "BACK"
            )
        );
    }
    props.notes.sort(function (a, b) {
        return b.diffLevel - a.diffLevel;
    });
    console.log(props.notes);
    //props.notes.sort(function (a, b) {a.diffLevel > b.diffLevel});
    var noteNodes = props.notes.map(function (note) {

        var d = new Date(note.dueDate);
        if (note.noteFinished == true) {
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
                    d.toDateString()
                ),
                React.createElement(
                    "h3",
                    { className: "noteDueTime" },
                    "Due Time: ",
                    note.dueTime
                ),
                React.createElement(
                    "h3",
                    { className: "noteFinished" },
                    "Finished?:"
                ),
                React.createElement("input", { className: "noteFinished", type: "checkbox", name: "finished", checked: true })
            );
        }
        if (note.noteFinished == false) {
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
                    d.toDateString()
                ),
                React.createElement(
                    "h3",
                    { className: "noteDueTime" },
                    "Due Time: ",
                    note.dueTime
                ),
                React.createElement(
                    "h3",
                    { className: "noteFinished" },
                    "Finished?:"
                ),
                React.createElement("input", { className: "noteFinished", type: "checkbox", name: "finished" })
            );
        }
    });

    return React.createElement(
        "div",
        { className: "noteEditList" },
        React.createElement(
            "h1",
            null,
            "Most to Least Difficult"
        ),
        noteNodes
    );
};

//sorts List by tasks due soonest.
var NoteDueSoonList = function NoteDueSoonList(props) {
    if (props.notes.length === 0) {
        return React.createElement(
            "div",
            null,
            React.createElement(
                "h1",
                { id: "editMessage" },
                "Select Note to Edit or Delete"
            ),
            React.createElement(
                "h3",
                { className: "emptyNote" },
                "No Notes to Edit"
            ),
            React.createElement(
                "h1",
                { className: "backMessage" },
                "BACK"
            )
        );
    }
    //Adding the hour to the stored date
    /*
    Some Code borrowed from https://stackoverflow.com/questions/37466777/converting-time-string-into-date-object
    it's used to parse the hour and place it into the date
    */
    for (var i = 0; i < props.notes.length; i++) {
        props.notes[i].dueDate = new Date(props.notes[i].dueDate);
        props.notes[i].dueDate.setHours(props.notes[i].dueTime.substr(0, props.notes[i].dueTime.indexOf(":")));
        props.notes[i].dueDate.setMinutes(props.notes[i].dueTime.substr(props.notes[i].dueTime.indexOf(":") + 1));
    }
    props.notes.sort(function (a, b) {
        return +new Date(a.dueDate) - +new Date(b.dueDate);
    });
    //props.notes.sort(function (a, b) {a.diffLevel > b.diffLevel});
    var noteNodes = props.notes.map(function (note) {

        var d = new Date(note.dueDate);
        if (note.noteFinished == true) {
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
                    d.toDateString()
                ),
                React.createElement(
                    "h3",
                    { className: "noteDueTime" },
                    "Due Time: ",
                    note.dueTime
                ),
                React.createElement(
                    "h3",
                    { className: "noteFinished" },
                    "Finished?:"
                ),
                React.createElement("input", { className: "noteFinished", type: "checkbox", name: "finished", checked: true })
            );
        }
        if (note.noteFinished == false) {
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
                    d.toDateString()
                ),
                React.createElement(
                    "h3",
                    { className: "noteDueTime" },
                    "Due Time: ",
                    note.dueTime
                ),
                React.createElement(
                    "h3",
                    { className: "noteFinished" },
                    "Finished?:"
                ),
                React.createElement("input", { className: "noteFinished", type: "checkbox", name: "finished" })
            );
        }
    });

    return React.createElement(
        "div",
        { className: "noteEditList" },
        React.createElement(
            "h1",
            null,
            "Due Soonest"
        ),
        noteNodes
    );
};
"use strict";

var handleError = function handleError(message) {
    $("#errorMessage").text(message);
    $("#noteMessage").animate({ width: 'toggle' }, 350);
};
var redirect = function redirect(response) {
    $("#noteMessage").animate({ width: 'hide' }, 350);
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
