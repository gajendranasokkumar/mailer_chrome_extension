function fetchEmailContent() {
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

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "fetchEmailData") {
    const content = fetchEmailContent();
    if (content) {
      sendResponse({ emailData: content });
    } else {
      sendResponse({}); 
    }
  } else if (request.action === "injectResponse") {
    const responseText = request.response;
    const subject = request.subject;

    const composeButton = document.querySelector(".T-I.T-I-KE.L3");
    if (composeButton) {
      composeButton.click();

      setTimeout(() => {
        const emailBody = document.querySelector(".Am.Al.editable.LW-avf.tS-tW");
        if (emailBody) {
          emailBody.innerText = responseText;
        }

        const emailSubject = document.querySelector("input[name='subjectbox']");
        if (emailSubject) {
          emailSubject.value = "Re: " + subject;
        }

        const emailRecipient = document.querySelector("textarea[name='to']");
        if (emailRecipient) {
          emailRecipient.value = "recipient@example.com";
        }
      }, 2000); 
    }
  }
  return true;
});