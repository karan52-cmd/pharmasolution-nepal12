import React, { useState } from 'react';
import { Calculator, Activity, Baby, Droplets, RotateCcw, Info, ChevronDown } from 'lucide-react';

const ClinicalToolsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'bmi' | 'dosage' | 'iv'>('bmi');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-blue-600 rounded-xl text-white">
           <Calculator size={24} />
        </div>
        <div>
           <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Clinical Tools</h2>
           <p className="text-slate-500 dark:text-slate-400">WHO-standard calculators for pharmacy practice.</p>
        </div>
      </div>

      <div className="flex bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 w-fit overflow-x-auto">
        <button 
          onClick={() => setActiveTab('bmi')}
          className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors whitespace-nowrap ${activeTab === 'bmi' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
        >
          <Activity size={16} /> BMI (Adult)
        </button>
        <button 
          onClick={() => setActiveTab('dosage')}
          className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors whitespace-nowrap ${activeTab === 'dosage' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
        >
          <Baby size={16} /> Pediatric Dosage
        </button>
        <button 
          onClick={() => setActiveTab('iv')}
          className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors whitespace-nowrap ${activeTab === 'iv' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
        >
          <Droplets size={16} /> IV Rate
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 min-h-[400px]">
        {activeTab === 'bmi' && <BMICalculator />}
        {activeTab === 'dosage' && <DosageCalculator />}
        {activeTab === 'iv' && <IVCalculator />}
      </div>
    </div>
  );
};

const BMICalculator = () => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [result, setResult] = useState<{bmi: number, category: string, color: string} | null>(null);

  const calculate = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100; // convert cm to m
    if (w && h) {
      const bmi = w / (h * h);
      let category = '';
      let color = '';

      // WHO Adult Classifications
      if (bmi < 18.5) {
        category = 'Underweight';
        color = 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30';
      } else if (bmi >= 18.5 && bmi <= 24.9) {
        category = 'Normal weight';
        color = 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
      } else if (bmi >= 25.0 && bmi <= 29.9) {
        category = 'Pre-obesity (Overweight)';
        color = 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30';
      } else if (bmi >= 30.0 && bmi <= 34.9) {
        category = 'Obesity Class I';
        color = 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
      } else if (bmi >= 35.0 && bmi <= 39.9) {
        category = 'Obesity Class II';
        color = 'text-red-700 dark:text-red-400 bg-red-200 dark:bg-red-900/40';
      } else {
        category = 'Obesity Class III';
        color = 'text-red-800 dark:text-red-400 bg-red-300 dark:bg-red-900/50';
      }
      
      setResult({ bmi: parseFloat(bmi.toFixed(1)), category, color });
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white">Body Mass Index (BMI)</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Based on WHO Adult Classification.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Weight (kg)</label>
          <input type="number" value={weight} onChange={e => setWeight(e.target.value)} className="w-full px-4 py-3 border rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 70" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Height (cm)</label>
          <input type="number" value={height} onChange={e => setHeight(e.target.value)} className="w-full px-4 py-3 border rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 175" />
        </div>
        <button onClick={calculate} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors">Calculate BMI</button>
      </div>

      {result && (
        <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-700/50 rounded-xl text-center border border-slate-200 dark:border-slate-600 animate-in fade-in slide-in-from-bottom-4">
           <div className="text-sm text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider mb-1">Your BMI</div>
           <div className="text-4xl font-bold text-slate-800 dark:text-white mb-3">{result.bmi}</div>
           <div className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold ${result.color}`}>
             {result.category}
           </div>
        </div>
      )}
    </div>
  );
};

type DosageMethod = 'weight' | 'young' | 'fried' | 'clark';

const DosageCalculator = () => {
  const [method, setMethod] = useState<DosageMethod>('weight');
  
  // Inputs
  const [weight, setWeight] = useState(''); // kg
  const [ageMonths, setAgeMonths] = useState('');
  const [ageYears, setAgeYears] = useState('');
  const [adultDose, setAdultDose] = useState('');
  const [dosePerKg, setDosePerKg] = useState('');
  
  const [result, setResult] = useState<{dose: number, unit: string, note: string} | null>(null);

  const reset = () => {
    setWeight('');
    setAgeMonths('');
    setAgeYears('');
    setAdultDose('');
    setDosePerKg('');
    setResult(null);
  };

  const calculate = () => {
    let dose = 0;
    let note = '';

    if (method === 'weight') {
      const w = parseFloat(weight);
      const d = parseFloat(dosePerKg);
      if (w && d) {
        dose = w * d;
        note = 'Based on Body Weight (Clinical Standard)';
      }
    } else if (method === 'young') {
      const a = parseFloat(ageYears);
      const d = parseFloat(adultDose);
      if (a && d) {
        // Young's Rule: (Age / (Age + 12)) * Adult Dose
        dose = (a / (a + 12)) * d;
        note = "Based on Young's Rule (Age 1-12 yrs)";
      }
    } else if (method === 'fried') {
      const m = parseFloat(ageMonths);
      const d = parseFloat(adultDose);
      if (m && d) {
        // Fried's Rule: (Age in Months / 150) * Adult Dose
        dose = (m / 150) * d;
        note = "Based on Fried's Rule (Infants < 1 yr)";
      }
    } else if (method === 'clark') {
      const w = parseFloat(weight);
      const d = parseFloat(adultDose);
      if (w && d) {
        // Clark's Rule: (Weight in Kg / 70) * Adult Dose
        dose = (w / 70) * d;
        note = "Based on Clark's Rule (Weight Ratio)";
      }
    }

    if (dose > 0) {
      setResult({
        dose: parseFloat(dose.toFixed(2)),
        unit: 'mg',
        note
      });
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white">Pediatric Dosage Calculator</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Select a formula relevant to the patient.</p>
      </div>

      <div className="relative">
        <select 
          value={method} 
          onChange={(e) => { setMethod(e.target.value as DosageMethod); reset(); }}
          className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl appearance-none bg-white dark:bg-slate-700 font-medium text-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="weight">Weight Based (mg/kg) - WHO Standard</option>
          <option value="young">Young's Rule (Age 1-12 Years)</option>
          <option value="fried">Fried's Rule (Infants &lt; 1 Year)</option>
          <option value="clark">Clark's Rule (Weight Based)</option>
        </select>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
      </div>

      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
        {/* Inputs based on method */}
        {method === 'weight' && (
          <>
            <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-900/50 p-3 rounded-lg flex gap-2 items-start">
               <Info size={16} className="text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
               <p className="text-xs text-blue-800 dark:text-blue-200">Gold Standard: Uses exact weight and drug specific coefficient.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Child's Weight (kg)</label>
              <input type="number" value={weight} onChange={e => setWeight(e.target.value)} className="w-full px-4 py-3 border rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 12" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Dose per kg (mg/kg)</label>
              <input type="number" value={dosePerKg} onChange={e => setDosePerKg(e.target.value)} className="w-full px-4 py-3 border rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 10 (Paracetamol)" />
            </div>
          </>
        )}

        {method === 'young' && (
          <>
            <div className="bg-orange-50 dark:bg-orange-900/30 border border-orange-100 dark:border-orange-900/50 p-3 rounded-lg flex gap-2 items-start">
               <Info size={16} className="text-orange-600 dark:text-orange-400 mt-0.5 shrink-0" />
               <p className="text-xs text-orange-800 dark:text-orange-200">Formula: (Age / (Age + 12)) × Adult Dose. Use for children 1-12 years.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Child's Age (Years)</label>
              <input type="number" value={ageYears} onChange={e => setAgeYears(e.target.value)} className="w-full px-4 py-3 border rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 5" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Adult Dose (mg)</label>
              <input type="number" value={adultDose} onChange={e => setAdultDose(e.target.value)} className="w-full px-4 py-3 border rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 500" />
            </div>
          </>
        )}

        {method === 'fried' && (
          <>
            <div className="bg-purple-50 dark:bg-purple-900/30 border border-purple-100 dark:border-purple-900/50 p-3 rounded-lg flex gap-2 items-start">
               <Info size={16} className="text-purple-600 dark:text-purple-400 mt-0.5 shrink-0" />
               <p className="text-xs text-purple-800 dark:text-purple-200">Formula: (Age in Months / 150) × Adult Dose. Use for infants &lt; 1 year.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Child's Age (Months)</label>
              <input type="number" value={ageMonths} onChange={e => setAgeMonths(e.target.value)} className="w-full px-4 py-3 border rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 8" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Adult Dose (mg)</label>
              <input type="number" value={adultDose} onChange={e => setAdultDose(e.target.value)} className="w-full px-4 py-3 border rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 500" />
            </div>
          </>
        )}

        {method === 'clark' && (
          <>
            <div className="bg-teal-50 dark:bg-teal-900/30 border border-teal-100 dark:border-teal-900/50 p-3 rounded-lg flex gap-2 items-start">
               <Info size={16} className="text-teal-600 dark:text-teal-400 mt-0.5 shrink-0" />
               <p className="text-xs text-teal-800 dark:text-teal-200">Formula: (Weight kg / 70) × Adult Dose. Assumes average adult weight of 70kg.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Child's Weight (kg)</label>
              <input type="number" value={weight} onChange={e => setWeight(e.target.value)} className="w-full px-4 py-3 border rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 20" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Adult Dose (mg)</label>
              <input type="number" value={adultDose} onChange={e => setAdultDose(e.target.value)} className="w-full px-4 py-3 border rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 500" />
            </div>
          </>
        )}

        <button onClick={calculate} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors">
          Calculate Dose
        </button>
      </div>

      {result !== null && (
        <div className="mt-8 p-6 bg-green-50 dark:bg-green-900/30 rounded-xl text-center border border-green-100 dark:border-green-900/50 animate-in fade-in slide-in-from-bottom-4">
           <div className="text-sm text-green-600 dark:text-green-400 uppercase font-bold tracking-wider mb-1">Calculated Dose</div>
           <div className="text-4xl font-bold text-green-700 dark:text-green-300 mb-2">{result.dose} <span className="text-lg text-green-600 dark:text-green-400">{result.unit}</span></div>
           <p className="text-xs text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/50 inline-block px-3 py-1 rounded-full">{result.note}</p>
        </div>
      )}
    </div>
  );
};

const IVCalculator = () => {
  const [volume, setVolume] = useState('');
  const [time, setTime] = useState('');
  const [dropFactor, setDropFactor] = useState('20');
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    const v = parseFloat(volume);
    const t = parseFloat(time); // in hours
    const df = parseFloat(dropFactor);
    
    if (v && t && df) {
      // Formula: (Volume (ml) * Drop Factor (gtts/ml)) / Time (min)
      const rate = (v * df) / (t * 60);
      setResult(Math.round(rate));
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white">IV Drip Rate Calculator</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Calculate flow rate in drops per minute (gtts/min).</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Total Volume (ml)</label>
          <input type="number" value={volume} onChange={e => setVolume(e.target.value)} className="w-full px-4 py-3 border rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 1000" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Time (Hours)</label>
            <input type="number" value={time} onChange={e => setTime(e.target.value)} className="w-full px-4 py-3 border rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 8" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Drop Factor</label>
            <select value={dropFactor} onChange={e => setDropFactor(e.target.value)} className="w-full px-4 py-3 border rounded-xl bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="10">10 gtts/ml (Macro)</option>
              <option value="15">15 gtts/ml (Macro)</option>
              <option value="20">20 gtts/ml (Standard)</option>
              <option value="60">60 gtts/ml (Micro)</option>
            </select>
          </div>
        </div>
        <button onClick={calculate} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors">Calculate Rate</button>
      </div>

      {result !== null && (
        <div className="mt-8 p-6 bg-purple-50 dark:bg-purple-900/30 rounded-xl text-center border border-purple-100 dark:border-purple-900/50 animate-in fade-in slide-in-from-bottom-4">
           <div className="text-sm text-purple-600 dark:text-purple-400 uppercase font-bold tracking-wider mb-1">Flow Rate</div>
           <div className="text-4xl font-bold text-purple-700 dark:text-purple-300">{result} gtts/min</div>
           <p className="text-xs text-purple-500 dark:text-purple-400 mt-2">Adjust the roller clamp to match this rate.</p>
        </div>
      )}
    </div>
  );
};

export default ClinicalToolsView;