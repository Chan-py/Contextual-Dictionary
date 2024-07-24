    /*global chrome*/

require('dotenv').config();

const apiKey = process.env.OPENAI_API_KEY;

chrome.commands.onCommand.addListener(function(command) {
    console.log("hi");
    if (command === "translate_word") {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {action: "translate_word"});
        });
    }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.word && request.text) {
        fetchMeaningFromGPT(request.word, request.text).then(response => {
            chrome.storage.local.set({meaning: response});
        });
    }
});

async function fetchMeaningFromGPT(word, context) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: `I will provide the paragraph and the word in it from now on. What you have to do 
                                            is answer only the korean meaning of the word considering the context of it. Do not 
                                            add any other words. Only print out the meaning. If additional description is needed 
                                            you can add in parentheses. Be sure to keep the answer short. It's purpose to be like 
                                            dictionary.` },
                { role: 'user', content: `word : ${word}, context : ${context}` }
            ],
            max_tokens: 60
        })
    });

    const data = await response.json();
    console.log(data);
    return data.choices[0].message.content.trim();
}
  