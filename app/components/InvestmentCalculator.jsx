import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Historical returns data for major indices/funds
const historicalReturns = {
  'SPY': {  // S&P 500 ETF
    2023: 0.2641, 2022: -0.1811, 2021: 0.2889, 2020: 0.1675, 2019: 0.3157,
    2018: -0.0436, 2017: 0.2175, 2016: 0.1196, 2015: 0.0137, 2014: 0.1364,
    2013: 0.3244, 2012: 0.1589, 2011: 0.0212, 2010: 0.1506, 2009: 0.2645,
    2008: -0.3663, 2007: 0.0549, 2006: 0.1579, 2005: 0.0491, 2004: 0.1088,
    2003: 0.2844, 2002: -0.2204, 2001: -0.1183, 2000: -0.0910, 1999: 0.2088
  },
  'QQQ': {  // NASDAQ 100 ETF
    2023: 0.5375, 2022: -0.3301, 2021: 0.2705, 2020: 0.4828, 2019: 0.3978,
    2018: -0.0028, 2017: 0.3242, 2016: 0.0709, 2015: 0.0967, 2014: 0.1859,
    2013: 0.3631, 2012: 0.1826, 2011: 0.0306, 2010: 0.1986, 2009: 0.5437,
    2008: -0.4167, 2007: 0.1861, 2006: 0.0714, 2005: 0.0167, 2004: 0.1067,
    2003: 0.4963, 2002: -0.3751, 2001: -0.3293, 2000: -0.3647, 1999: 0.8521
  },
  'VTI': {  // Total US Market ETF
    2023: 0.2643, 2022: -0.1969, 2021: 0.2571, 2020: 0.1697, 2019: 0.3082,
    2018: -0.0513, 2017: 0.2140, 2016: 0.1268, 2015: 0.0040, 2014: 0.1225,
    2013: 0.3351, 2012: 0.1567, 2011: 0.0069, 2010: 0.1708, 2009: 0.2861,
    2008: -0.3683, 2007: 0.0515, 2006: 0.1557, 2005: 0.0503, 2004: 0.1184,
    2003: 0.3106, 2002: -0.2156, 2001: -0.1089, 2000: -0.1054, 1999: 0.2351
  },
  'AGG': {  // US Aggregate Bond ETF
    2023: 0.0552, 2022: -0.1314, 2021: -0.0161, 2020: 0.0721, 2019: 0.0832,
    2018: 0.0001, 2017: 0.0355, 2016: 0.0260, 2015: 0.0048, 2014: 0.0556,
    2013: -0.0202, 2012: 0.0421, 2011: 0.0778, 2010: 0.0647, 2009: 0.0584,
    2008: 0.0523, 2007: 0.0699, 2006: 0.0433, 2005: 0.0221, 2004: 0.0435,
    2003: 0.0410, 2002: 0.1025, 2001: 0.0844, 2000: 0.1163, 1999: -0.0082
  }
};

const fundDescriptions = {
  'SPY': 'S&P 500 Index ETF - Tracks 500 largest US companies',
  'QQQ': 'NASDAQ 100 ETF - Tracks 100 largest non-financial companies',
  'VTI': 'Total US Market ETF - Tracks the entire US stock market',
  'AGG': 'US Aggregate Bond ETF - Tracks the US investment-grade bond market'
};

const InvestmentCalculator = () => {
  const [contribution, setContribution] = useState('');
  const [startDate, setStartDate] = useState('');
  const [symbol, setSymbol] = useState('SPY');
  const [result, setResult] = useState(null);

  const calculateGrowth = () => {
    const startYear = parseInt(startDate.split('-')[0]);
    const currentYear = 2024;
    let totalValue = 0;
    let yearlyBreakdown = [];

    for (let year = startYear; year <= currentYear; year++) {
      totalValue += parseFloat(contribution);
      const yearReturn = historicalReturns[symbol][year] || 0;
      const yearGrowth = totalValue * yearReturn;
      totalValue += yearGrowth;

      yearlyBreakdown.push({
        year,
        startValue: totalValue - yearGrowth - parseFloat(contribution),
        contribution: parseFloat(contribution),
        return: yearReturn,
        growth: yearGrowth,
        endValue: totalValue
      });
    }

    setResult({
      totalValue,
      yearlyBreakdown,
      totalContributions: yearlyBreakdown.length * parseFloat(contribution),
      totalGrowth: totalValue - (yearlyBreakdown.length * parseFloat(contribution))
    });
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Investment Growth Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Annual Contribution ($)</label>
              <Input
                type="number"
                value={contribution}
                onChange={(e) => setContribution(e.target.value)}
                placeholder="5000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <Input
                type="date"
                value={startDate}
                min="1999-01-01"
                max="2024-12-31"
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Investment</label>
              <Select value={symbol} onValueChange={setSymbol}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(fundDescriptions).map(([sym, desc]) => (
                    <SelectItem key={sym} value={sym}>
                      {sym} - {desc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={calculateGrowth}
              disabled={!contribution || !startDate || !symbol}
            >
              Calculate
            </Button>
          </div>

          {result && (
            <div className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-800">Total Value</h4>
                  <p className="text-2xl font-bold text-green-900">
                    ${result.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800">Total Growth</h4>
                  <p className="text-2xl font-bold text-blue-900">
                    ${result.totalGrowth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left p-2">Year</th>
                      <th className="text-right p-2">Starting Value</th>
                      <th className="text-right p-2">Contribution</th>
                      <th className="text-right p-2">Return %</th>
                      <th className="text-right p-2">Growth</th>
                      <th className="text-right p-2">Ending Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.yearlyBreakdown.map((year) => (
                      <tr key={year.year} className="border-t">
                        <td className="p-2">{year.year}</td>
                        <td className="text-right p-2">${year.startValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td className="text-right p-2">${year.contribution.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td className="text-right p-2">{(year.return * 100).toFixed(2)}%</td>
                        <td className="text-right p-2">${year.growth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td className="text-right p-2">${year.endValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default InvestmentCalculator;
