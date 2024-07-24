    /*global chrome*/
import React, { useState, useEffect } from 'react';

const Popup = () => {
  const [meaning, setMeaning] = useState('');

  useEffect(() => {
    chrome.storage.local.get(['meaning'], (result) => {
      if (result.meaning) {
        setMeaning(result.meaning);
      }
    });
  }, []);

  return (
    <div>
      <h1>Word Meaning</h1>
      <div>{meaning ? meaning : 'Select a word and press Ctrl+Shift+Y'}</div>
    </div>
  );
};

export default Popup;