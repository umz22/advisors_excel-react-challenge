import React, { useState } from "react"
import {account} from "../Types/Account"
import Paper from "@mui/material/Paper/Paper";
import { Button, Card, CardContent, Grid, TextField, Snackbar, Alert } from "@mui/material";

type AccountDashboardProps = {
  account: account;
  signOut: () => Promise<void>;
}

export const AccountDashboard = (props: AccountDashboardProps) => {
  const [depositAmount, setDepositAmount] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [account, setAccount] = useState(props.account); 

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');


  const {signOut} = props;
  const depositFunds = async () => {
    // Check if the deposit amount is greater than $1000
    if (depositAmount > 1000) {
      setSnackbarMessage('Cannot deposit more than $1000 in a single transaction');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }
  
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: depositAmount })
    };
  
    const response = await fetch(`http://localhost:3000/transactions/${account.accountNumber}/deposit`, requestOptions);
  
    if (response.ok) {
      const data = await response.json();
      setAccount({
        accountNumber: data.account_number,
        name: data.name,
        amount: data.amount,
        type: data.type,
        creditLimit: data.credit_limit
      });
      setSnackbarMessage('Deposit successful!');
      setSnackbarSeverity('success');
    } else {
      const errorData = await response.json();
      setSnackbarMessage(`Deposit failed: ${errorData.error}`);
      setSnackbarSeverity('error');
    }
    setSnackbarOpen(true);
  };

  const withdrawFunds = async () => {
    if (withdrawAmount % 5 !== 0) {
      setSnackbarMessage('Withdrawal amount must be in multiples of $5');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }
  
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: withdrawAmount })
    };
  
    const response = await fetch(`http://localhost:3000/transactions/${account.accountNumber}/withdraw`, requestOptions);
  
    if (response.ok) {
      const data = await response.json();
      setAccount({
        accountNumber: data.account_number,
        name: data.name,
        amount: data.amount,
        type: data.type,
        creditLimit: data.credit_limit
      });
      setSnackbarMessage('Withdrawal successful!');
      setSnackbarSeverity('success');
    } else {
      const errorData = await response.json();
      setSnackbarMessage(`Withdrawal failed: ${errorData.error}`);
      setSnackbarSeverity('error');
    }
    setSnackbarOpen(true);
  };
  
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Paper className="account-dashboard">
      <div className="dashboard-header">
        <h1>Hello, {account.name}!</h1>
        <Button variant="contained" onClick={signOut}>Sign Out</Button>
      </div>
      <h2>Balance: ${account.amount}</h2>
      <Grid container spacing={2} padding={2}>
        <Grid item xs={6}>
          <Card className="deposit-card">
            <CardContent>
              <h3>Deposit</h3>
              <TextField
                label="Deposit Amount"
                variant="outlined"
                type="number"
                sx={{
                  display: 'flex',
                  margin: 'auto',
                }}
                onChange={(e) => setDepositAmount(+e.target.value)}
              />
              <Button
                variant="contained"
                sx={{
                  display: 'flex',
                  margin: 'auto',
                  marginTop: 2
                }}
                onClick={depositFunds}
              >
                Submit
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card className="withdraw-card">
            <CardContent>
              <h3>Withdraw</h3>
              <TextField
                label="Withdraw Amount"
                variant="outlined"
                type="number"
                sx={{
                  display: 'flex',
                  margin: 'auto',
                }}
                onChange={(e) => setWithdrawAmount(+e.target.value)}
              />
              <Button
                variant="contained"
                sx={{
                  display: 'flex',
                  margin: 'auto',
                  marginTop: 2
                }}
                onClick={withdrawFunds}
              >
                Submit
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
};