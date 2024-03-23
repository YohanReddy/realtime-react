import React, { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

const SummarySection = ({ messages }) => {
  const [summary, setSummary] = useState('');

  const generateSummary = async () => {
    const allMessages = messages.map(message => `${message.username}: "${message.message}"`).join('\n');
    const prompt = `Here is the list of messages in format Name: "message". Summarize this chat between these two and return a summary. Don't reply anything else, just give me the summary with no additional dialogues.:\n${allMessages}`;
    const genAI = new GoogleGenerativeAI("AIzaSyC_ZVQqDffuMFU3xJtBhB3k0ZrMCyoYwAA"); // Replace with your actual API key
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    try {
      const result = await model.generateContentStream(prompt);
      let summaryText = '';

      for await (const chunk of result.stream) {
        summaryText += chunk.text();
      }

      setSummary(summaryText);
    } catch (error) {
      console.error('Error generating summary:', error);
      setSummary('Error generating summary. Please try again later.');
    }
  };

  return (
    <div className="summary">
      {summary && <div>{summary}</div>}
      <div style={{ marginTop: '20px' }}>
        <button id="summaryButton" onClick={generateSummary}>Generate Summary</button>
      </div>
    </div>
  );
};

export default SummarySection;
