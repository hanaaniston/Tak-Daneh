import React, { useEffect, useRef } from 'react';
import type { PriceItem } from './types';

// Let TypeScript know Chart.js is available globally from the CDN
declare var Chart: any;

const priceData: PriceItem[] = [
    { model: 'As', price: 550000 },
    { model: 'A و A2 (خرمایی)', price: 280000 },
    { model: 'AA', price: 650000 },
    { model: 'AAS', price: 730000 },
    { model: 'AA (صدیک)', price: 950000 },
    { model: 'AAA (خرمایی)', price: 420000 },
    { model: 'AAA', price: 800000 },
    { model: 'AAAS', price: 830000 },
    { model: 'AAA (صد یک)', price: 1200000 },
    { model: 'صد یک اعلا', price: 1150000 },
];


// --- Chart Component ---
interface PriceChartProps {
  data: PriceItem[];
}

const PriceChart: React.FC<PriceChartProps> = ({ data }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<any>(null); // Use 'any' since we don't have Chart.js types installed

  useEffect(() => {
    if (chartRef.current && data.length > 0) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        chartInstance.current = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: data.map(item => item.model),
            datasets: [{
              label: 'قیمت (تومان)',
              data: data.map(item => item.price),
              backgroundColor: 'rgba(212, 175, 55, 0.6)',
              borderColor: '#d4af37',
              borderWidth: 1,
              borderRadius: 4,
            }]
          },
          options: {
            indexAxis: 'y', // This makes the bar chart horizontal
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                backgroundColor: '#0a192f',
                titleColor: '#d4af37',
                bodyColor: '#fff',
                borderColor: '#d4af37',
                borderWidth: 1,
                rtl: true,
                padding: 10,
                callbacks: {
                   label: function(context: any) {
                       let label = context.dataset.label || '';
                       if (label) {
                           label += ': ';
                       }
                       if (context.parsed.x !== null) { // Use 'x' for horizontal chart
                           label += new Intl.NumberFormat('en-US').format(context.parsed.x) + ' تومان';
                       }
                       return label;
                   }
                }
              }
            },
            scales: {
              x: { // 'x' axis is now the value axis
                beginAtZero: true,
                grid: { color: 'rgba(255, 255, 255, 0.1)' },
                ticks: {
                  color: 'rgba(255, 255, 255, 0.7)',
                   callback: function(value: string | number) {
                     return new Intl.NumberFormat('en-US').format(typeof value === 'string' ? parseInt(value) : value);
                   }
                }
              },
              y: { // 'y' axis is now the category axis
                grid: { display: false },
                ticks: {
                  color: 'rgba(255, 255, 255, 0.9)',
                  font: { size: 11 }
                }
              }
            }
          }
        });
      }
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  return <canvas ref={chartRef} />;
};


// --- Main App Component ---
const App: React.FC = () => {
  const formatPrice = (price: number): string => {
    return price.toLocaleString('en-US');
  };

  return (
    <div className="min-h-screen bg-[#0a192f] text-white flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-3xl mx-auto">
        
        <header className="text-center mb-8">
          <h1 className="text-5xl font-black tracking-widest uppercase text-gray-300">Tak Daneh</h1>
          <div className="flex items-center justify-center mt-4 gap-4">
            <div className="h-px w-16 bg-[#d4af37]/50"></div>
            <h2 className="text-2xl font-bold text-[#d4af37]">لیست قیمت انجیر</h2>
            <div className="h-px w-16 bg-[#d4af37]/50"></div>
          </div>
        </header>

        <main className="bg-white/5 rounded-2xl shadow-2xl shadow-[#d4af37]/10 backdrop-blur-sm overflow-hidden border border-white/10">
          <div className="overflow-x-auto">
            <table className="w-full text-lg">
              <thead className="border-b-2 border-[#d4af37]">
                <tr>
                  <th scope="col" className="py-4 px-6 text-right font-bold text-[#d4af37] tracking-wider">
                    مدل انجیر
                  </th>
                  <th scope="col" className="py-4 px-6 text-left font-bold text-[#d4af37] tracking-wider">
                    قیمت (تومان)
                  </th>
                </tr>
              </thead>
              <tbody>
                {priceData.map((item, index) => (
                  <tr 
                    key={index} 
                    className={`border-b border-white/10 transition-all duration-300 ease-in-out hover:bg-[#d4af37]/10 hover:scale-[1.02] opacity-0 animate-slide-in row-${index + 1}`}
                  >
                    <td className="py-5 px-6 font-bold text-white whitespace-nowrap">
                      {item.model}
                    </td>
                    <td className="py-5 px-6 text-left font-bold text-xl text-[#d4af37] whitespace-nowrap">
                      {formatPrice(item.price)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>

        <section className="mt-12 bg-white/5 rounded-2xl shadow-2xl shadow-[#d4af37]/10 backdrop-blur-sm border border-white/10 p-6 opacity-0 animate-slide-in row-11">
            <h3 className="text-2xl font-bold text-center mb-6 text-[#d4af37]">نمودار مقایسه قیمت</h3>
            <div className="relative h-[450px] md:h-96">
                <PriceChart data={priceData} />
            </div>
        </section>

        <footer className="text-center mt-8">
          <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} Tak Daneh. All rights reserved.</p>
        </footer>

      </div>
    </div>
  );
};

export default App;
