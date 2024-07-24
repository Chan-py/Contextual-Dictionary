    /*global chrome*/
let selectedText = '';

document.addEventListener('mouseup', function() {
    selectedText = window.getSelection().toString().trim();
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "translate_word" && selectedText) {
        let context = getContext(selectedText);
        console.log("message send");
        chrome.runtime.sendMessage({word: selectedText, text: context});
    }
});

function getContext(selectedText) {
    let range = window.getSelection().getRangeAt(0);
    let startNode = range.startContainer;
    let endNode = range.endContainer;
    
    let before = startNode.textContent.slice(0, range.startOffset);
    let after = endNode.textContent.slice(range.endOffset);
    
    return before + selectedText + after;
}
