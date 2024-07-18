import React, { useState } from 'react';
import "./AssistedAnalysis.css";

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
    <div className="assisted-analysis-container">
      <h1>Apache Service</h1>
      <p>May 15, 2024, 10:00 AM</p>
      <div>
        <div className="assisted-analysis-row">
          <div className="col-md-4">
            <div className="assisted-analysis-card">
              <div className="assisted-analysis-card-header">Status</div>
              <div className="assisted-analysis-card-body">
                <p className="assisted-analysis-card-text">{status}</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="assisted-analysis-card">
              <div className="assisted-analysis-card-header">Incident count</div>
              <div className="assisted-analysis-card-body">
                {/* <p className="assisted-analysis-card-text">Within 24 hours</p> */}
                <p className="assisted-analysis-card-text">{incidentCount}</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="assisted-analysis-card">
              <div className="assisted-analysis-card-header">Uptime</div>
              <div className="assisted-analysis-card-body">
                <p className="assisted-analysis-card-text">{uptime}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="assisted-analysis-row">
          <div className="col-md-4">
            <div className="assisted-analysis-card">
              <div className="assisted-analysis-card-header">Error Rate</div>
              <div className="assisted-analysis-card-body">
                <ul>
                  {errorRate.map((item) => (
                    <li key={item.value}>{item.label}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="assisted-analysis-card">
              <div className="assisted-analysis-card-header">Anomaly Graph</div>
              <div className="assisted-analysis-card-body">
                <ul>
                  {anomalyGraph.map((item) => (
                    <li key={item.value}>{item.label}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="assisted-analysis-card">
              <div className="assisted-analysis-card-header">Forecasting Graph</div>
              <div className="assisted-analysis-card-body">
                <ul>
                  {forecastingGraph.map((item) => (
                    <li key={item.value}>{item.label}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='last-action'>
      <h2>Last Action Taken:</h2>
      <p>{lastActionTaken}</p>
      </div>

      
      <div className="last-deployment-and-configuration-row">
        <div className="col-md-6">
          <h2>Last Deployment Details</h2>
          <div className="last-deployment-card">
            <div className="last-deployment-card-body">
              <p>User: {lastDeploymentDetails.user}</p>
              <p>Date: {lastDeploymentDetails.date}</p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <h2>Configuration Changes</h2>
          <div className="configuration-changes-card">
            <div className="configuration-changes-card-body">
              <ul>
                {configurationChanges.map((change) => (
                  <li key={change.query}>
                    <p>User: {change.user}</p>
                    <p>Date: {change.date}</p>
                    <p>Query: {change.query}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      
    <div className='logs'>
      <h2>Last 30 Minutes Logs</h2>
      <table className="logs-table">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Service</th>
            <th>Status</th>
            <th>Query</th>
          </tr>
        </thead>
        <tbody>
          {last30MinutesLogs.map((log) => (
            <tr key={log.timestamp}>
              <td>{log.timestamp}</td>
              <td>{log.service}</td>
              <td>{log.status}</td>
              <td>{log.query}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}

export default AssistedAnalysis;
