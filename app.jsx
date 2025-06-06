// This file contains the React component for the Contraceptive Economics Explorer
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

const ContraceptiveEconomicsApp = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCountryType, setSelectedCountryType] = useState('all');
  const [savingsParameters, setSavingsParameters] = useState({
    unintendedPregRate: 40,
    pregnancyCost: 2000,
    maleMethodIncrease: 20,
    effectiveness: 75
  });

  // Sample data based on the research report
  const healthcareExpenditureData = [
    { year: 2000, 'High Income': 7.2, 'Upper-Middle Income': 5.1, 'Lower-Middle Income': 4.3, 'Low Income': 3.8 },
    { year: 2005, 'High Income': 7.8, 'Upper-Middle Income': 5.3, 'Lower-Middle Income': 4.5, 'Low Income': 4.0 },
    { year: 2010, 'High Income': 8.5, 'Upper-Middle Income': 5.6, 'Lower-Middle Income': 4.6, 'Low Income': 4.2 },
    { year: 2015, 'High Income': 8.9, 'Upper-Middle Income': 5.9, 'Lower-Middle Income': 4.8, 'Low Income': 4.4 },
    { year: 2020, 'High Income': 9.4, 'Upper-Middle Income': 6.1, 'Lower-Middle Income': 5.0, 'Low Income': 4.5 }
  ];

  const outOfPocketData = [
    { year: 2000, 'High Income': 20, 'Upper-Middle Income': 35, 'Lower-Middle Income': 52, 'Low Income': 58 },
    { year: 2005, 'High Income': 19, 'Upper-Middle Income': 34, 'Lower-Middle Income': 50, 'Low Income': 57 },
    { year: 2010, 'High Income': 18, 'Upper-Middle Income': 33, 'Lower-Middle Income': 48, 'Low Income': 56 },
    { year: 2015, 'High Income': 17, 'Upper-Middle Income': 32, 'Lower-Middle Income': 46, 'Low Income': 55 },
    { year: 2020, 'High Income': 16, 'Upper-Middle Income': 31, 'Lower-Middle Income': 45, 'Low Income': 54 }
  ];

  const unmetNeedData = [
    { country: 'Nigeria', rural: 63, urban: 42 },
    { country: 'Ethiopia', rural: 57, urban: 39 },
    { country: 'India', rural: 48, urban: 32 },
    { country: 'Bangladesh', rural: 42, urban: 28 },
    { country: 'Mexico', rural: 31, urban: 22 },
    { country: 'Brazil', rural: 25, urban: 19 },
    { country: 'China', rural: 18, urban: 12 },
    { country: 'USA', rural: 13, urban: 9 }
  ];

  const savingsPerCapitaData = [
    { income: 'Low Income', savings: 20 },
    { income: 'Lower-Middle Income', savings: 12 },
    { income: 'Upper-Middle Income', savings: 9 },
    { income: 'High Income', savings: 5 }
  ];

  // Filter country data based on selection
  const filteredUnmetNeedData = selectedCountryType === 'all' 
    ? unmetNeedData 
    : unmetNeedData.filter(country => {
        if (selectedCountryType === 'highIncome') return ['USA'].includes(country.country);
        if (selectedCountryType === 'middleIncome') return ['China', 'Brazil', 'Mexico'].includes(country.country);
        if (selectedCountryType === 'lowIncome') return ['Nigeria', 'Ethiopia', 'India', 'Bangladesh'].includes(country.country);
        return true;
      });

  // Calculate adjusted savings based on parameters
  const calculateSavings = () => {
    const baselineMultiplier = savingsParameters.unintendedPregRate / 40 * 
                              savingsParameters.pregnancyCost / 2000 * 
                              savingsParameters.maleMethodIncrease / 20 * 
                              savingsParameters.effectiveness / 75;
    
    return savingsPerCapitaData.map(item => ({
      ...item,
      adjustedSavings: Math.round(item.savings * baselineMultiplier)
    }));
  };

  const adjustedSavingsData = calculateSavings();

  // Calculator function
  const savingsCalculator = (population, fertilityRate, gdpPerCapita) => {
    const years = 30; // reproductive years
    const estPregnanciesPerCapita = fertilityRate / years;
    const potentialSavingsPerCapita = estPregnanciesPerCapita * 
                                     (savingsParameters.unintendedPregRate / 100) * 
                                     (savingsParameters.maleMethodIncrease / 100) * 
                                     (savingsParameters.effectiveness / 100) * 
                                     savingsParameters.pregnancyCost;
    
    const totalSavings = potentialSavingsPerCapita * population;
    const savingsAsGDP = (potentialSavingsPerCapita / gdpPerCapita) * 100;
    
    return {
      perCapita: potentialSavingsPerCapita.toFixed(2),
      total: totalSavings.toLocaleString(),
      gdpPercent: savingsAsGDP.toFixed(2)
    };
  };

  const [calculatorInputs, setCalculatorInputs] = useState({
    population: 10000000,
    fertilityRate: 2.5,
    gdpPerCapita: 5000
  });

  const [calculatorResults, setCalculatorResults] = useState(
    savingsCalculator(10000000, 2.5, 5000)
  );

  const handleCalculate = () => {
    setCalculatorResults(savingsCalculator(
      calculatorInputs.population,
      calculatorInputs.fertilityRate,
      calculatorInputs.gdpPerCapita
    ));
  };

  return (
    <div className="bg-blue-50 min-h-screen">
      <header className="bg-blue-700 text-white py-6">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-3xl font-bold">Contraceptive Economics Explorer</h1>
          <p className="text-lg mt-2">
            Exploring the economic impact of male contraceptive methods worldwide
          </p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="flex flex-wrap border-b">
            {['overview', 'unmetNeed', 'economicImpact', 'calculator'].map(tab => (
              <button 
                key={tab}
                className={`py-3 px-6 font-medium ${activeTab === tab 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 hover:bg-blue-50'}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'overview' ? 'Overview' : 
                 tab === 'unmetNeed' ? 'Unmet Need' : 
                 tab === 'economicImpact' ? 'Economic Impact' : 
                 'Savings Calculator'}
              </button>
            ))}
          </div>

          {activeTab === 'overview' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Global Healthcare Expenditure Trends</h2>
              <p className="mb-4">
                Healthcare expenditure as a percentage of GDP across different income groups over time.
                High-income countries consistently allocate higher percentages of GDP to healthcare.
              </p>
              <div className="h-72 mb-8">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={healthcareExpenditureData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis domain={[0, 10]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="High Income" stroke="#3b82f6" strokeWidth={2} />
                    <Line type="monotone" dataKey="Upper-Middle Income" stroke="#10b981" strokeWidth={2} />
                    <Line type="monotone" dataKey="Lower-Middle Income" stroke="#f59e0b" strokeWidth={2} />
                    <Line type="monotone" dataKey="Low Income" stroke="#ef4444" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <h2 className="text-xl font-semibold mb-4">Out-of-Pocket Healthcare Costs</h2>
              <p className="mb-4">
                Personal financial burden as percentage of total healthcare spending.
                Citizens in lower-income countries bear a much higher personal financial burden.
              </p>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={outOfPocketData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis domain={[0, 70]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="High Income" stroke="#3b82f6" strokeWidth={2} />
                    <Line type="monotone" dataKey="Upper-Middle Income" stroke="#10b981" strokeWidth={2} />
                    <Line type="monotone" dataKey="Lower-Middle Income" stroke="#f59e0b" strokeWidth={2} />
                    <Line type="monotone" dataKey="Low Income" stroke="#ef4444" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeTab === 'unmetNeed' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Rural-Urban Unmet Need for Contraception</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by country type:</label>
                <select 
                  className="border rounded p-2"
                  value={selectedCountryType}
                  onChange={(e) => setSelectedCountryType(e.target.value)}
                >
                  <option value="all">All Countries</option>
                  <option value="highIncome">High Income</option>
                  <option value="middleIncome">Middle Income</option>
                  <option value="lowIncome">Low Income</option>
                </select>
              </div>
              <p className="mb-4">
                This visualization shows the percentage of women aged 15-49 who want to avoid pregnancy but lack access
                to modern contraception in rural versus urban areas.
              </p>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={filteredUnmetNeedData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 70]} />
                    <YAxis dataKey="country" type="category" width={100} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="rural" name="Rural Areas" fill="#3b82f6" />
                    <Bar dataKey="urban" name="Urban Areas" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <h2 className="text-xl font-semibold mt-8 mb-4">Key Findings on Unmet Need</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Rural areas face 20-30% higher unmet contraceptive needs than urban areas in many countries</li>
                <li>The poorest wealth quintiles typically have double the unmet need of the richest quintiles</li>
                <li>Access gaps contribute to higher reliance on emergency obstetric care, increasing costs</li>
                <li>Males in low-income settings have limited contraceptive options beyond condoms</li>
                <li>Expanded male contraceptive access could help bypass geographic and financial barriers</li>
              </ul>
            </div>
          )}

          {activeTab === 'economicImpact' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Potential Savings from Male Contraceptive Adoption</h2>
              <p className="mb-4">
                Based on the research model, a 20% increase in male contraceptive adoption with 75% effectiveness could
                yield substantial savings, particularly in low-income settings.
              </p>

              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={adjustedSavingsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="income" />
                    <YAxis label={{ value: 'USD per capita', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="adjustedSavings" name="Annual Savings (USD)" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-medium mb-2">Adjust Parameters</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Unintended Pregnancy Rate (%)</label>
                    <input 
                      type="range" 
                      min="10" 
                      max="70" 
                      value={savingsParameters.unintendedPregRate}
                      onChange={(e) => setSavingsParameters({...savingsParameters, unintendedPregRate: parseInt(e.target.value)})}
                      className="w-full"
                    />
                    <span className="text-sm">{savingsParameters.unintendedPregRate}%</span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Cost per Pregnancy (USD)</label>
                    <input 
                      type="range" 
                      min="500" 
                      max="5000" 
                      step="100"
                      value={savingsParameters.pregnancyCost}
                      onChange={(e) => setSavingsParameters({...savingsParameters, pregnancyCost: parseInt(e.target.value)})}
                      className="w-full"
                    />
                    <span className="text-sm">${savingsParameters.pregnancyCost}</span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Male Method Increase (%)</label>
                    <input 
                      type="range" 
                      min="5" 
                      max="40" 
                      value={savingsParameters.maleMethodIncrease}
                      onChange={(e) => setSavingsParameters({...savingsParameters, maleMethodIncrease: parseInt(e.target.value)})}
                      className="w-full"
                    />
                    <span className="text-sm">{savingsParameters.maleMethodIncrease}%</span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Effectiveness (%)</label>
                    <input 
                      type="range" 
                      min="50" 
                      max="95" 
                      value={savingsParameters.effectiveness}
                      onChange={(e) => setSavingsParameters({...savingsParameters, effectiveness: parseInt(e.target.value)})}
                      className="w-full"
                    />
                    <span className="text-sm">{savingsParameters.effectiveness}%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'calculator' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Country Savings Calculator</h2>
              <p className="mb-4">
                This tool lets you calculate potential savings from male contraceptive adoption for a specific country or region.
                Adjust the parameters to model different scenarios.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Population</label>
                  <input 
                    type="number" 
                    value={calculatorInputs.population}
                    onChange={(e) => setCalculatorInputs({...calculatorInputs, population: Number(e.target.value)})}
                    className="w-full border rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fertility Rate (per woman)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={calculatorInputs.fertilityRate}
                    onChange={(e) => setCalculatorInputs({...calculatorInputs, fertilityRate: Number(e.target.value)})}
                    className="w-full border rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">GDP Per Capita (USD)</label>
                  <input 
                    type="number" 
                    value={calculatorInputs.gdpPerCapita}
                    onChange={(e) => setCalculatorInputs({...calculatorInputs, gdpPerCapita: Number(e.target.value)})}
                    className="w-full border rounded p-2"
                  />
                </div>
              </div>

              <button 
                onClick={handleCalculate}
                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 mb-6"
              >
                Calculate Savings
              </button>

              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-4">Results</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded shadow">
                    <p className="text-sm text-gray-500">Savings Per Capita</p>
                    <p className="text-2xl font-bold text-blue-700">${calculatorResults.perCapita}</p>
                  </div>
                  <div className="bg-white p-4 rounded shadow">
                    <p className="text-sm text-gray-500">Total Potential Savings</p>
                    <p className="text-2xl font-bold text-blue-700">${calculatorResults.total}</p>
                  </div>
                  <div className="bg-white p-4 rounded shadow">
                    <p className="text-sm text-gray-500">Savings as % of GDP Per Capita</p>
                    <p className="text-2xl font-bold text-blue-700">{calculatorResults.gdpPercent}%</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <footer className="text-center text-gray-500 text-sm mb-8">
          <p>
            Based on research by Nelson Zhu | Data sourced from the World Bank, WHO, and Guttmacher Institute
          </p>
          <p className="mt-2">
            Note: This application uses simplified models for educational purposes. See the full report for complete methodology and limitations.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default ContraceptiveEconomicsApp; 