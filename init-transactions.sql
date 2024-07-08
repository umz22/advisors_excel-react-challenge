CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  account_number INTEGER NOT NULL,
  amount INTEGER NOT NULL,
  date TIMESTAMP NOT NULL,
  FOREIGN KEY (account_number) REFERENCES accounts(account_number)
);