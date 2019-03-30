const handleDomo = (e) => {
    e.preventDefault();
    
    $("#domoMessage").animate({width: 'hide'},350);
    if($("#domoName").val() == '' || $("domoAge").val() == '' || $("domoLevel").val() == ''){
        handleError("RAWR! All fields are required");
        return false;
    }
    
    sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function(){
        loadDomosFromServer();
    });
    return false;
};

const DomoForm = (props) =>{
    return(
        <form id="domoForm"
            onSubmit={handleDomo}
            name="domoForm"
            action="/maker"
            method="POST"
            className="domoForm"
        >
        <label htmlFor="name">Name: </label>
        <input id="domoName" type="text" name="name" placeholder="Domo Name"/>
        <label htmlFor="age">Age: </label>
        <input id="domoAge" type="text" name="age" placeholder="Domo Age"/>
        <label htmlFor="level">Level: </label>
        <input id="domoLevel" type="text" name="level" placeholder="Domo Level"/>
        <input type="hidden" name="_csrf" value={props.csrf}/>
        <input className="makeDomoSubmit" type="submit" value="Make Domo"/>
        </form>
        
    );
};




const DomoList = function(props){
    if(props.domos.length === 0){
        return(
        <div className="domoList">
            <h3 className="emptyDomo">No Domos yet</h3>    
        </div>
        );
    }
    const domoNodes = props.domos.map(function(domo){
        return(
            <div key={domo._id} id={domo._id} className="domo">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace"/>
                <h3 className="domoName">Name: {domo.name}</h3>
                <h3 className="domoAge">Age: {domo.age}</h3>
                <h3 className="domoLevel">Level: {domo.level}</h3>
                <h3 className="domoEdit">Edit</h3>
            </div> 
        );
    });
    
    return(
        <div className="domoList">
            {domoNodes}
        </div>
    );
};
const loadDomosFromServer = () =>{
    sendAjax('GET', '/getDomos', null, (data) =>{
       ReactDOM.render(
        <DomoList domos={data.domos}/>, document.querySelector("#domos")
       );
    });
};



const setup = function(csrf) {
    ReactDOM.render(
        <DomoForm csrf={csrf}/>, document.querySelector("#makeDomo")
    );
    ReactDOM.render(
        <DomoList domos={[]}/>, document.querySelector("#domos")
    );
    
    //Event bubbling to make edit links trigger Domo Edit mode
    //For now it just deletes the domo
    document.addEventListener('click', function (event) {
    if ( event.target.classList.contains( 'domoEdit' ) ) {
        event.preventDefault();
        let domoId = event.target.parentElement.id;
        getEditToken();
        
    }
}, false);
    
    
    loadDomosFromServer();
};
const getToken = () =>{
    sendAjax('GET', '/getToken', null, (result) =>{
        setup(result.csrfToken);
    });
};

$(document).ready(function(){
    getToken();
});






const handleEditDomo = (e) => {
    e.preventDefault();
    
    $("#domoMessage").animate({width: 'hide'},350);
    
    sendAjax('POST', $("#domoEditForm").attr("action"), $("#domoEditForm").serialize(), function(){
        loadEditDomosFromServer();
    });
    return false;
};


const DomoEditForm = (props) =>{
    //console.dir(props);
    return(
        <form id="domoEditForm"
            onSubmit={handleEditDomo}
            name="domoEditForm"
            action="/deleteDomos"
            method="POST"
            className="domoEditForm"
        >
        <input type="hidden" name="_csrf" value={props.csrf}/>
        </form>
        
    );
};

const DomoDeleteForm = (props) =>{
    console.dir(props);
    return(
        <form id="domoDeleteForm"
            onSubmit={handleDeleteDomo}
            name="domoDeleteForm"
            action="/deleteDomos"
            method="POST"
            className="domoDeleteForm"
        >
        <input type="hidden" name="_csrf" value={props.csrf}/>
        </form>
        
    );
};

const handleDeleteDomo = (e) => {
    e.preventDefault();
    
    $("#domoMessage").animate({width: 'hide'},350);
    
    sendAjax('POST', $("#domoDeleteForm").attr("action"), $("#domoDeleteForm").serialize(), function(){
        loadEditDomosFromServer();
    });
    return false;
};

//displays all domos a user owns and adds inputs, delete and update buttons
const DomoEditList = function(props){
    if(props.domos.length === 0){
        return(
        <div className="domoEditList">
            <h3 className="emptyDomo">No Domos to Edit</h3>    
        </div>
        );
    }
    const domoNodes = props.domos.map(function(domo){
        return(
            <div key={domo._id} id={domo._id} className="domo">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace"/>
                <h3 className="domoName">Name: <input id="domoName" type="text" name="name" placeholder={domo.name}/></h3>
                <h3 className="domoAge">Age: <input id="domoAge" type="text" name="age" placeholder={domo.age}/></h3>
                <h3 className="domoLevel">Level: <input id="domoLevel" type="text" name="level" placeholder={domo.level}/></h3>
                <h3 className="domoDelete" id="domoDelete">DELETE </h3>
                <h3 className="domoUpdate"id="domoUpdate"> UPDATE</h3>
            </div> 
        );
    });
    
    return(
        <div>
        <h1 id="editMessage">Select Domo to Edit or Delete</h1>
        <div className="domoEditList">
        
            {domoNodes}
        </div>
        </div>
    );
};
//loads the edit screen
const loadEditDomosFromServer = () =>{
    sendAjax('GET', '/getDomos', null, (data) =>{
       ReactDOM.render(
        <DomoEditList domos={data.domos}/>, document.querySelector("#domos")
       );
    });
};

//sets up edit screen with CSRF tokens and event listeners
const setupEdit = function(csrf) {
    //console.log("test");
    ReactDOM.render(
        <DomoEditList domos={[]}/>, document.querySelector("#domos")
    );
     ReactDOM.render(
        <DomoEditForm csrf={csrf}/>, document.querySelector("#makeDomo")
    );
    
    //Event bubbling to make edit links trigger Domo Edit mode
    //For now it just deletes the domo
    document.addEventListener('click', function (event) {
    if ( event.target.classList.contains( 'domoDelete' ) ) {
    //console.log("sending delete");
        ReactDOM.render(
        <DomoDeleteForm csrf={csrf}/>, document.querySelector("#makeDomo")
    );
    }
}, false);
    
    document.addEventListener('click', function (event) {
    if ( event.target.classList.contains( 'domoUpdate' ) ) {
        console.log("clicked");
        
    }
}, false);
    
    
    loadEditDomosFromServer();
};

//added to test CSRF on new page
const getEditToken = () =>{
    console.log("csrf token");
    sendAjax('GET', '/getToken', null, (result) =>{
        setupEdit(result.csrfToken);
    });
};













