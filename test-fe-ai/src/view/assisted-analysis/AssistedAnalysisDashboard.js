import React, { useState } from 'react';
import { MdSettingsSuggest } from "react-icons/md";
import { formatDateString } from '../../util/helper-func/DateConverter';
import { Line, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale // Add this line
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale // Add this line
);
function AssistedAnalysis() {

  const data = {
    "problemId": "7861321333982118719_1721545199999V2",
    "displayId": "P-2407114",
    "title": "Process unavailable",
    "impactLevel": "INFRASTRUCTURE",
    "severityLevel": "AVAILABILITY",
    "status": "CLOSED",
    "affectedEntities": [
        {
            "entityId": {
                "id": "PROCESS_GROUP_INSTANCE-6907346AD756DDE1",
                "type": "PROCESS_GROUP_INSTANCE"
            },
            "name": "Apache Web Server apache*"
        }
    ],
    "impactedEntities": [
        {
            "entityId": {
                "id": "PROCESS_GROUP_INSTANCE-6907346AD756DDE1",
                "type": "PROCESS_GROUP_INSTANCE"
            },
            "name": "Apache Web Server apache*"
        }
    ],
    "rootCauseEntity": {
        "entityId": {
            "id": "PROCESS_GROUP-5BDC2902F3F36B08",
            "type": "PROCESS_GROUP"
        },
        "name": "Apache Web Server apache*"
    },
    "managementZones": [],
    "entityTags": [],
    "problemFilters": [
        {
            "id": "c21f969b-5f03-333d-83e0-4f8f136e7682",
            "name": "Default"
        }
    ],
    "startTime": 1721545199999,
    "endTime": 1721585144083,
    "evidenceDetails": {
        "totalCount": 2,
        "details": [
            {
                "evidenceType": "AVAILABILITY_EVIDENCE",
                "displayName": "Availability",
                "entity": {
                    "entityId": {
                        "id": "PROCESS_GROUP_INSTANCE-6907346AD756DDE1",
                        "type": "PROCESS_GROUP_INSTANCE"
                    },
                    "name": "Apache Web Server apache*"
                },
                "groupingEntity": {
                    "entityId": {
                        "id": "PROCESS_GROUP-5BDC2902F3F36B08",
                        "type": "PROCESS_GROUP"
                    },
                    "name": "Apache Web Server apache*"
                },
                "rootCauseRelevant": true,
                "startTime": 1721544240000,
                "endTime": 1721545320000
            },
            {
                "evidenceType": "EVENT",
                "displayName": "Process unavailable",
                "entity": {
                    "entityId": {
                        "id": "PROCESS_GROUP_INSTANCE-6907346AD756DDE1",
                        "type": "PROCESS_GROUP_INSTANCE"
                    },
                    "name": "Apache Web Server apache*"
                },
                "groupingEntity": {
                    "entityId": {
                        "id": "PROCESS_GROUP-5BDC2902F3F36B08",
                        "type": "PROCESS_GROUP"
                    },
                    "name": "Apache Web Server apache*"
                },
                "rootCauseRelevant": true,
                "eventId": "7861321333982118719_1721545199999",
                "eventType": "PGI_UNAVAILABLE",
                "data": {
                    "eventId": "7861321333982118719_1721545199999",
                    "startTime": 1721545199999,
                    "endTime": 1721585144083,
                    "eventType": "PGI_UNAVAILABLE",
                    "title": "Process unavailable",
                    "entityId": {
                        "entityId": {
                            "id": "PROCESS_GROUP_INSTANCE-6907346AD756DDE1",
                            "type": "PROCESS_GROUP_INSTANCE"
                        },
                        "name": "Apache Web Server apache*"
                    },
                    "properties": [
                        {
                            "key": "dt.event.description",
                            "value": "Process Apache Web Server apache* on host ip-172-31-25-105.ap-southeast-1.compute.internal has been shut down"
                        },
                        {
                            "key": "dt.event.group_label",
                            "value": "Process unavailable"
                        },
                        {
                            "key": "dt.event.impact_level",
                            "value": "Infrastructure"
                        },
                        {
                            "key": "dt.event.is_rootcause_relevant",
                            "value": "true"
                        },
                        {
                            "key": "dt.event.timeout",
                            "value": "0"
                        }
                    ],
                    "status": "CLOSED",
                    "correlationId": "28e3a51aa752b6cc",
                    "entityTags": [],
                    "managementZones": [],
                    "underMaintenance": false,
                    "suppressAlert": false,
                    "suppressProblem": false,
                    "frequentEvent": false
                },
                "startTime": 1721545199999,
                "endTime": 1721585144083
            }
        ]
    },
    "recentComments": {
        "totalCount": 0,
        "comments": []
    },
    "impactAnalysis": {
        "impacts": []
    }
}

const getDate = (time) => {
  const date = new Date(time);
  // Get the day, month, year, hours, and minutes
  const day = date.getDate();
  const month = date.getMonth() + 1; // Months are zero-based
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  return `${day}/${month}/${year} - ${String(hours).padStart(
    2,
    "0"
  )} : ${String(minutes).padStart(2, "0")} : ${String(seconds).padStart(
    2,
    "0"
  )}`;
};
const getDownTime = () => {
  const differenceMs = Math.abs(data?.startTime - data?.endTime);
  const totalMinutes = Math.floor(differenceMs / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const formattedTime = `${String(hours).padStart(2, "0")} hours ${String(
    minutes
  ).padStart(2, "0")} mins`;
  return formattedTime;
};

const data2 = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'My First dataset',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [65, 59, 80, 81, 56, 55, 40]
    }
  ]
};

const data3 = {
  labels: [
    'Eating',
    'Drinking',
    'Sleeping',
    'Designing',
    'Coding',
    'Cycling',
    'Running'
  ],
  datasets: [{
    label: 'My First Dataset',
    data: [65, 59, 90, 81, 56, 55, 40],
    fill: true,
    backgroundColor: 'rgba(255, 99, 132, 0.2)',
    borderColor: 'rgb(255, 99, 132)',
    pointBackgroundColor: 'rgb(255, 99, 132)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgb(255, 99, 132)'
  }, {
    label: 'My Second Dataset',
    data: [28, 48, 40, 19, 96, 27, 100],
    fill: true,
    backgroundColor: 'rgba(54, 162, 235, 0.2)',
    borderColor: 'rgb(54, 162, 235)',
    pointBackgroundColor: 'rgb(54, 162, 235)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgb(54, 162, 235)'
  }]
};

  return (
    <div className='p-5 flex flex-col gap-5 h-body overflow-auto'>
         <div className="w-full flex">
          <div className="mx-auto p-5 w-full bg-white rounded-lg shadow-sm shadow-slate-400">
            <div className="flex gap-2 mb-5 text-start text-lg text-main font-semibold">
              <MdSettingsSuggest className="my-auto text-3xl" />
              <h3 className=" text-xl my-auto">
                {data?.impactedEntities[0].name} {data?.title}
              </h3>
            </div>
            <div className="flex flex-wrap gap-10">
              <div className="w-[16%]">
                <h3 className="text-start text-xs font-semibold">Problem Id</h3>
                <h3 className=" text-start text-sm ">{data?.displayId}</h3>
              </div>

              <div className="w-[16%]">
                <h3 className="text-start text-xs font-semibold">
                  Detected Time
                </h3>
                <h3 className=" text-start text-sm">
                  {data &&  formatDateString(getDate(data?.startTime)) }
                </h3>
              </div>

              <div className="w-[16%]">
                <h3 className="text-start text-xs font-semibold">
                  Analysis End Date
                </h3>
                <h3 className=" text-start text-sm">
                  {data &&
                    (data?.endTime == "-1" ? "-" : formatDateString(getDate(data?.endTime)))}
                </h3>
              </div>

              <div className="w-[16%]">
                <h3 className="text-start text-xs font-semibold">
                  Total Down Time
                </h3>
                <h3 className=" text-start text-sm text-orange-400">{data && getDownTime()}</h3>
              </div>

              <div className="w-[16%]">
                <h3 className="text-start text-xs font-semibold">
                  Impact Level
                </h3>
                <h3 className=" text-start text-sm">{data?.impactLevel}</h3>
              </div>

              <div className="w-[16%]">
                <h3 className="text-start text-xs font-semibold">
                  Severity Level
                </h3>
                <h3 className=" text-start text-sm">{data?.severityLevel}</h3>
              </div>

              <div className="w-[16%]">
                <h3 className="text-start text-xs font-semibold">Status</h3>
                <h3 className={` text-start font-semibold text-sm ${data?.status == 'CLOSED'? 'text-green-800':'text-red-500'}`}>{data?.status}</h3>
              </div>

              <div className="w-[16%]">
                <h3 className="text-start text-xs font-semibold">
                  Root Cause ID
                </h3>
                <h3 className=" text-start text-sm">
                  {data?.rootCauseEntity?.entityId?.id || "-"}
                </h3>
              </div>

              <div className="w-[16%]">
                <h3 className="text-start text-xs font-semibold">
                  Entity Name
                </h3>
                <h3 className=" text-start text-sm">
                  {data?.rootCauseEntity?.name || "-"}
                </h3>
              </div>

              <div className="w-[100%]">
                <h3 className="text-start text-xs font-semibold">
                  Problem description
                </h3>
                <h3 className=" text-start text-sm ">
                  {data?.evidenceDetails?.details[0]?.data?.properties[0].value}
                </h3>
              </div>
            </div>
          </div>
        </div>

        <div className='flex justify-between gap-5'>
           <div className='w-[33%] bg-white rounded-lg p-5'>
           <Line data={data2} />
           </div>
           <div className='w-[33%] bg-white rounded-lg p-5'>
           <Radar data={data3} />
           </div>
           <div className='w-[33%] bg-white rounded-lg p-5'>
           <Line data={data2} />
           </div>
        </div>
    </div>
  );
}

export default AssistedAnalysis;
