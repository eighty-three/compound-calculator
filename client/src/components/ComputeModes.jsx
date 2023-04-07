import React, { useState, useContext } from 'react';

import styles from '@/components/ComputeModes.module.css';

import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

import TotalForm from '@/components/Forms/TotalForm';
import MonthlyForm from '@/components/Forms/MonthlyForm';
import YearsForm from '@/components/Forms/YearsForm';
import LoanForm from '@/components/Forms/LoanForm';

import CurrenciesContext from '@/lib/CurrenciesContext';
import { findTotalRecursive } from '@/lib/calculate';
import GrowthTable from '@/components/GrowthTable';

const ComputeModes = () => {
  const [ progression, setProgression ] = useState([]);
  const currencies = useContext(CurrenciesContext);
  const showTables = (data) => setProgression(findTotalRecursive([], data));

  return (
    <>
      {/* Override Bootstrap styling */}
      <style type="text/css">
        {`
            .nav-link, .nav-link:hover {
              color: rgb(130, 25, 25);
              outline-color: rgba(130, 25, 25, 0.5);
            }

            .nav-item.nav-link.active {
              background-color: rgb(130, 25, 25);
            }

            .form-control:focus {
              border-color: rgba(130, 25, 25, 0.3);
              box-shadow: 0 0 0 0.2rem rgba(130, 25, 25, 0.15);
            }
        `}
      </style>

      <Tabs 
        variant="pills" 
        className={`nav-fill ${styles.tabsContainer}`} 
        defaultActiveKey="Total" 
        id="modes" 
        transition={false} 
        mountOnEnter={true} 
        unmountOnExit={true}
      >

        <Tab eventKey="Total" title="Total">
          <TotalForm formSubmitFunction={showTables} />
          <GrowthTable progression={progression} currencies={currencies}/>
        </Tab>

        <Tab eventKey="Years" title="Years">
          <YearsForm />
        </Tab>

        <Tab eventKey="Monthly" title="Monthly">
          <MonthlyForm />
        </Tab>

        <Tab eventKey="Loan" title="Loan">
          <LoanForm />
        </Tab>

      </Tabs>
    </>
  );
};

export default ComputeModes;
