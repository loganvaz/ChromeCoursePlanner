window.onload = verify_registration_page();

//make sure we're on the registration page after clicking submit semester button
function verify_registration_page(){
    const page_title_div = document.getElementById("pgTitle");
    if(page_title_div == null){
        throw new Error("Clicked submit but failed to load into valid regsitration page!");
    }
    //verify that the page title div only has one child element which is of type h1
    assert_equals(page_title_div.childNodes.length, 1);
    assert_equals(page_title_div.childNodes.item(0).textContent.includes("Registration"), true);
    //TODO maybe verify that the URL is https://utdirect.utexas.edu/registration/registration.WBX instead? 

    console.log("I should now be in the registration page, having clicked the semester selector!");
    register();
}

function register(){
    //load class list
    const classes = ["13220", "13180"];
    for(var i = 0; i<classes.length; i++){
        add_class(classes[i]);
        console.log("Tried to add course "+classes[i]);
    }
}

function add_class(unique_num){
    assert_equals(unique_num.length, 5);
    //select add radio button
    // console.error(document.textContent);
    const add_radio = document.getElementById("ds_request_STADD");
    if(add_radio == null){
        console.error("add_radio is null!");
    }
    assert_not_equals(add_radio, null);
    add_radio.click();
    //enter unique num
    const add_unique_input = document.getElementById("s_unique_add");
    assert_not_equals(add_unique_input, null);
    // add_unique_input.defaultValue = unique_num;
    add_unique_input.value = unique_num;
    //press submit
    const submit_button = document.getElementsByName("s_submit");
    assert_equals(submit_button.length, 1);
    submit_button[0].click();
    //get response, see if add was successful or if there is waitlist
    // window.onload = read_add_response();
    window.onload = () => {
        var response = read_add_response();
        if(!response["succcess"] && response["waitlist"]){
            console.log("We can waitlist in class "+unique_num);
        }
        // return response["success"];
    }
}

function read_add_response(){
    //get response message
    const message = document.getElementById("n_message");
    assert_not_equals(message, null);
    const message_text = message.innerText;
    //TODO change to chrome.storage
    console.log(message_text);
    //check if error class exists, if it doesn't, we added class successfully
    const err = document.getElementsByClassName("error");
    if(err == null || err.length == 0){
        console.log("Added class!");
        return {"success": true};
    }
    //check if waitlist radio exists, if it does, we can add this class to waitlist if needed
    const waitlist = document.getElementById("s_waitlist_unique");
    console.log("Failed to add class!");
    return {"success": false, "waitlist": waitlist != null};
}

//checks if two variables are equal, throws error if they aren't
function assert_equals(a, b){
    //TODO actually print variable names or something useful
    //strict equality
    if(a !== b){
        throw new Error("Failed assertion "+ (a ? a :"null") +" and "+(b ? b : "null")+ "should be equal");
    }   
}

//checks if two variables are not equal, throws error if they aren't
function assert_not_equals(a, b){
    //TODO actually print variable names or something useful
    //strict equality
    if(a === b){
        throw new Error("Failed assertion "+(a ? a: "null")+" and "+(b ? b : "null")+" should not be equal");
    }
}