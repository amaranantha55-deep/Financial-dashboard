import React, { useState } from 'react';
import { LoanEmiData } from '../../types/finance';
import { formatCurrency } from '../../lib/utils';
import { exportAmortizationCSV } from '../../lib/exportUtils';
import { X, Download, Table, Calendar } from 'lucide-react';
import { Button } from '../ui/button';

interface AmortizationModalProps {
  loan: LoanEmiData;
  currency: string;
  isOpen: boolean;
  onClose: () => void;
}

export const AmortizationModal: React.FC<AmortizationModalProps> = ({
  loan,
  currency,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  // Generate full year-by-year schedule
  const schedule = [];
  let balance = loan.principal;

  for (let year = 1; year <= loan.tenureYears; year++) {
    const startBal = balance;
    const yearlyInterest = balance * (loan.interestRate / 100);
    const yearlyPayment = loan.emi * 12;
    const yearlyPrincipal = Math.min(balance, yearlyPayment - yearlyInterest);
    const endBal = Math.max(0, balance - yearlyPrincipal);

    schedule.push({
      year,
      startBal: Math.round(startBal),
      principalPaid: Math.round(yearlyPrincipal),
      interestPaid: Math.round(yearlyInterest),
      totalPaid: Math.round(yearlyPrincipal + yearlyInterest),
      endBal: Math.round(endBal)
    });

    balance = endBal;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/15 text-amber-400">
              <Table className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white">
                Complete Loan Amortization Schedule
              </h3>
              <p className="text-xs text-slate-400">
                {formatCurrency(loan.principal, currency)} at {loan.interestRate}% for {loan.tenureYears} Years ({loan.tenureYears * 12} Payments)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => exportAmortizationCSV(loan, currency)}
              className="text-xs text-slate-300 hover:text-white border-slate-700 h-8 flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </Button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Schedule Table */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Year</th>
                  <th className="py-2.5 px-3">Opening Principal</th>
                  <th className="py-2.5 px-3 text-emerald-400">Principal Paid</th>
                  <th className="py-2.5 px-3 text-amber-400">Interest Paid</th>
                  <th className="py-2.5 px-3">Total Annual Outflow</th>
                  <th className="py-2.5 px-3 text-right">Closing Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {schedule.map((row) => (
                  <tr key={row.year} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-slate-200">
                      Year {row.year}
                    </td>
                    <td className="py-2.5 px-3">
                      {formatCurrency(row.startBal, currency)}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-emerald-400">
                      {formatCurrency(row.principalPaid, currency)}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-amber-400">
                      {formatCurrency(row.interestPaid, currency)}
                    </td>
                    <td className="py-2.5 px-3">
                      {formatCurrency(row.totalPaid, currency)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-white">
                      {formatCurrency(row.endBal, currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Summary */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 px-4">
          <span>
            Monthly Payment: <strong className="text-white">{formatCurrency(loan.emi, currency)}/mo</strong>
          </span>
          <span className="flex items-center gap-1 text-amber-400 font-semibold">
            Total Lifetime Interest: {formatCurrency(loan.totalInterest, currency)}
          </span>
        </div>
      </div>
    </div>
  );
};

