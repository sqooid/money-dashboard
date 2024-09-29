import type { BrowserContext } from 'playwright';

export type SessionData = Awaited<ReturnType<BrowserContext['storageState']>> & {
	customData?: any;
};

export type DataAccount = {
	name: string;
	balance: number;
	currency: string;
};

export type DataBalance = {
	totalBalance: number;
	accounts: DataAccount[];
};

export type DataTransaction = {
	image?: string;
	name: string;
	amount: number;
	date: string;
};

export type BasicLogin = {
	username: string;
	password: string;
};

export type DataSource<Login = BasicLogin> = {
	// Check if previous session is valid and create one if not
	createSession: (params: { login: Login; session?: SessionData }) => Promise<SessionData>;
	// Get list of accounts and their balances
	getBalances: (params: { session?: SessionData }) => Promise<DataBalance>;
	// Get list of transactions
	getTransactions: (params: {
		session?: SessionData;
		fromDate?: string;
	}) => Promise<DataTransaction[]>;
};
