import React, { useRef, useState, useEffect } from 'react';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import timeline from 'highcharts/modules/timeline';
import axios from 'axios';
import "./style.css";

timeline(Highcharts);

const Roadmap = (props: HighchartsReact.Props) => {



    const [topic, setTopic] = useState<string>("");
    const [steps, setSteps] = useState<Array<{ x: number, name: string, label: string, color: string }>>([]);
    const [colors, setColors] = useState<Array<string>>([]);

    function generateGradient(startColor: string, endColor: string, steps: number) {
      const start = {
          'Hex' : startColor,
          'R' : parseInt(startColor.slice(1,3), 16),
          'G' : parseInt(startColor.slice(3,5), 16),
          'B' : parseInt(startColor.slice(5,7), 16)
      }
      const end = {
          'Hex' : endColor,
          'R' : parseInt(endColor.slice(1,3), 16),
          'G' : parseInt(endColor.slice(3,5), 16),
          'B' : parseInt(endColor.slice(5,7), 16)
      }
      const diffR = end['R'] - start['R'];
      const diffG = end['G'] - start['G'];
      const diffB = end['B'] - start['B'];
  
      steps -= 1; // Reduce the steps by one because we're including the start color
      const stepSize = {
          'R' : diffR / steps,
          'G' : diffG / steps,
          'B' : diffB / steps
      }
  
      var gradientColors = [];
      for (let i = 0; i <= steps; i++) {
        const stepColor: { R: number; G: number; B: number; Hex: string } = {
          'R': Math.round(start['R'] + (stepSize['R'] * i)),
          'G': Math.round(start['G'] + (stepSize['G'] * i)),
          'B': Math.round(start['B'] + (stepSize['B'] * i)),
          'Hex': ''
        };
        stepColor['Hex'] = '#' + ((1 << 24) + (stepColor['R'] << 16) + (stepColor['G'] << 8) + stepColor['B']).toString(16).slice(1);
        gradientColors.push(stepColor['Hex']);
      }
      return gradientColors;
  }

    // const getRandomColor = () => {
    //     const r = Math.floor(Math.random() * 256).toString(16); 
    //     const g = Math.floor(Math.random() * 256).toString(16); 
    //     const b = Math.floor(Math.random() * 256).toString(16); 
    //     return `#${r.padStart(2, '0')}${g.padStart(2, '0')}${b.padStart(2, '0')}`; 
    // }

    const handleSteps = (response: Record<string, string>) => {
        setColors(generateGradient("#5eb7b7", "#154d77", Object.keys(response).length));
        const root = document.documentElement;

        // Update the CSS variables
        colors.forEach((color, index) => {
          root.style.setProperty(`--highcharts-color-${index}`, color);
  
          // Create a new style element
          const style = document.createElement('style');
          // Set the CSS text
          style.textContent = `
              .steps:nth-child(${index + 1}) {
                  background: var(--highcharts-color-${index}) !important;
              }
          `;
          // Append the style element to the document head
          document.head.append(style);
      });
        const now = new Date();
        let date = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const result = Object.keys(response).map((key, index) => {
          date.setMonth(date.getMonth() + 3);
          return {
            x: new Date(date).getTime(),
            name: key,
            label: response[key],
            color: colors[index % colors.length]
          };
        });        


        // const stepResponse = []
        // for (let [key, value] of Object.entries(response)) {
        //     stepResponse.push({ x: new Date(date).getTime(), name: key, label: value, color: getRandomColor()});
        //     //setSteps((prev) => [...prev, { x: new Date(date), name: key, description: value, color: getRandomColor()}]);
        //     date.setMonth(date.getMonth() + 3);
        // }
        setSteps(result);
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
      //   defs: {
      //     gradient0: {
      //         tagName: 'linearGradient',
      //         id: 'gradient0',
      //         x1: 0,
      //         y1: 0,
      //         x2: 0,
      //         y2: 1,
      //         children: [{
      //             tagName: 'stop',
      //             offset: 0,
      //             'stop-color': '#5eb7b7' // start color of the gradient
      //         }, {
      //             tagName: 'stop',
      //             offset: 1,
      //             'stop-color': '#154d77' // end color of the gradient
      //         }]
      //     } as any
      // },
      
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
          series: {
              dataLabels: {
                  useHTML: true,
                  padding: 0,
                  borderWidth: 0,
                  
                  formatter: function() {
                      return `<div style="background-color: ${this.point.color}; padding: 5px; border-radius: 5px; color: white; font-size: 17px;">${this.point.name}: ${this.point.options.label}</div>`;
                  },
                  style: {
                      color: 'black',
                      textOutline: 'none',
                      fontWeight: 'normal'
                  }
              }
          }
      },
        title: {
          text: `${topic} Roadmap`,
          style: {
            color: "#ffffff",
          }
        },

        tooltip: {
          enabled: false
        },
      
        legend: {
          enabled: false
        },
        colors: colors,
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

    // const labelBoxes = document.querySelectorAll('.highcharts-label-box');

    // labelBoxes.forEach((box, index) => {
    //   box.setAttribute('fill', colors[index % colors.length]);
    // });

    useEffect(() => {
      if (chartComponentRef.current) {
          const chart = chartComponentRef.current.chart;
          const points = chart.series[0].points;
  
          points.forEach((point: any, index) => {
              if (point.dataLabels && point.dataLabels.length > 0) {
                  const dataLabel = point.dataLabels[0];
                  if (dataLabel && dataLabel.box) {
                      dataLabel.box.attr({
                          fill: colors[index % colors.length]
                      });
                  }
              }
          });
      }
  }, [chartComponentRef, colors]);

//   useEffect(() => {
//     if (chartComponentRef.current) {
//         const chart = chartComponentRef.current.chart;

//         // Check if the chart's data is available
//         if (chart.series[0]?.data && chart.series[0].data.length > 0) {
//             // Remove the existing line
//             chart.series[0].update({
//               lineWidth: 10,
//               type: 'timeline'
//             });

//             // Add a plotLine for each data point
//             chart.series[0].data.forEach((point, i, points) => {
//               const color1 = Highcharts.color('#5eb7b7').tweenTo(
//                 Highcharts.color('#154d77'),
//                 i / (points.length - 1) // Calculate the color gradient position
//               );

//               chart.yAxis[0].addPlotLine({
//                 color: color1.toString(),
//                 width: 2,
//                 value: point.y,
//                 zIndex: 5 // To make sure the line is above the grid
//               });
//             });
//         }
//     }
// }, [chartComponentRef]);


  return(
        <>


          <div className="roadmap-header">
            <input className="roadmap-input" value={topic} onChange={handleTopic}/>
            <button className="roadmap-button" onClick={getRoadmap}>Get Roadmap</button>
          </div>


          <HighchartsReact 
          className="roadmap-chart"
            highcharts={Highcharts}
            options={options}
            ref={chartComponentRef}
            {...props}
          />
        
        </>
      );
}

export default Roadmap;