
import React from 'react';
import { SQLProblem, TableColumn, SampleRow } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface ProblemDisplayProps {
  problem: SQLProblem;
}

const ProblemDisplay: React.FC<ProblemDisplayProps> = ({ problem }) => {
  const { t } = useLanguage();

  return (
    <div className="bg-white dark:bg-slate-800 shadow-lg rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold text-sky-700 dark:text-sky-400 mb-4">{t('problemDisplayTitle')}</h2>
      <p className="text-slate-700 dark:text-slate-300 mb-6 whitespace-pre-wrap">{problem.problemStatement}</p>

      <div className="mb-6">
        <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-2">
          {t('tableLabel')} <span className="font-mono bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded text-sm">{problem.tableName}</span>
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{t('schemaLabel')}</p>
        <ul className="list-disc list-inside pl-4 space-y-1 text-sm text-slate-700 dark:text-slate-300">
          {problem.tableSchema.map((col: TableColumn) => (
            <li key={col.columnName}>
              <span className="font-mono font-medium">{col.columnName}</span>: <span className="font-mono text-slate-500 dark:text-slate-400">{col.dataType}</span>
              {col.description && <span className="italic text-slate-500 dark:text-slate-400"> - {col.description}</span>}
            </li>
          ))}
        </ul>
      </div>

      {problem.sampleData && problem.sampleData.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-2">{t('sampleDataLabel')}</h3>
          <div className="overflow-x-auto rounded-md border border-slate-300 dark:border-slate-700">
            <table className="min-w-full text-sm text-left text-slate-500 dark:text-slate-400">
              <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-700">
                <tr>
                  {Object.keys(problem.sampleData[0]).map((header) => (
                    <th key={header} scope="col" className="px-4 py-2 font-semibold">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {problem.sampleData.map((row: SampleRow, rowIndex: number) => (
                  <tr key={rowIndex} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600/50">
                    {Object.values(row).map((value, cellIndex) => (
                      <td key={cellIndex} className="px-4 py-2 font-mono">{String(value === null ? 'NULL' : value)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProblemDisplay;
