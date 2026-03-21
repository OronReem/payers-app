const { GoogleGenerativeAI } = require('@google/generative-ai');

async function run() {
  const genAI = new GoogleGenerativeAI('AIzaSyCq1eA_trfxPnwYWU42LriFO-RqzhaQgdg');
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=AIzaSyCq1eA_trfxPnwYWU42LriFO-RqzhaQgdg`);
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(err);
  }
}

run();
