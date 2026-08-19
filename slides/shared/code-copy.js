// Code Copy Button Script
document.addEventListener("DOMContentLoaded", function () {
  const preElements = document.querySelectorAll("pre");

  preElements.forEach((pre) => {
    // Reveal.js might apply custom styling, so we ensure position relative
    // is applied via our CSS, but we also ensure the button is injected properly.
    const codeElement = pre.querySelector("code");
    if (!codeElement) return;

    // Create the button
    const btn = document.createElement("button");
    btn.className = "copy-code-btn";
    btn.innerText = "Copy";
    btn.setAttribute("aria-label", "Copy code to clipboard");

    // Add click event listener
    btn.addEventListener("click", function () {
      const codeText = codeElement.innerText;

      // Modern Clipboard API
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(codeText).then(() => showCopied(btn)).catch((err) => fallbackCopyTextToClipboard(codeText, btn));
      } else {
        fallbackCopyTextToClipboard(codeText, btn);
      }
    });

    pre.appendChild(btn);
  });

  function showCopied(button) {
    button.innerText = "Copied!";
    button.classList.add("copied");

    setTimeout(() => {
      button.innerText = "Copy";
      button.classList.remove("copied");
    }, 2000);
  }

  function fallbackCopyTextToClipboard(text, button) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    
    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand("copy");
      if (successful) {
        showCopied(button);
      } else {
        console.error("Fallback: Copying text command was unsuccessful");
      }
    } catch (err) {
      console.error("Fallback: Oops, unable to copy", err);
    }

    document.body.removeChild(textArea);
  }
});
