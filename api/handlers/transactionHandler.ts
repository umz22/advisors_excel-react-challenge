import { query } from "../utils/db";
import { getAccount } from "./accountHandler";

// Helper function to get total daily withdrawals for an account
const getDailyWithdrawals = async (accountID: number) => {
  const today = new Date().toISOString().slice(0, 10);
  const res = await query(`
    SELECT SUM(amount) as total 
    FROM transactions 
    WHERE account_number = $1 AND date::date = $2`,
    [accountID, today]
  );
  return res.rows[0].total || 0;
}

// Withdrawal logic
export const withdrawal = async (accountID: number, amount: number) => {
  // withdraw no more than $200 in a single transaction
  if (amount > 200) {
    throw new Error("Cannot withdraw more than $200 in a single transaction");
  }

  // withdraw any amount that can be dispensed in $5 bills
  if (amount % 5 !== 0) {
    throw new Error("Withdrawal amount must be in multiples of $5");
  }

  // withdraw no more than $400 in a single day
  const dailyTotal = await getDailyWithdrawals(accountID);
  if (dailyTotal + amount > 400) {
    throw new Error("Cannot withdraw more than $400 in a single day");
  }

  // Check if the account has enough funds
  const account = await getAccount(accountID)
  // if credit account, check if the amount is within the credit limit
  if (account.type === 'credit' && account.amount - amount < -account.credit_limit) {
    throw new Error("Cannot withdraw more than the credit limit")
  } 
  // else if not credit account, check if the amount is within the account balance
  else if (account.type !== 'credit' && account.amount < amount) {
    throw new Error("Insufficient funds")
  }

  account.amount -= amount

  // Record the transaction for tracking + audit purposes
  await query(`
    INSERT INTO transactions (account_number, amount, date) 
    VALUES ($1, $2, NOW())`,
    [accountID, amount]
  );

  const res = await query(`
    UPDATE accounts
    SET amount = $1 
    WHERE account_number = $2`,
    [account.amount, accountID]
  );

  if (res.rowCount === 0) {
    throw new Error("Transaction failed")
  }

  return account
}

// Deposit logic
export const deposit = async (accountID: number, amount: number) => {
  // Check if the deposit amount is greater than $1000
  if (amount > 1000) {
    throw new Error("Cannot deposit more than $1000 in a single transaction");
  }

  const account = await getAccount(accountID);

  // Check if this is a credit account and the deposit exceeds the amount needed to zero out the account
  if (account.type === 'credit' && (account.amount + amount > 0)) {
    throw new Error("Cannot deposit more than needed to zero out the account");
  }

  account.amount += amount;

  const res = await query(`
    UPDATE accounts
    SET amount = $1 
    WHERE account_number = $2`,
    [account.amount, accountID]
  );

  if (res.rowCount === 0) {
    throw new Error("Transaction failed");
  }

  // Record the transaction for tracking + audit purposes
  await query(`
    INSERT INTO transactions (account_number, amount, date) 
    VALUES ($1, $2, NOW())`,
    [accountID, amount]
  );

  return account;
};