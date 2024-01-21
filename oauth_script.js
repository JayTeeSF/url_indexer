// Parse the URL fragment to extract the access token if it's there
function parseFragment() {
    const fragmentString = window.location.hash.substring(1);
    const params = {};
    const regex = /([^&=]+)=([^&]*)/g;
    let m;
    while ((m = regex.exec(fragmentString))) {
        params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }
    return params;
}

// Display the token or an error message
function displayToken() {
    const params = parseFragment();
    const outputDiv = document.getElementById('output');
    if (params['access_token']) {
        outputDiv.innerHTML = 'Access Token Retrieved: ' + params['access_token'];
        // Here you would typically also store the token or proceed with API requests
    } else {
        outputDiv.innerHTML = 'No access token in URL fragment. Redirecting to login...';
        // Redirect to login or show login button
    }
}

// Handle redirect from OAuth server
window.onload = function() {
    displayToken();
    const params = parseFragment();
    if (params['access_token']) {
        localStorage.setItem('access_token', params['access_token']);
        // Redirect back to your main page or close the popup if it's one
        window.location.href = 'https://jayteesf.github.io/url_indexer/';
    }
};

