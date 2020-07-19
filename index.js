var results = document.querySelector(".results"); //select results div
var pagination = document.querySelector(".pagination"); //select pagination element
let hash = new Map(); //map for efficient url storage
var page = 0; //Number of pages
var cheers = false; //page switch
var currentPage = 0;

function deserialize() {
  //Get 'cheers' from local storage
  if (localStorage.cheers != null)
    cheers = new Boolean(JSON.parse(localStorage.cheers));

  //If submission has been made, switch to 'cheers.html'
  if (cheers == true) {
    cheersPage();
    return;
  }

  if (localStorage.hash != null) {
    //Parse hash and bool from local storage
    hash = new Map(JSON.parse(localStorage.hash));

    //Create html elements for entries from local storage
    for (const [key, value] of hash.entries()) {
      newURL(key, value);
    }
    pages(); //load pages
  }

  //If results are still empty, show testdata button
  if (results.childNodes.length == 0)
    document.getElementById("test").style.display = "block";
}

function submitURL() {
  //Get input value
  var inputURL = document.getElementById("add").value;

  //check url is valid
  if (checkURL(inputURL) == true) {
    hash.set(inputURL, hash.size); //Add to hashmap in memory
    pages(); //update pagination
    localStorage.setItem(0, inputURL); //Add submission to memory
    localStorage.cheers = true; //Set 'cheers' boolean to true in local memory
    localStorage.hash = JSON.stringify(Array.from(hash.entries())); //update local storage
    window.location = "./cheers.html"; //Switch to 'cheers.html'
  }
}

//Determine whether the URL is an existing webpage
function checkURL(input) {
  //Check that url doesnt already exist
  if (hash.has(input)) {
    alert("Error: " + input + " already exists in the database");
    return false;
  }

  //Regex experession to determine whether the input is in a valid url format
  regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
  if (!regexp.test(input)) {
    alert("Please enter a valid url i.e https://example.co.uk");
    return false;
  }

  return true; //tests have been passed

  //Without using node or a back-end service, there isn't an effective way to get around CORS
  //With CORS disabled this function checks whether the url is valid using GET and returns an error if not.
  //   var request = new XMLHttpRequest();
  //   request.open("GET", input, true);
  //   request.onreadystatechange = function() {
  //     if (request.readyState === 4) {
  //       if (request.status === 404) {
  //         alert("Error:" + input + "is not an existing URL");
  //       }
  //     }
  //   };
  //   request.send();
}

function loadPage(index) {
  currentPage = index; //Update the current page
  //Remove all elements from the results div
  while (results.firstChild) {
    results.removeChild(results.firstChild);
  }
  //Set upper and lower bounds of current page
  if (index == -1) index = 0;
  var lower = index * 20;
  var upper = lower + 20;
  let i = 0; //current index in the map

  //Add all elements in the current pages range
  for (const [key, value] of hash.entries()) {
    if (i == lower) newURL(key, value);
    if (i > lower && i < upper) {
      newURL(key, value);
    }
    i++;
  }
}

//-------HTML Manipulation-------

//Add a new url component
function newURL(key, value) {
  var li = document.createElement("LI");
  var h4 = document.createElement("H4");
  var bin = document.createElement("IMG");
  var edit = document.createElement("IMG");
  li.appendChild(h4);
  results.appendChild(li);
  li.appendChild(bin);
  li.appendChild(edit);
  bin.src = "./delete-24px.svg";
  edit.src = "./edit-24px.svg";
  h4.innerHTML = key;
  li.id = key;
  h4.setAttribute("onclick", "nav(" + "'" + key + "'" + ");");
  bin.setAttribute("onclick", "removeURL(" + "'" + key + "'" + ");");
  edit.setAttribute(
    "onclick",
    "editURL(" + "'" + key + "'" + "," + "'" + value + "'" + ");"
  );
}

//Func to navigate to selected weblink
function nav(url) {
  window.location = url;
}

function removeURL(url) {
  var target = document.getElementById(url);
  results.removeChild(target); //Remove URL form DOM
  //Update values as we use this for the index
  hash.delete(url); //delete url

  //Update local storage
  localStorage.hash = JSON.stringify(Array.from(hash.entries()));
  loadPage(currentPage); //Reload current page
}

function editURL(key, value) {
  var target = document.getElementById(key);
  var input = document.createElement("INPUT");
  var button = document.createElement("BUTTON");
  target.appendChild(input);
  target.appendChild(button);
  button.innerHTML = "Submit";
  input.placeholder = "Enter a new URL";
  button.setAttribute(
    "onclick",
    "saveURL(" + "'" + key + "'" + "," + "'" + value + "'" + ");"
  );
}
//Save changes to a url made using the edit field
function saveURL(key, value) {
  var target = document.getElementById(key);
  var val = target.childNodes[3].value;

  if (checkURL(val) == true) {
    target.firstChild.innerHTML = val;
    hash.delete(key);
    hash.set(val, value); //update key of given url
    localStorage.hash = JSON.stringify(Array.from(hash.entries()));
    //Remove input field and button
    target.removeChild(target.childNodes[3]);
    target.removeChild(target.childNodes[3]);
    target.remove;
  }
}

//Create pagination html
function pages() {
  page = Math.ceil(hash.size / 20); // calc no of pages

  //Remove all elements from the pagination div
  while (pagination.firstChild) {
    pagination.removeChild(pagination.firstChild);
  }
  //Loop through page and create a index for each one
  for (let i = 0; i < page; i++) {
    var newIndex = document.createElement("LI");
    newIndex.innerHTML = i + 1;
    newIndex.id = i + 1;
    newIndex.setAttribute("onclick", "loadPage(" + i + ");");
    pagination.appendChild(newIndex);
  }
  loadPage(page - 1); //load the current page
}

//-------Second Page---------

//Set h1 value to the submitted url
function cheersPage() {
  var h1 = document.querySelector(".cheers h1");
  var sub = localStorage.getItem(0);
  h1.innerHTML = "Your Submission: " + sub;
}

function goBack() {
  localStorage.cheers = false;
}

//Create test data with sample urls
function testData() {
  var url = "http://robinw.co.uk/phantom/";
  for (let i = 0; i < 43; i++) {
    hash.set(url + i.toString(), i);
  }
  localStorage.hash = JSON.stringify(Array.from(hash.entries()));
  pages();
  loadPage(0);
  document.getElementById("test").style.display = "none";
}

//Load url's stored in local memory
deserialize();
