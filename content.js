function fetchEmailContent() {
  // Gmail selectors: update these if Gmail's DOM changes.
  const emailBody = document.querySelector(".a3s.aiL");
  const emailSubject = document.querySelector(".hP");

  if (emailBody && emailSubject) {
    const content = {
      subject: emailSubject.textContent,
      body: emailBody.innerText
    };
    console.log("Fetched email content:", content);
    return content;
  } else {
    console.error("Email content not found.");
    return null;
  }
}

// Listen for a message from the popup requesting email data
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "fetchEmailData") {
    const content = fetchEmailContent();
    if (content) {
      sendResponse({ emailData: content });
    } else {
      sendResponse({}); // Return empty response if no data is found
    }
  }
  return true;
});
