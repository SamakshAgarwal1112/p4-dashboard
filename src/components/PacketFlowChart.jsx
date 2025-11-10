// import React, { useMemo } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// const PacketFlowChart = ({ packets }) => {
//   const chartData = useMemo(() => {
//     // Group packets by time intervals (every 5 seconds for last 60 seconds)
//     const now = new Date();
//     const intervals = [];
    
//     for (let i = 11; i >= 0; i--) {
//       const time = new Date(now.getTime() - i * 5000);
//       intervals.push({
//         time: time.toLocaleTimeString('en-US', { hour12: false, minute: '2-digit', second: '2-digit' }),
//         forwarded: 0,
//         dropped: 0,
//         total: 0
//       });
//     }

//     packets.forEach(packet => {
//       const packetTime = new Date(packet.timestamp);
//       const timeDiff = (now - packetTime) / 1000; // in seconds
      
//       if (timeDiff < 60) {
//         const index = Math.floor((60 - timeDiff) / 5);
//         if (index >= 0 && index < intervals.length) {
//           intervals[index].total++;
//           if (packet.action === 'forwarded') {
//             intervals[index].forwarded++;
//           } else {
//             intervals[index].dropped++;
//           }
//         }
//       }
//     });

//     return intervals;
//   }, [packets]);

//   const CustomTooltip = ({ active, payload }) => {
//     if (active && payload && payload.length) {
//       return (
//         <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl">
//           <p className="text-slate-300 text-sm mb-2">{payload[0].payload.time}</p>
//           {payload.map((entry, index) => (
//             <p key={index} className="text-sm" style={{ color: entry.color }}>
//               {entry.name}: {entry.value}
//             </p>
//           ))}
//         </div>
//       );
//     }
//     return null;
//   };

//   return (
//     <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-sm">
//       <CardHeader>
//         <CardTitle className="text-slate-100 flex items-center gap-2">
//           <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
//           Real-Time Packet Flow
//         </CardTitle>
//       </CardHeader>
//       <CardContent>
//         <ResponsiveContainer width="100%" height={300}>
//           <LineChart data={chartData}>
//             <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
//             <XAxis 
//               dataKey="time" 
//               stroke="#94a3b8"
//               style={{ fontSize: '12px' }}
//             />
//             <YAxis 
//               stroke="#94a3b8"
//               style={{ fontSize: '12px' }}
//             />
//             <Tooltip content={<CustomTooltip />} />
//             <Legend 
//               wrapperStyle={{ color: '#94a3b8' }}
//             />
//             <Line 
//               type="monotone" 
//               dataKey="total" 
//               stroke="#06b6d4" 
//               strokeWidth={2}
//               dot={{ fill: '#06b6d4', r: 3 }}
//               activeDot={{ r: 5 }}
//             />
//             <Line 
//               type="monotone" 
//               dataKey="forwarded" 
//               stroke="#10b981" 
//               strokeWidth={2}
//               dot={{ fill: '#10b981', r: 3 }}
//             />
//             <Line 
//               type="monotone" 
//               dataKey="dropped" 
//               stroke="#f43f5e" 
//               strokeWidth={2}
//               dot={{ fill: '#f43f5e', r: 3 }}
//             />
//           </LineChart>
//         </ResponsiveContainer>
//       </CardContent>
//     </Card>
//   );
// };

// export default PacketFlowChart;

import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const PacketFlowChart = ({ packets }) => {
  const chartData = useMemo(() => {
    const intervals = [];
    
    for (let i = 0; i < packets.length; i++) {
      intervals.push({
        time: packets[i].timestamp.split("T")[1],
        index: `T${i + 1}`,
        forwarded: 0,
        dropped: 0,
        total: 0
      });
    }

    // Distribute packets evenly across intervals
    packets.forEach((packet, index) => {
      const intervalIndex = Math.floor(index);
      if (intervalIndex >= 0 && intervalIndex < intervals.length) {
        intervals[intervalIndex].total++;
        if (packet.action === 'forwarded') {
          intervals[intervalIndex].forwarded++;
        } else {
          intervals[intervalIndex].dropped++;
        }
      }
    });

    return intervals;
  }, [packets]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl">
          <p className="text-slate-300 text-sm mb-2">{payload[0].payload.time}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-slate-100 flex items-center gap-2">
          <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
          Packet Flow Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis 
              dataKey="index" 
              stroke="#94a3b8"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#94a3b8"
              style={{ fontSize: '12px' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ color: '#94a3b8' }}
            />
            <Line 
              type="monotone" 
              dataKey="total" 
              stroke="#06b6d4" 
              strokeWidth={2}
              dot={{ fill: '#06b6d4', r: 3 }}
              activeDot={{ r: 5 }}
            />
            <Line 
              type="monotone" 
              dataKey="forwarded" 
              stroke="#10b981" 
              strokeWidth={2}
              dot={{ fill: '#10b981', r: 3 }}
            />
            <Line 
              type="monotone" 
              dataKey="dropped" 
              stroke="#f43f5e" 
              strokeWidth={2}
              dot={{ fill: '#f43f5e', r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default PacketFlowChart;