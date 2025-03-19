document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle');
  
  const savedTheme = localStorage.getItem('theme');
  
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggle.checked = true;
  } else if (savedTheme === 'light') {
    document.body.classList.remove('dark-mode');
    themeToggle.checked = false;
  } else {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.body.classList.add('dark-mode');
      themeToggle.checked = true;
    }
  }
  
  themeToggle.addEventListener('change', () => {
    if (themeToggle.checked) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  });
});

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  if (tabs && tabs.length > 0) {
    const tabId = tabs[0].id;

    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ["content.js"]
    }, () => {
      if (chrome.runtime.lastError) {
        console.error("Script injection error:", chrome.runtime.lastError.message);
        updateStatus("Failed to inject content script.", true);
        return;
      }

      chrome.tabs.sendMessage(tabId, { action: "fetchEmailData" }, (response) => {
        if (chrome.runtime.lastError) {
          console.error("Error:", chrome.runtime.lastError.message);
          updateStatus("Failed to fetch email data.", true);
        } else if (response && response.emailData) {
          document.getElementById("email-subject").innerHTML = response.emailData.subject ? 
            `<h2>${sanitizeHTML(response.emailData.subject)}</h2>` : '<h2>No subject</h2>';
          document.getElementById("email-body").innerHTML = response.emailData.body ? 
            `<p>${sanitizeHTML(response.emailData.body)}</p>` : '<p>No body content</p>';
          updateStatus("Email data loaded successfully");
        } else {
          updateStatus("No email data found. Make sure you're on a Gmail page.", true);
        }
      });
    });
  } else {
    console.error("No active tab found.");
    updateStatus("Failed to fetch email data.", true);
  }
});

function sanitizeHTML(text) {
  const element = document.createElement('div');
  element.textContent = text;
  return element.innerHTML;
}

function updateStatus(message, isError = false) {
  const statusEl = document.getElementById("fetch-status");
  statusEl.innerText = message;
  if (isError) {
    statusEl.style.color = 'var(--error-color)';
  } else {
    statusEl.style.color = '';
  }
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.emailData) {
    document.getElementById("email-subject").innerHTML = message.emailData.subject ? 
      `<h2>${sanitizeHTML(message.emailData.subject)}</h2>` : '<h2>No subject</h2>';
    document.getElementById("email-body").innerHTML = message.emailData.body ? 
      `<p>${sanitizeHTML(message.emailData.body)}</p>` : '<p>No body content</p>';
    updateStatus("Email data loaded successfully");
  }
});

document.getElementById("send-query").addEventListener("click", () => {
  const userQuery = document.getElementById("user-query").value.trim();
  const emailBody = document.getElementById("email-body").innerText;
  const emailSubject = document.getElementById("email-subject").innerText;
  const errorMsg = document.getElementById("error-message");
  
  errorMsg.style.display = "none";
  
  if (!userQuery) {
    errorMsg.innerText = "Please enter a query about this email.";
    errorMsg.style.display = "block";
    return;
  }
  
  if (!emailBody && !emailSubject) {
    errorMsg.innerText = "No email content found to analyze.";
    errorMsg.style.display = "block";
    return;
  }

  document.getElementById("loading-icon").style.display = "block";
  document.getElementById("response-container").style.display = "none";
  document.getElementById("copy-response").style.display = "none";
  document.getElementById("inject-response").style.display = "none";
  
  fetch('https://augusemail.onrender.com/process_email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ 
      email_content: emailBody + emailSubject, 
      user_query: userQuery 
    })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    document.getElementById("loading-icon").style.display = "none";
    document.getElementById("response-container").innerText = data.response;
    document.getElementById("response-container").style.display = "block";
    document.getElementById("copy-response").style.display = "block";
    document.getElementById("inject-response").style.display = "block";
  })
  .catch(error => {
    document.getElementById("loading-icon").style.display = "none";
    console.error('Error:', error);
    errorMsg.innerText = "Failed to process your request. Please try again later.";
    errorMsg.style.display = "block";
  });
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
    const errorMsg = document.getElementById("error-message");
    errorMsg.innerText = "Failed to copy to clipboard.";
    errorMsg.style.display = "block";
    setTimeout(() => {
      errorMsg.style.display = "none";
    }, 2000);
  });
});

document.getElementById("inject-response").addEventListener("click", () => {
  const responseText = document.getElementById("response-container").innerText;
  const subjectText = document.getElementById("email-subject").innerText;
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs && tabs.length > 0) {
      const tabId = tabs[0].id;
      chrome.tabs.sendMessage(tabId, { action: "injectResponse", response: responseText, subject: subjectText});
    }
  });
});