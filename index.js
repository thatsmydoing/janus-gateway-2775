const path = require('path');
const puppeteer = require('puppeteer');

function sleep(n) {
  return new Promise((resolve) => {
    setTimeout(resolve, n);
  });
}

async function main() {
  const browser = await puppeteer.launch({
    executablePath: process.env.CHROME_BIN ?? undefined,
    args: [
      '--use-fake-ui-for-media-stream',
      '--use-fake-device-for-media-stream',
    ],
  });

  const indexFile = path.join(process.cwd(), 'test.html');

  const sessions = [];

  const addClient = async () => {
    const page = await browser.newPage();
    page.on('console', async (msg) => {
      try {
        const msgArgs = await Promise.all(msg.args().map(arg => arg.jsonValue()));
        console.log(...msgArgs)
      } catch (err) {}
    });
    await page.goto(`file://${indexFile}`);
    await page.evaluate(async () => {
      await addClient();
    });
    sessions.push(page);
  }

  const disconnectAll = async () => {
    await Promise.all(sessions.map(async (page) => {
      await page.evaluate(async () => {
        await disconnectAll();
      });
      await page.close();
    }));
    sessions.length = 0;
  }

  for (let i = 0; i < 1000000; ++i) {
    console.log(`Attempt ${i}`);
    await addClient();
    await addClient();
    await sleep(1000);
    await disconnectAll();
    await sleep(1000);
  }
}

main()
