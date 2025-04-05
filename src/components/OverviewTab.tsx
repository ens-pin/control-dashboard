
import React from 'react';
import { Label, Pie, PieChart, Line, LineChart, Cell, CartesianGrid, XAxis } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const nodeIsOnline = true; // This would be replaced with actual Docker node status check

const pieChartData = nodeIsOnline 
  ? [{ status: "Online", value: 100, fill: "#22c55e" }]  // Online state
  : [{ status: "Offline", value: 100, fill: "#ef4444" }]; // Offline state

const lineChartData = [
  { month: "January", pinnedHash: 186 },
  { month: "February", pinnedHash: 305 },
  { month: "March", pinnedHash: 237 },
  { month: "April", pinnedHash: 273 },
  { month: "May", pinnedHash: 209 },
  { month: "June", pinnedHash: 214 },
  { month: "July", pinnedHash: 253 },
  { month: "August", pinnedHash: 328 },
  { month: "September", pinnedHash: 298 },
  { month: "October", pinnedHash: 265 },
  { month: "November", pinnedHash: 289 },
  { month: "December", pinnedHash: 300 }
];

const pieChartConfig = {
  devices: {
    label: "Node Status",
  },
  online: {
    label: "Online",
    color: "#22c55e",
  },
  offline: {
    label: "Offline",
    color: "#ef4444",
  },
} satisfies ChartConfig;

const lineChartConfig = {
  pinnedHash: {
    label: "Pinned IPFS Hash",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export const OverviewTab = () => {
  const totalActiveDevices = React.useMemo(() => {
    return pieChartData[0]?.value === 100 ? "ONLINE" : "OFFLINE";
  }, []);

  return (
    <>
      <h1 className="text-4xl font-bold mb-6 text-white">Dashboard Overview</h1>
      <div className="bg-black p-6 rounded-lg border border-gray-800">
        <h3 className="text-2xl font-semibold mb-8 text-gray-300">IPFS Node Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="border-b md:border-b-0 md:border-r border-gray-800 pb-4 md:pb-0 md:pr-4">
            <p className="text-gray-400 text-xl mb-1 text-center">Total IPFS Hash Pinned</p>
            <ChartContainer config={lineChartConfig}>
              <LineChart
                accessibilityLayer
                data={lineChartData}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Line
                  dataKey="pinnedHash"
                  type="linear"
                  stroke="#60a5fa"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          </div>
          <div className="md:pl-4">
            <p className="text-gray-400 mb-2 text-xl text-center">Node Status</p>
            <ChartContainer
              config={pieChartConfig}
              className="mx-auto aspect-square max-h-[250px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={pieChartData}
                  dataKey="value"
                  nameKey="status"
                  innerRadius={60}
                  strokeWidth={5}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                  <Label
                    value={totalActiveDevices}
                    position="center"
                    style={{ 
                      fill: nodeIsOnline ? '#22c55e' : '#ef4444', 
                      fontSize: '24px', 
                      fontWeight: 'bold' 
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          </div>
        </div>
      </div>
    </>
  );
}; 