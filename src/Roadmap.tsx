import React, { useRef } from 'react';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import timeline from 'highcharts/modules/timeline';

import axios from 'axios';

timeline(Highcharts);



const Roadmap = (props: HighchartsReact.Props) => {

    

    const [topic, setTopic] = React.useState('');

    const handleTopic = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTopic(event.target.value);
    };
    
    const chartComponentRef = useRef<HighchartsReact.RefObject>(null);

    const options: Highcharts.Options = {
        chart: {
          type: "timeline", // change to yours!!!
          inverted: true
        },
      
        xAxis: {
          type: 'datetime', // Set the x-axis type to datetime
          labels: {
            formatter: function () {
              return Highcharts.dateFormat('%Y-%m-%d', this.value as number); // Format the date
            }
          }
        },
      
        plotOptions: {
          columnrange: {
            dataLabels: {
              enabled: true,
              inside: true,
              color: "white",
              formatter: function () {
                if (typeof this.y !== 'number') {
                  return ''; // return an empty string if y is undefined or not a number
                }
      
                // Default colors for specific conditions
                if (this.y > 0) {
                  this.point.color = '#6151db';
                } else if (this.y < 0) {
                  this.point.color = '#ab47bc';
                }
      
                return this.y.toString(); // Safely convert to string for display
              }
            }
          }
        },
        title: {
          text: ""
        },
        // yAxis: {
        //   title: {
        //     text: undefined
        //   },
        //   min: -5,
        //   max: 5
        // },
      
        legend: {
          enabled: false
        },
        series: [
          {
            type: 'timeline', // Explicit type
            name: 'Timeline',
            data: [
              {
                x: Date.UTC(2020, 0, 1), // Date for the timeline
                name: 'Start of Year',
                label: 'Event 1',
                description: 'Description of Event 1',
                color: '#6151db', // Color for the event
              },
              {
                x: Date.UTC(2020, 6, 1),
                name: 'Mid-Year Event',
                label: 'Event 2',
                description: 'Description of Event 2',
                color: '#ab47bc',
              },
            ],
          },
        ],
        credits: {
          enabled: false
        }
      };

    return (
        <>
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
          ref={chartComponentRef}
          {...props}
        />
        

        <input value={topic} onChange={handleTopic}/>
        </>

      );
}

export default Roadmap;