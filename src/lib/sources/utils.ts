import type { Page } from 'playwright';

export const loadLocalStorage = async (page: Page, values: { name: string; value: string }[]) => {
	await page.evaluate((values) => {
		values.forEach((value) => {
			localStorage.setItem(value.name, value.value);
		});
	}, values);
};

export const loadSessionStorage = async (page: Page, values: { name: string; value: string }[]) => {
	await page.evaluate((values) => {
		values.forEach((value) => {
			sessionStorage.setItem(value.name, value.value);
		});
	}, values);
};

export const saveSessionStorage = async (page: Page) => {
	const items = await page.evaluate(() => {
		const values = [];
		for (let i = 0; i < sessionStorage.length; i++) {
			const name = sessionStorage.key(i);
			const value = sessionStorage.getItem(name as string);
			if (name && value) values.push({ name, value });
		}
		return values;
	});
	return items;
};
