// Insert the CLIENT_ID and SCOPES here as mentioned previously
const CLIENT_ID = '802776115433-kaf3ueea1285n91otj726986dvppqfdq.apps.googleusercontent.com';
const SCOPES = 'https://www.googleapis.com/auth/indexing https://www.googleapis.com/auth/webmasters.readonly';

// Function to start the authentication process
function authenticateUser() {
  var oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
  var params = {
    'client_id': CLIENT_ID,
    'redirect_uri': 'YOUR_REDIRECT_URI',
    'response_type': 'token',
    'scope': SCOPES,
    'include_granted_scopes': 'true',
    'state': 'pass-through value'
  };

  var queryString = Object.keys(params).map(key => {
    return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
  }).join('&');
  
  window.open(oauth2Endpoint + '?' + queryString, 'name', 'width=600,height=400');
}

// Function to extract the access token from the URL fragment
function handleOAuth2Redirect() {
  var hash = window.location.hash.substring(1);
  var params = new URLSearchParams(hash);
  var accessToken = params.get('access_token');
  var state = params.get('state');
  
  if (accessToken && state === 'pass-through value') {
    sessionStorage.setItem('oauth2_access_token', accessToken);
    if (window.opener) {
      window.close();
    }
    listUrls();
  }
}

// Simulated database with dummy data
let urlsDatabase = {
  urls: [
    { url: 'https://www.brainscape.com/subjects/medical-nursing', indexingOutput: null, inspectionOutput: null },
    { url: 'https://www.brainscape.com/subjects/foreign-languages', indexingOutput: null, inspectionOutput: "{\"verdict\":\"PASS\"}" },
    // ... add the rest of your dummy data here
  ]
};

// List URLs not having a "PASS" verdict
function listUrls() {
  let urlListDiv = document.getElementById('urlList');
  urlListDiv.innerHTML = '';
  urlsDatabase.urls.forEach(function(urlData) {
    if (!urlData.inspectionOutput || !urlData.inspectionOutput.includes('"verdict":"PASS"')) {
      let urlDiv = document.createElement('div');
      let checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.value = urlData.url;
      urlDiv.appendChild(checkbox);
      urlDiv.appendChild(document.createTextNode(urlData.url));
      urlListDiv.appendChild(urlDiv);
    }
  });
}

// Process selected URLs
function processUrls() {
  console.log('Processing URLs...');
  urlsDatabase.urls.forEach(function(urlData, index) {
    if (document.querySelector(`input[value="${urlData.url}"]`).checked) {
      urlsDatabase.urls[index].indexingOutput = '{"status":"Indexing completed"}';
      urlsDatabase.urls[index].inspectionOutput = '{"status":"Inspection completed"}';
    }
  });
  listUrls();
}

// Add event listeners for authentication and processing
document.getElementById('authenticate').addEventListener('click', authenticateUser);
document.getElementById('process-urls').addEventListener('click', processUrls);

// On load, check if redirected with an access token
handleOAuth2Redirect();
