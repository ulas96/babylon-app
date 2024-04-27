import React, { useRef, useState } from 'react';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import timeline from 'highcharts/modules/timeline';
import axios from 'axios';
import "./style.css";

timeline(Highcharts);

const Roadmap = (props: HighchartsReact.Props) => {



    const [topic, setTopic] = useState<string>("");
    const [steps, setSteps] = useState<Array<{ x: number, name: string, label: string, color: string }>>([]);

    const getRandomColor = () => {
        const r = Math.floor(Math.random() * 256).toString(16); 
        const g = Math.floor(Math.random() * 256).toString(16); 
        const b = Math.floor(Math.random() * 256).toString(16); 
        return `#${r.padStart(2, '0')}${g.padStart(2, '0')}${b.padStart(2, '0')}`; 
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
          inverted: true,
          backgroundColor: "#0e1418"
        },
      
        xAxis: {
          type: 'datetime', // Set the x-axis type to datetime
          labels: {
            // formatter: function () {
            //   return Highcharts.dateFormat('%Y-%m-%d', this.value as number); // Format the date
            // }
          }
        },
        yAxis: {
          visible: false
        },
      
        plotOptions: {
          columnrange: {
            dataLabels: {
              useHTML: true,
              color: '',
              formatter: function () {
                return `<div class="steps">${this.point.name}</div>`;
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
          <div className="roadmap-header">
            <h1>Create your own AI powered educational journey</h1>  
          </div>

          <div className="roadmap-header">
          <input value={topic} onChange={handleTopic}/>
            <button onClick={getRoadmap}> Get Roadmap</button>
          </div>


          <HighchartsReact 
            highcharts={Highcharts}
            options={options}
            ref={chartComponentRef}
            {...props}
          />
        
        </>


        
      );
}

export default Roadmap;