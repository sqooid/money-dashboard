import { test } from 'vitest';
import { ubankSource } from '.';
import { UBANK_PASSWORD, UBANK_USERNAME } from '$env/static/private';

test(
	'ubank',
	async () => {
		const session = await ubankSource.createSession({
			login: { username: UBANK_USERNAME, password: UBANK_PASSWORD }
		});
	},
	{ timeout: 30000 }
);
