import React, { useState } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale);

interface NutrientData {
  name: string;
  value: number;
  unit: string;
}

interface NutrientChartProps {
  nutrients: NutrientData[];
}

const NutrientChart: React.FC<NutrientChartProps> = ({ nutrients }) => {
  // State to track if dark mode is active
  const [isDarkMode, setIsDarkMode] = useState(document.documentElement.classList.contains('dark'));

  // Use a MutationObserver to watch for theme changes on the html element
  React.useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsDarkMode(document.documentElement.classList.contains('dark'));
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    // Cleanup observer on component unmount
    return () => observer.disconnect();
  }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount

  // Determine text color based on the isDarkMode state
  const textColor = isDarkMode ? '#f1f5f9' : '#1F2937'; // Use a very light color for dark mode (slate-100), dark gray for light mode

  const data = {
    labels: nutrients.map(n => `${n.name} (${n.value}${n.unit})`),
    datasets: [
      {
        data: nutrients.map(n => n.value),
        backgroundColor: [
          '#10B981', // emerald-500
          '#3B82F6', // blue-500
          '#8B5CF6', // violet-500
          '#EC4899', // pink-500
          '#F59E0B', // amber-500
          '#EF4444', // red-500
          '#6366F1', // indigo-500
          '#14B8A6', // teal-500
        ],
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
        align: 'start' as const,
        labels: {
          boxWidth: 12,
          padding: 10,
          usePointStyle: true,
          color: textColor,
          font: {
            size: 12,
          },
        },
        fullSize: true,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            const nutrient = nutrients.find(n => `${n.name} (${n.value}${n.unit})` === label);
            const unit = nutrient ? nutrient.unit : '';
            
            if (label.includes('%')) {
                return label;
            }

            return `${label}: ${value}${unit}`;
          }
        }
      }
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="h-64 w-full">
      <Pie data={data} options={options} />
    </div>
  );
};

export default NutrientChart; 