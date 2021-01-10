import React, { useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Alert from '@material-ui/lab/Alert';
import CSVReader from '../CSVReader/index';
import Loader from '../Loader/index';
import Stats from '../Stats/index';
import ResultTable from '../ResultTable/index';
import { LoadingContext } from '../../contexts/loading';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(6),
  },
  title: {
    marginTop: 0,
    fontSize: '2.5rem',
    fontFamily: 'proxima-nova,Roboto,"Helvetica Neue",Arial,sans-serif',
    fontWeight: 300,
  },
  date: {
    marginTop: 0,
    fontSize: '1rem',
    fontFamily: 'proxima-nova,Roboto,"Helvetica Neue",Arial,sans-serif',
    color: 'rgb(29, 96, 154)',
  },
  alert: {
    margin: theme.spacing(0, 0, 6),
  },
}));

export default function Main() {
  const classes = useStyles();

  const [csvReaderError, setCSVReaderError] = useState({
    error: false,
    msg: '',
  })

  const [date, setDate] = useState({
    startDate: '',
    dueDate: ''
  })

  const { loading } = useContext(LoadingContext);

  const [result, setResult] = useState({
    data: [],
    total: '0',
    trials: 0,
    paying: 0,
  })

  const handleData = (data, total, trials, paying, startDate, dueDate) => {
    setResult({
      data,
      total,
      trials,
      paying
    });
    setDate({
      startDate,
      dueDate
    })
  }

  const handleError = (error, msg) => {
    setCSVReaderError({
      error,
      msg
    })
  }

  const { error, msg } = csvReaderError;
  const { startDate, dueDate } = date;

  return (
    <div className={classes.root}>
      {
        loading &&
        <Loader />
      }
      {
        error &&
        <Alert className={classes.alert} severity="error">{msg}</Alert>
      }
      <Grid container spacing={3} justify="space-between">
        <Grid item>
          <Typography variant="h1" className={classes.title}>
            CFTrends Lite
          </Typography>
          {
            startDate &&
            <Typography variant="h6" className={classes.date}>
              {startDate} to {dueDate}
            </Typography>
          }
        </Grid>
        <Grid item>
          <CSVReader
            handleData = {handleData}
            handleError = {handleError}
          />
        </Grid>
      </Grid>
      <Stats
        result = {result}
      />
      <ResultTable
        result = {result}
      />
    </div>
  );
}