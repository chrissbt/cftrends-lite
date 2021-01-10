import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import PeopleIcon from '@material-ui/icons/People';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    margin: theme.spacing(2, 0),
  },
  paper: {
    padding: theme.spacing(2),
    margin: theme.spacing(2, 0),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  stats: {
    fontFamily: 'proxima-nova,Roboto,"Helvetica Neue",Arial,sans-serif',
    fontWeight: 300,
    color: '#488bf8',
  },
  icon: {
    fontSize: 45,
    color: '#488bf8',
  },
  count: {
    margin: theme.spacing(0, 2, 0),
    fontSize: '2.5rem',
    fontFamily: 'proxima-nova,Roboto,"Helvetica Neue",Arial,sans-serif',
    fontWeight: 600,
    color: 'rgb(29, 96, 154)',
  },
}));

export default function Stats({result}) {
  const classes = useStyles();

  const { total, trials, paying } = result;

  const formatMoney = (amount, decimalCount = 2, decimal = ".", thousands = ",") => {
    try {
      decimalCount = Math.abs(decimalCount);
      decimalCount = isNaN(decimalCount) ? 2 : decimalCount;
  
      const negativeSign = amount < 0 ? "-" : "";
  
      let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
      let j = (i.length > 3) ? i.length % 3 : 0;
  
      return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
    } catch (e) {
      console.log(e)
    }
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item sm>
          <Paper className={classes.paper}>
            <MonetizationOnIcon className={classes.icon} />
            <p className={classes.count}>${formatMoney(total)}</p>
            <p className={classes.stats}>Total Earnings</p>
          </Paper>
        </Grid>
        <Grid item sm>
          <Paper className={classes.paper}>
            <PeopleIcon className={classes.icon} />
            <p className={classes.count}>{trials}</p>
            <p className={classes.stats}>Trials</p>
          </Paper>
        </Grid>
        <Grid item sm>
          <Paper className={classes.paper}>
            <AccountBalanceIcon className={classes.icon} />
            <p className={classes.count}>{paying}</p>
            <p className={classes.stats}>Paying</p>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}