import React, { Fragment, useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';

import { getFinancials } from '../actions/finActions';

const useStyles = makeStyles(() => ({
  container: {
    width: '80%',
    margin: '0 auto',
  },
  tableWrapper: {
    display: 'flex',
    textAlign: 'initial',
    lineHeight: '30px',
  },
  tableRow: {
    display: 'flex',
    flexWrap: 'wrap',
    width: '540px',
  },
  tableTitle: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '620px',
  },
  tableTitleItem: {
    width: '100px',
      },
  tableRowCell: {
    width: '165px',
  },
  tableColumn : {
    lineHeight: '48px',
  },
  tableValuesBlock: {
    textAlign: 'center',
  },
  tableColumnItem: {
    width: '150px',
  }
}));

export const UnitsList = (props) => {
  const { financials, getFinancials } = props;
  const classes = useStyles();
  const myRefs= useRef([]);

  useEffect(() => {
        getFinancials();
  }, []);

  // CREATE ARR OF MONTHS
  let numberOfMonths = [];
  financials.map(el => {
        const currentDate = new Date(isNaN(el["postedDate"]) && el["postedDate"]);
        const currentMonth = currentDate.getMonth() + 1;
        numberOfMonths.push(currentMonth);
        numberOfMonths = [...new Set(numberOfMonths)];
      }
  );

  // HELPER TO CALCULATE SUM OF ARR ARRS
  const sumOfArrays = (arr) =>  {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr[i].length; j++) {
        sum += arr[i][j];
      }
    }
    return sum;
  };

  // HELPER TO CALCULATE SUM OF ARR ITEMS
  const sumItemsArr = (arr) => {
    let total = 0;
    for (let i in arr) {
      total += arr[i];
    }
    return total;
  }

  // HELPER TO SLICE DATA
  const chunk = (arr, size) => arr.reduce((acc, e, i) => (i % size ? acc[acc.length - 1].push(e) : acc.push([e]), acc), []);

  // HELPER TO FILTER DATA
  const filterData = (item) => {
    return item.type === 'Product Sales' || item.type === 'Shipping Revenue' || item.type === 'Other Income' || item.type === "Cost";
  }
  const filterDataTotal = (item) => {
    return item.type === 'Product Sales' || item.type === 'Shipping Revenue' || item.type === 'Other Income';
  }
  const filterDataSale = (item) => {
    return item.type === 'Total Sales';
  }
  const filterTotalCost = (item) => {
    return item.type === 'Total Sales' || item.type === 'Cost';
  }
  // CREATE INITIAL MAIN DATA
  const initialMainData = [
      {type:'Product Sales',
       data: [[], []],
       total: [],
       result: [],
      },
      {type: 'Shipping Revenue',
       data: [[], []],
       total: [],
      },
      {type:'Other Income',
       data: [[], []],
       total: [],
      },
      {type:'Total Sales',
       data: [],
       total:[],
       },
      {type:'Cost',
        data:[[],[]],
       },
      {type:'Total',
        data: [],
        total:[],
        result:[],
        sum:[],
      },
       ];


  // ACCORDING TO THE ISSUE PASS VALUES TO THE INITIAL STATE
  financials.map((el, index) => {
    const currentDate = new Date(el.postedDate);
    const currentMonth = currentDate ? currentDate.getMonth() : 1;
     if (el.type === 'charge') {
      switch (el.subType) {
        case 'principal':
          initialMainData[0].data[currentMonth].push(el.currencyAmount);
          break;
        case 'shipping':
          initialMainData[1].data[currentMonth].push(el.currencyAmount);
          break;
        case 'wrapping':
          initialMainData[2].data[currentMonth].push(el.currencyAmount);
          break;
        default:
          break;
      }
    }
    if ((el.type === 'fee' && (el.subType === 'shipping' || el.subType === 'wrapping' || el.subType === 'handling')))
    {
        initialMainData[4].data[currentMonth].push(el.currencyAmount);
    }
  });

  // CALCULATE VALUES PER MONTH
  initialMainData
      .filter(filterData)
      .map((item,i) => {
    item.sum = Math.round((sumOfArrays(item.data) + Number.EPSILON) * 100) / 100;
    item.data.map((el, j) => {
      item.data[j] = sumItemsArr(el);
    })
     item.data.push(item.sum);
       })


  // CALCULATE TOTAL SALES VALUE
  initialMainData
      .filter(filterDataTotal)
      .map((el, j) => {
     el.data ? initialMainData[0].total.push(el.data) : '';
  })
  numberOfMonths.map((item, i) => {
    initialMainData[0].total.map((item, j) => {
      initialMainData[0].result.push(initialMainData[0].total[j][i])
    })
  })
  initialMainData[0].result = chunk(initialMainData[0].result, 3)
  initialMainData[0].result.map((item, index) => {initialMainData[3].data.push(sumItemsArr(item));
  })

 // CALCULATE TOTAL VALUEPER YEAR
  initialMainData
      .filter(filterDataTotal)
      .map((item,i) => {
        initialMainData[3].total.push(item.sum)
                })
  initialMainData[3].data.push(sumItemsArr(initialMainData[3].total));

  // CALCULATE TOTAL VALUE
  initialMainData
      .filter(filterTotalCost)
      .map((item, i) => {
        initialMainData[5].total.push(item.data);
      })

  initialMainData[5].total[0]
      .map((item, i) => {
        initialMainData[5].total.map((el, j) => {
            initialMainData[5].result.push(initialMainData[5].total[j][i])
          })

      })
   initialMainData[5].result = chunk(initialMainData[5].result, 2)
   initialMainData[5].result.map((item, index) =>
       initialMainData[5].data.push(Math.round(((sumItemsArr(item)) * 100) / 100)));




 console.log(initialMainData);


  return (
    <Fragment>
      {/*CREATE FIRST TITLES ROW*/}
      <div className={classes.container}>
            <div className={classes.tableTitle}>
              <div className={classes.tableTitleItem}>Type
                <hr></hr>
               </div>
                    {numberOfMonths.map((month) =>
                  <div
                      className={classes.tableTitleItem}
                      key={month + Math.random(100)}
                  >
                    {new Date(financials[0].postedDate).getFullYear()} - {month}
                    <hr className={classes.tableTitleItem}></hr>
                  </div>
              )}
              <div>2021
                <hr className={classes.tableTitleItem}></hr>
              </div>

            </div>
              {/*CREATE FIRST TITLES COLUMN*/}
             <div className={classes.tableWrapper}>
               <div className={classes.tableColumn}>
                  {initialMainData.map(item => (
                    <div
                        className={classes.tableColumnItem}
                        key={item.type + Math.random(100)}
                    >
                      {item.type}
                    </div>
                  ))}
             </div>
            {/*CREATE MAIN TABLE BODY*/}
             <div className={classes.tableValuesBlock}>
               <div className={classes.tableRow}>
                 {initialMainData.map((el, i) => (
                     el.data.map((item, j) =>(
                         <div
                             className={classes.tableRowCell}
                             key={item + Math.random(100)}
                         >
                           {item}
                           <hr></hr>
                         </div>
                     ))
                     )
                 )}
                   </div>
               </div>
          </div>
      </div>
    </Fragment>
  );
};

UnitsList.propTypes = {
  financials: PropTypes.array.isRequired,
  getFinancials: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  financials: state.list.financials,
});

export default connect(mapStateToProps, { getFinancials })(UnitsList);
