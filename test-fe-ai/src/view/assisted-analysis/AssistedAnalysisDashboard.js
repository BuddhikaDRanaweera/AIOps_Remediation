import React, { useState } from 'react';

function AssistedAnalysis() {

  const [status, setStatus] = useState('Down');
  const [incidentCount, setIncidentCount] = useState(3);
  const [uptime, setUptime] = useState('99.92%');

  const [errorRate, setErrorRate] = useState([
    { value: 1, label: '1%' },
    { value: 2, label: '2%' },
    { value: 3, label: '3%' },
  ]);
  const [anomalyGraph, setAnomalyGraph] = useState([
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
  ]);
  const [forecastingGraph, setForecastingGraph] = useState([
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
  ]);

  const [lastActionTaken, setLastActionTaken] = useState(
    'Restarted by Self-Remediation Engine at "2024-07-03 10:00 AM"'
  );
  const [lastDeploymentDetails, setLastDeploymentDetails] = useState({
    user: 'John Doe',
    date: '2024-07-03 10:00 AM',
  });
  const [configurationChanges, setConfigurationChanges] = useState([
    {
      user: 'Jane Doe',
      date: '2024-07-03 10:00 AM',
      query: 'Memory usage was high.',
    },
    {
      user: 'John Doe',
      date: '2024-07-02 04:00 PM',
      query: 'Configuration error detected.',
    },
    {
      user: 'Jane Doe',
      date: '2024-07-02 12:00 PM',
      query: 'Disk space was low.',
    },
  ]);
  const [last30MinutesLogs, setLast30MinutesLogs] = useState([
    {
      timestamp: '2024-07-03 10:00 AM',
      service: 'Apache',
      status: 'Success',
      query: 'Memory usage was high.',
    },
    {
      timestamp: '2024-07-02 04:00 PM',
      service: 'Apache',
      status: 'Success',
      query: 'Configuration error detected.',
    },
    {
      timestamp: '2024-07-02 12:00 PM',
      service: 'Apache',
      status: 'Success',
      query: 'Disk space was low.',
    },
  ]);

  return (
    <div className='p-5'>
       <div className='bg-white p-2 rounded-md'>
         <div className=''></div>
       </div>
    </div>
  );
}

export default AssistedAnalysis;
