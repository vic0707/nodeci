const puppeteer = require('puppeteer');
const sessionFactory = require('../factories/sessionFactory');
const userFactory = require('../factories/userFactory');

class CustomPage {
  static async build() {
    const browser = await puppeteer.launch({
      headless: false,
      args: ['--no-sandbox']
    });

    const page = await browser.newPage();
    const customPage = new CustomPage(page);

    return new Proxy(customPage, {
      get: (target, property) => {
        return customPage[property] || browser[property] || page[property];
      }
    });
  }

  constructor(page) {
    this.page = page;
  }

  async login() {
    const user = await userFactory();
    const { session, sig } = sessionFactory(user);

    await this.page.setCookie({ name: 'session', value: session });
    await this.page.setCookie({ name: 'session.sig', value: sig });
    await this.page.goto('http://localhost:3000/blogs');
    await this.page.waitFor('a[href="/auth/logout"]');
  }

  async getContentsOf(selector) {
    return this.page.$eval(selector, el => el.innerHTML);
  }

  get(path) {
    return this.page.evaluate(async (_path) => {
      const res = await fetch(_path, {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
          'COntent-Type': 'application/json'
        }
      });
      return res.json();
    },
    path);
  }

  post(path, data) {
    return this.page.evaluate(async (_path, _data) => {
      const res = await fetch(_path, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'COntent-Type': 'application/json'
        },
        body: JSON.stringify(_data)
      });
      return res.json();
    }, path, data);
  }
}

module.exports = CustomPage;
