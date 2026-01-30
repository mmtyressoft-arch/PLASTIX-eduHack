
import React, { useState, useEffect } from 'react';
import { TrendingUp, AlertCircle, CheckCircle2, Info, Loader2, Sparkles, BrainCircuit } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { MLPrediction } from '../types';

export const GradeForecasting: React.FC<{ studentId: string }> = ({ studentId }) => {
  const [prediction, setPrediction] = useState<MLPrediction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrediction = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('ml_predictions')
        .select('*')
        .eq('student_id', studentId)
        .order('prediction_date', { ascending: false })
        .limit(1)
        .single();

      if (!error && data) {
        setPrediction(data as any);
      }
      setLoading(false);
    };

    fetchPrediction();
  }, [studentId]);

  if (loading) {
    return (
      <div className="bg-white p-20 flex flex-col items-center justify-center border border-gray-200">
        <Loader2 className="animate-spin text-[#2f7dbd]" size={40} />
        <p className="mt-4 text-gray-500 text-sm font-medium">Running ML Academic Models...</p>
      </div>
    );
  }

  if (!prediction) {
    return (
      <div className="bg-white p-20 flex flex-col items-center justify-center border border-gray-200 text-center">
        <BrainCircuit size={60} className="text-gray-200 mb-4" />
        <h3 className="text-lg font-bold text-gray-700">No Predictions Available</h3>
        <p className="text-gray-500 max-w-md mx-auto mt-2">
          Your academic prediction model hasn't been generated yet. Please check back after the next evaluation cycle.
        </p>
      </div>
    );
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'text-green-600 bg-green-50 border-green-200';
      case 'Medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'High': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'Improving': return <TrendingUp className="text-green-500" size={20} />;
      case 'Declining': return <TrendingUp className="text-red-500 rotate-180" size={20} />;
      default: return <TrendingUp className="text-blue-500 rotate-90" size={20} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-[#2f7dbd] text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <Sparkles className="mr-2" size={22} />
            <span className="font-bold text-lg uppercase tracking-wide">AI Academic Forecasting</span>
          </div>
          <span className="text-[10px] opacity-80 uppercase font-bold tracking-widest">
            Last Updated: {new Date(prediction.prediction_date).toLocaleDateString()}
          </span>
        </div>
        
        <div className="p-6 grid grid-cols-1 lg:grid-cols-4 gap-8 items-center">
          {/* Main Prediction Score */}
          <div className="lg:col-span-1 flex flex-col items-center justify-center border-r border-gray-100 pr-8">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="absolute w-full h-full transform -rotate-90">
                <circle
                  cx="64" cy="64" r="58"
                  fill="transparent"
                  stroke="#f3f4f6"
                  strokeWidth="8"
                />
                <circle
                  cx="64" cy="64" r="58"
                  fill="transparent"
                  stroke="#2f7dbd"
                  strokeWidth="8"
                  strokeDasharray={364}
                  strokeDashoffset={364 - (prediction.predicted_gpa / 10) * 364}
                  strokeLinecap="round"
                />
              </svg>
              <div className="text-center">
                <div className="text-3xl font-black text-gray-800">{prediction.predicted_gpa}</div>
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Predicted GPA</div>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-4 border rounded-lg ${getRiskColor(prediction.risk_level)}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">Risk Status</span>
                {prediction.risk_level === 'Low' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              </div>
              <div className="text-xl font-bold">{prediction.risk_level} Risk</div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Trend</span>
                {getTrendIcon(prediction.performance_trend)}
              </div>
              <div className="text-xl font-bold text-gray-700">{prediction.performance_trend}</div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Confidence</span>
                <Info size={16} className="text-gray-400" />
              </div>
              <div className="text-xl font-bold text-gray-700">{prediction.confidence_score}%</div>
              <div className="w-full bg-gray-200 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-[#2f7dbd] h-full" style={{ width: `${prediction.confidence_score}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Factors */}
        <div className="bg-white shadow-sm border border-gray-200">
          <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 text-sm font-bold text-gray-700 uppercase flex items-center">
            <BrainCircuit size={16} className="mr-2 text-[#2f7dbd]" />
            Identified Risk Factors
          </div>
          <div className="p-4 space-y-3">
            {prediction.risk_factors && prediction.risk_factors.map((factor, idx) => (
              <div key={idx} className="flex items-start p-3 bg-red-50/50 rounded border border-red-100">
                <AlertCircle className="text-red-400 mr-3 mt-0.5 shrink-0" size={16} />
                <span className="text-sm text-gray-700">{factor}</span>
              </div>
            ))}
            {(!prediction.risk_factors || prediction.risk_factors.length === 0) && (
              <div className="text-center p-6 text-gray-400 italic text-sm">No significant risk factors detected.</div>
            )}
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="bg-white shadow-sm border border-gray-200">
          <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 text-sm font-bold text-gray-700 uppercase flex items-center">
            <Sparkles size={16} className="mr-2 text-yellow-600" />
            AI Academic Recommendation
          </div>
          <div className="p-6">
            <div className="relative p-5 bg-blue-50/30 rounded-lg border-l-4 border-[#2f7dbd]">
              <p className="text-gray-700 leading-relaxed italic">
                "{prediction.recommendation}"
              </p>
              <div className="mt-4 flex items-center text-[11px] text-[#2f7dbd] font-bold uppercase tracking-wider">
                <BrainCircuit size={14} className="mr-1" />
                Generated by SIS-Forecaster Engine v1.0
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Methodology Disclaimer */}
      <div className="bg-gray-50 border border-gray-200 p-4 rounded text-[11px] text-gray-500 flex items-start">
        <Info size={14} className="mr-2 mt-0.5 shrink-0" />
        <div>
          <span className="font-bold block mb-1">DATA SCIENCE NOTICE:</span>
          This prediction is generated based on historical attendance patterns, previous semester grades, and peer group analytics. 
          It is an estimation and does not guarantee final results. We recommend discussing these insights with your Faculty Advisor.
        </div>
      </div>
    </div>
  );
};
