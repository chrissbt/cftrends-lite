import React, { useContext } from 'react';
import _ from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { CSVReader as CSVParser } from 'react-papaparse';
import { LoadingContext } from '../../contexts/loading';

const buttonRef = React.createRef();

const csvHeaders = [
  "buyer_name",
  "buyer_email",
  "status",
  "amount_dollars",
  "due_at",
  "aff_sub",
  "aff_sub2",
  "purchase_id",
  "products",
  "created_at",
  "affiliate_tier",
  "referring_affiliate"
];

const useStyles = makeStyles((theme) => ({
  button: {
    fontFamily: 'proxima-nova,Roboto,"Helvetica Neue",Arial,sans-serif',
    fontWeight: 300,
  },
}));

const CSVReader = ({handleData, handleError}) => {
  const classes = useStyles();
  const { setLoading } = useContext(LoadingContext);

  const handleOpenDialog = (e) => {
    // Note that the ref is set async, so it might be null at some point
    if (buttonRef.current) {
      buttonRef.current.open(e);
    }
  };

  const handleOnDrop = (data) => {
    setLoading({
      loading: true,
    });

    setTimeout(() => {
      handleCSVValid(data, (isValid) => {
        if(isValid) {
          handleCSVToJSON(data, (data, total, trials, paying, startDate, dueDate) => {
            handleData(data, total, trials, paying, startDate, dueDate);
          })
        }
        else {
          const error = true;
          const msg = 'Invalid CSV file! Please check the columns of the csv';
          handleError(error, msg);
        }
        setLoading({
          loading: false,
        });
      })
    }, 1000);
  }

  const handleCSVValid = (data, cb) => {
    const dataHeader = data[0].meta.fields;
    let isValid = _.isEqual(dataHeader.sort(), csvHeaders.sort());
    cb(isValid);
  }

  const handleCSVToJSON = (data, callback) => {
    data.pop();

    let total = 0, trials = 0, paying = 0;
    let result = [];
    data.map(({data}) => {
      let amount = parseFloat(data['amount_dollars']);
      total += amount;
      if(data['products'].toLowerCase() === 'trial')
        trials += 1;
      else
        paying += 1;
      data['amount_dollars'] = parseFloat(data['amount_dollars']);
      data['created_at'] = (new Date(data['created_at'])).toISOString().split('T')[0];
      data['due_at'] = (new Date(data['due_at'])).toISOString().split('T')[0];
      result.push(data);
      return null;
    });
    total = total.toFixed(2);
    let startDate = new Date(Math.min(...data.map(({data}) => new Date(data['created_at'])))).toUTCString();
    let dueDate = new Date(Math.max(...data.map(({data}) => new Date(data['due_at'])))).toUTCString();
    startDate = formatDate(startDate);
    dueDate = formatDate(dueDate);
    callback(result, total, trials, paying, startDate, dueDate);
  }

  const handleOnError = (err, file, inputElem, reason) => {
    const error = true;
    handleError(error, err.message);
  }

  const handleOnRemoveFile = (data) => {
    let total = 0, trials = 0, paying = 0;
    handleData(data, total, trials, paying);
  }

  const formatDate = (date) => {
    let dateObj = (new Date(date)).toISOString().split('T')[0];
    let yyyy = dateObj.split('-')[0];
    let yy = yyyy.substring(2);
    let mm = dateObj.split('-')[1];
    let dd = dateObj.split('-')[2];
    return dd + '/' + mm + '/' + yy;
  }

  return (
    <CSVParser
      ref={buttonRef}
      onDrop={handleOnDrop}
      onError={handleOnError}
      noDrag
      noClick
      addRemoveButton
      noProgressBar
      onRemoveFile={handleOnRemoveFile}
      config={{
        header: true,
      }}
      style={{
        dropArea: {
          borderRadius: 0,
          borderStyle: 'none',
          borderWidth: 0,
          height: 'unset',
          padding: 0,
        }
      }}
    >{() => (
      <Button variant="contained" color="primary" onClick={handleOpenDialog} className={classes.button}>
        Import Affiliate CSV
      </Button>
      )}
    </CSVParser>
  );
}
 
export default CSVReader;