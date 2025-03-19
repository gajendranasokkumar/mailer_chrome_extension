chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  if (tabs && tabs.length > 0) {
    const tabId = tabs[0].id;

    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ["content.js"]
    }, () => {

      if (chrome.runtime.lastError) {
        console.error("Script injection error:", chrome.runtime.lastError.message);
        document.getElementById("fetch-status").innerText = "Failed to inject content script.";
        return;
      }

      chrome.tabs.sendMessage(tabId, { action: "fetchEmailData" }, (response) => {
        if (chrome.runtime.lastError) {
          console.error("Error:", chrome.runtime.lastError.message);
          document.getElementById("fetch-status").innerText = "Failed to fetch email data.";
        } else if (response && response.emailData) {
          document.getElementById("email-subject").innerHTML = `<h2>${response.emailData.subject}</h2>`;
          document.getElementById("email-body").innerHTML = `<p>${response.emailData.body}</p>`;
          document.getElementById("fetch-status").innerText = "Data fetched successfully.";
        } else {
          document.getElementById("fetch-status").innerText = "No email data found.";
        }
      });
    });
  } else {
    console.error("No active tab found.");
    document.getElementById("fetch-status").innerText = "Failed to fetch email data.";
  }
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.emailData) {
    document.getElementById("email-subject").innerHTML = `<h2>${message.emailData.subject}</h2>`;
    document.getElementById("email-body").innerHTML = `<p>${message.emailData.body}</p>`;
  }
});

document.getElementById("send-query").addEventListener("click", () => {
  const userQuery = document.getElementById("user-query").value;
  const emailBody = document.getElementById("email-body").innerText;

  if (userQuery && emailBody) {
    document.getElementById("loading-icon").style.display = "block";
    fetch('https://augusemail.onrender.com/process_email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email_content: emailBody, user_query: userQuery })
    })
    .then(response => response.json())
    .then(data => {
      document.getElementById("loading-icon").style.display = "none";
      document.getElementById("response-container").innerText = data.response;
      document.getElementById("response-container").style.display = "block";
      document.getElementById("copy-response").style.display = "block";
    })
    .catch(error => {
      document.getElementById("loading-icon").style.display = "none";
      console.error('Error:', error);
      document.getElementById("response-container").innerText = "Failed to fetch response.";
      document.getElementById("response-container").style.display = "block";
    });
  } else {
    document.getElementById("response-container").innerText = "Please enter a query and ensure email data is fetched.";
    document.getElementById("response-container").style.display = "block";
  }
});

document.getElementById("copy-response").addEventListener("click", () => {
  const responseText = document.getElementById("response-container").innerText;
  navigator.clipboard.writeText(responseText).then(() => {
    document.getElementById("copy-success").style.display = "block";
    setTimeout(() => {
      document.getElementById("copy-success").style.display = "none";
    }, 2000);
  }).catch(err => {
    console.error('Error:', err);
  });
});