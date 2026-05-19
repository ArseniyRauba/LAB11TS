const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const path = require('path');
const { expect } = require('chai');

describe('UI Tests with Selenium', function () {
    let driver;

    // Увеличиваем таймаут, так как браузер может запускаться долго
    this.timeout(30000);

    before(async function () {
        let options = new chrome.Options();
        options.addArguments('--headless'); // Обязательно для CI
        options.addArguments('--no-sandbox');
        options.addArguments('--disable-dev-shm-usage');

        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();

        const filePath = 'file://' + path.resolve(__dirname, '../index.html');
        await driver.get(filePath);
    });

    after(async function () {
        await driver.quit();
    });

    it('Тест 1: Проверка заголовка страницы', async function () {
        const title = await driver.findElement(By.tagName('h1')).getText();
        expect(title).to.equal('Форма обратной связи');
    });

    it('Тест 2: Поля ввода присутствуют на странице', async function () {
        const isNameVisible = await driver.findElement(By.id('name')).isDisplayed();
        const isEmailVisible = await driver.findElement(By.id('email')).isDisplayed();
        expect(isNameVisible).to.be.true;
        expect(isEmailVisible).to.be.true;
    });

    it('Тест 3: Кнопка имеет текст "Отправить"', async function () {
        const btnText = await driver.findElement(By.id('submit-btn')).getText();
        expect(btnText).to.equal('Отправить');
    });

    it('Тест 4: Успешная отправка формы', async function () {
        await driver.findElement(By.id('name')).sendKeys('Test User');
        await driver.findElement(By.id('email')).sendKeys('test@qa.com');
        await driver.findElement(By.id('submit-btn')).click();

        const message = await driver.findElement(By.id('message'));
        await driver.wait(until.elementIsVisible(message), 2000);
        const text = await message.getText();
        expect(text).to.equal('Форма отправлена!');
    });
});