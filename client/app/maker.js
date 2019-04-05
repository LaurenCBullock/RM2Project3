const handleNote = (e) => {
    e.preventDefault();
    
    $("#noteMessage").animate({width: 'hide'},350);
    if($("#noteName").val() == '' || $("noteAge").val() == '' || $("noteLevel").val() == ''){
        handleError("RAWR! All fields are required");
        return false;
    }
    
    sendAjax('POST', $("#noteForm").attr("action"), $("#noteForm").serialize(), function(){
        loadNotesFromServer();
    });
    return false;
};

const NoteForm = (props) =>{
    return(
        <form id="noteForm"
            onSubmit={handleNote}
            name="noteForm"
            action="/maker"
            method="POST"
            className="noteForm"
        >
        <label htmlFor="title">Title: </label>
        <input id="noteTitle" type="text" name="title" placeholder="Note Title"/>
        <label htmlFor="desc">Description: </label>
        <textarea id="noteDesc" type="text" name="desc" placeholder="Note Description"/>
        <label htmlFor="diffLevel">Difficulty Level: </label>
        <input id="noteDiffLevel" type="number"  min="0" max="5" name="diffLevel" placeholder="Task difficulty"/>
        <label htmlFor="dueDate">Due date: </label>
        <input id="noteDueDate" type="date" name="dueDate" placeholder="Note Description"/>
        
        <input type="hidden" name="_csrf" value={props.csrf}/>
        <input className="makeNoteSubmit" type="submit" value="Make Note"/>
        </form>
        
    );
};




const NoteList = function(props){
    if(props.notes.length === 0){
        return(
        <div className="noteList">
            <h3 className="emptyNote">No Notes yet</h3>    
        </div>
        );
    }
    const noteNodes = props.notes.map(function(note){
        return(
            <div key={note._id} id={note._id} className="note">
                <h3 className="noteEdit">Edit</h3>
                <h3 className="noteTitle">Title: {note.title}</h3>
            
                <h3 className="noteDesc">Description: {note.desc}</h3>
                <h3 className="noteDiffLevel">Difficulty: {note.diffLevel}</h3>
                <h3 className="noteDueDate">Due Date: {note.dueDate}</h3>
                
            </div> 
        );
    });
    
    return(
        <div className="noteList">
            {noteNodes}
        </div>
    );
};
const loadNotesFromServer = () =>{
    sendAjax('GET', '/getNotes', null, (data) =>{
       ReactDOM.render(
        <NoteList notes={data.notes}/>, document.querySelector("#notes")
       );
    });
};



const setup = function(csrf) {
    ReactDOM.render(
        <NoteForm csrf={csrf}/>, document.querySelector("#makeNote")
    );
    ReactDOM.render(
        <NoteList notes={[]}/>, document.querySelector("#notes")
    );
    
    //Event bubbling to make edit links trigger Note Edit mode
    //For now it just deletes the note
    document.addEventListener('click', function (event) {
    if ( event.target.classList.contains( 'noteEdit' ) ) {
        event.preventDefault();
        //let noteId = event.target.parentElement.id;
        getEditToken();
        
    }
}, false);
    
    
    loadNotesFromServer();
};
const getToken = () =>{
    sendAjax('GET', '/getToken', null, (result) =>{
        setup(result.csrfToken);
    });
};

$(document).ready(function(){
    getToken();
});






const handleEditNote = (e) => {
    e.preventDefault();
    
    $("#noteMessage").animate({width: 'hide'},350);
    
    sendAjax('POST', $("#noteEditForm").attr("action"), $("#noteEditForm").serialize(), function(){
        loadEditNotesFromServer();
    });
    return false;
};


const NoteEditForm = (props) =>{
    //console.dir(props);
    return(
        <form id="noteEditForm"
            onSubmit={handleEditNote}
            name="noteEditForm"
            action="/deleteNotes"
            method="POST"
            className="noteEditForm"
        >
        
        <input type="hidden" name="_csrf" value={props.csrf}/>
        </form>
        
    );
};

let currentId;

const NoteDeleteForm = (props) =>{
    console.dir("Note Delete Form");
    return(
        <form id="noteDeleteForm"
            
            name="noteDeleteForm"
            action="/deleteNotes"
            method="POST"
            className="noteDeleteForm"
        >
        <input type="hidden" name="_id" value={currentId}/>
        <input type="hidden" name="_csrf" value={props.csrf}/>
        </form>
        
    );
    
};

const FormHandle = (e) =>{
    
}

const handleDeleteNote = (e) => {
    //e.preventDefault();
    
    $("#noteMessage").animate({width: 'hide'},350);
    console.log("handle");
    sendAjax('POST', $("#noteDeleteForm").attr("action"), $("#noteDeleteForm").serialize(), function(){
        
        loadEditNotesFromServer();
    });
    return false;
};

//displays all notes a user owns and adds inputs, delete and update buttons
const NoteEditList = function(props){
    if(props.notes.length === 0){
        return(
        <div className="noteEditList">
            <h3 className="emptyNote">No Notes to Edit</h3>    
        </div>
        );
    }
    const noteNodes = props.notes.map(function(note){
        return(
            <div key={note._id} id={note._id} className="note">
                
        <label htmlFor="title">Title: </label>
        <input id="noteTitle" type="text" name="title" placeholder="Note Title"/>
        <label htmlFor="desc">Description: </label>
        <textarea id="noteDesc" type="text" name="desc" placeholder="Note Description"/>
        <label htmlFor="diffLevel">Difficulty Level: </label>
        <input id="noteDiffLevel" type="number"  min="0" max="5" name="diffLevel" placeholder="Task difficulty"/>
        <label htmlFor="dueDate">Due date: </label>
        <input id="noteDueDate" type="date" name="dueDate" placeholder="Note Description"/>
            <h3 className="noteDelete" id="noteDelete">Delete</h3>
            <h3 className="noteUpdate" id="noteUpdate">Update</h3>
            </div> 
        );
    });
    
    return(
        <div>
        <h1 id="editMessage">Select Note to Edit or Delete</h1>
        <div className="noteEditList">
        
            {noteNodes}
        </div>
        </div>
    );
};
//loads the edit screen
const loadEditNotesFromServer = () =>{
    sendAjax('GET', '/getNotes', null, (data) =>{
       ReactDOM.render(
        <NoteEditList notes={data.notes}/>, document.querySelector("#notes")
       );
    });
};

//sets up edit screen with CSRF tokens and event listeners
const setupEdit = function(csrf) {
    //console.log("test");
    ReactDOM.render(
        <NoteEditList notes={[]}/>, document.querySelector("#notes")
    );
     ReactDOM.render(
        <NoteEditForm csrf={csrf}/>, document.querySelector("#makeNote")
    );
    
    //Event bubbling to make edit links trigger Note Edit mode
    //For now it just deletes the note
    document.addEventListener('click', function (event) {
    if ( event.target.classList.contains( 'noteDelete' ) ) {
        currentId = event.target.parentElement.id;
        ReactDOM.render(
        <NoteDeleteForm csrf={csrf}/>, document.querySelector("#makeNote")
    );
    handleDeleteNote();    
    }
}, false);
    
    document.addEventListener('click', function (event) {
    if ( event.target.classList.contains( 'noteUpdate' ) ) {
        console.log("clicked");
        
    }
}, false);
    
    
    loadEditNotesFromServer();
};

//added to test CSRF on new page
const getEditToken = () =>{
    console.log("csrf token");
    sendAjax('GET', '/getToken', null, (result) =>{
        setupEdit(result.csrfToken);
    });
};













