import React, { useRef, useState } from 'react';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import timeline from 'highcharts/modules/timeline';
import axios from 'axios';

timeline(Highcharts);

const Roadmap = (props: HighchartsReact.Props) => {



    const [topic, setTopic] = useState<string>("");
    const [steps, setSteps] = useState<Array<{ x: number, name: string, label: string, color: string }>>([]);

    const getRandomColor = () => {
        const r = Math.floor(Math.random() * 256).toString(16); // Random between 0-255
        const g = Math.floor(Math.random() * 256).toString(16); // Random between 0-255
        const b = Math.floor(Math.random() * 256).toString(16); // Random between 0-255
        return `#${r.padStart(2, '0')}${g.padStart(2, '0')}${b.padStart(2, '0')}`; // Collect all to a css color string
    }

    const handleSteps = (response: JSON) => {
        const now = new Date();
        let date = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const stepResponse = []
        for (let [key, value] of Object.entries(response)) {
            stepResponse.push({ x: new Date(date).getTime(), name: key, label: value, color: getRandomColor()});
            //setSteps((prev) => [...prev, { x: new Date(date), name: key, description: value, color: getRandomColor()}]);
            date.setMonth(date.getMonth() + 3);
        }
        setSteps(stepResponse);
    }

    const getRoadmap = async () => {
        const response = await axios.post(`https://4sfwic0hia.execute-api.eu-central-1.amazonaws.com/default/langchain?topic=${topic}`);
        try {
            const parsedResponse = JSON.parse(response.data.steps);
            handleSteps(parsedResponse);
        } catch (error) {
            console.error("Received data is not valid JSON, refetching...");
            getRoadmap();
        }
    }

    const handleTopic = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTopic(event.target.value);
    };
    
    const chartComponentRef = useRef<HighchartsReact.RefObject>(null);

    const options: Highcharts.Options = {
        chart: {
          type: "timeline", 
          height: "600px",
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
        yAxis: {
          visible: false
        },
      
        plotOptions: {
          columnrange: {
            dataLabels: {
        
              enabled: false,
              inside: true,
              color: "white",
              formatter: function () {
                return "";
                // if (typeof this.y !== 'number') {
                //   return ''; // return an empty string if y is undefined or not a number
                // }
      
                // // Default colors for specific conditions
                // if (this.y > 0) {
                //   this.point.color = '#6151db';
                // } else if (this.y < 0) {
                //   this.point.color = '#ab47bc';
                // }
      
                // return this.y.toString(); // Safely convert to string for display
              }
            }
          }
        },
        title: {
          text: `${topic} Roadmap`
        },
        tooltip: {
          enabled: false
        },
      
        legend: {
          enabled: false
        },
        series: [
          {
            type: 'timeline', // Explicit type
            name: 'Timeline',
            data: steps,
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
        <button onClick={getRoadmap}> Get Roadmap</button>
        </>


        
      );
}

export default Roadmap;