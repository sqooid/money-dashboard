import type { DataSource, SessionData } from '../base';
import playwright, { type Page } from 'playwright';
import { loadLocalStorage, loadSessionStorage, saveSessionStorage } from '../utils';

const loadSession = async (page: Page, session: SessionData) => {
	const context = page.context();
	context.addCookies(session.cookies);
	const localStorage = session.origins.find(
		(origin) => origin.origin === 'https://www.ubank.com.au'
	)?.localStorage;
	if (localStorage) {
		await loadLocalStorage(page, localStorage);
	}
	const sessionStorage = session.customData?.sessionStorage;
	if (sessionStorage) {
		await loadSessionStorage(page, sessionStorage);
	}
};

export const ubankSource: DataSource = {
	async createSession(params) {
		const browser = await playwright.chromium.launch();
		const context = await browser.newContext();
		const page = await context.newPage();
		if (params.session) {
			await loadSession(page, params.session);
			const result = await page
				.goto('https://www.ubank.com.au/welcome/my/accounts', { timeout: 5000 })
				.catch(() => null);
			if (result) {
				return params.session;
			}
		}
		// need to log in
		await page.goto('https://www.ubank.com.au/welcome/login/username');
		await page.getByLabel("What's your username?").fill(params.login.username);
		await page.getByRole('button', { name: 'Next' }).click();
		await page.getByLabel("What's your password?").fill(params.login.password);
		await page.getByRole('button', { name: 'Login' }).click();
		await page.screenshot({ path: 'screenshot.png' });
		await page.waitForURL('https://www.ubank.com.au/welcome/my/accounts', { timeout: 5000 });
		const session: SessionData = await context.storageState();
		session.customData = {
			sessionStorage: await saveSessionStorage(page)
		};
		return session;
	},
	getBalances(params) {
		return Promise.resolve({
			totalBalance: 0,
			accounts: []
		});
	},
	getTransactions(params) {
		return Promise.resolve([]);
	}
};
