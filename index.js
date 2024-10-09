const { chromium } = require("playwright");

async function sortHackerNewsArticles() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // go to Hacker News 'newest' page
  await page.goto("https://news.ycombinator.com/newest");

  // Get the first 100 articles with their timestamps
  const articles = await page.$$eval('tr.athing', rows => {
    return rows.slice(0, 100).map(row => {
      const rank = row.querySelector('.rank')?.innerText.trim();
      const title = row.querySelector('.titleline a')?.innerText.trim();
      const articleID = row.getAttribute('id');
      return { rank, title, articleID };
    });
  });

  // Extract the IDs and check if they are sorted from newest to oldest
  let isSorted = true;
  for (let i = 1; i < articles.length; i++) {
    if (articles[i].articleID >= articles[i - 1].articleID) {
      isSorted = false;
      break;
    }
  }

  if (isSorted) {
    console.log("The first 100 articles are sorted from newest to oldest.");
  } else {
    console.log("The first 100 articles are NOT sorted from newest to oldest.");
  }

}

(async () => {
  await sortHackerNewsArticles();
})();
