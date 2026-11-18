import React from 'react';
import { translations, SupportedLocale, formatINR } from '../../lib/i18n';
import { calculateSipVsFd } from '../../lib/mockResponses';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Table as TableIcon, CheckCircle2, XCircle, ArrowUpRight, Flame, ShieldCheck } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface ComparisonTableProps {
  monthlyAmount?: number;
  tenureYears?: number;
  sipCagr?: number;
  fdApy?: number;
  locale?: SupportedLocale;
  className?: string;
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({
  monthlyAmount = 10000,
  tenureYears = 10,
  sipCagr = 12.5,
  fdApy = 6.8,
  locale = 'en',
  className,
}) => {
  const t = translations[locale];
  const sipData = calculateSipVsFd(monthlyAmount, tenureYears, sipCagr, fdApy);
  const totalInvested = monthlyAmount * tenureYears * 12;

  const rows = [
    {
      metric: t.expectedCagr,
      sip: `~${sipCagr}% CAGR (${locale === 'hi' ? 'ऐतिहासिक' : 'Historical Avg'})`,
      fd: `~${fdApy}% APY (${locale === 'hi' ? 'निश्चित ब्याज दर' : 'Guaranteed Fixed Rate'})`,
      highlight: 'sip'
    },
    {
      metric: t.riskLevel,
      sip: locale === 'hi' ? 'मध्यम-उच्च (बाजार उतार-चढ़ाव)' : 'Moderate-High (Market Linked)',
      fd: locale === 'hi' ? 'शून्य (बैंक गारंटी)' : 'Very Low (Bank Backed)',
      highlight: 'fd'
    },
    {
      metric: t.capitalSafety,
      sip: locale === 'hi' ? 'कोई गारंटी नहीं (दीर्घकालिक विकास)' : 'No Guarantee (Capital Growth)',
      fd: locale === 'hi' ? '₹5 लाख तक DICGC बीमा सुरक्षित' : 'DICGC Insured up to ₹5 Lakh',
      highlight: 'fd'
    },
    {
      metric: t.inflationBeat,
      sip: locale === 'hi' ? 'हाँ (6-7% शुद्ध सकारात्मक रिटर्न)' : 'Yes (~6.5% Real Return over inflation)',
      fd: locale === 'hi' ? 'सीमित (मुद्रास्फीति पश्चात ~0-1%)' : 'Marginal (~0.5-1% Real Return)',
      highlight: 'sip'
    },
    {
      metric: t.taxEfficiency,
      sip: locale === 'hi' ? '12.5% LTCG (₹1.25L सालाना छूट)' : '12.5% LTCG (₹1.25L/yr exemption)',
      fd: locale === 'hi' ? 'आयकर स्लैब के अनुसार (TDS कटौती)' : 'Taxed at Income Tax Slab + TDS',
      highlight: 'sip'
    },
    {
      metric: `${tenureYears}Y ${t.tenYearValue}`,
      sip: formatINR(sipData.sipMaturity, { locale }),
      fd: formatINR(sipData.fdMaturity, { locale }),
      highlight: 'sip',
      bold: true
    },
    {
      metric: t.wealthCreated,
      sip: `+${formatINR(sipData.sipTotalWealthGain, { locale })}`,
      fd: `+${formatINR(sipData.fdTotalWealthGain, { locale })}`,
      highlight: 'sip',
      bold: true
    }
  ];

  return (
    <Card 
      className={cn("bg-slate-900/90 border-slate-800 text-slate-100 shadow-md overflow-hidden", className)}
      role="region"
      aria-label={t.sipVsFdTitle}
    >
      <CardHeader className="p-4 pb-2 border-b border-slate-800/80">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-purple-500/15 text-purple-400">
              <TableIcon className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold text-white">
                {t.sipVsFdTitle}
              </CardTitle>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {formatINR(monthlyAmount, { locale })}/mo ({t.chartInvested}: {formatINR(totalInvested, { locale })})
              </p>
            </div>
          </div>

          <Badge variant="purple" className="text-[11px]">
            {tenureYears} {t.year} Analysis
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table 
            className="w-full text-left text-xs border-collapse"
            role="table"
            aria-label={`${t.sipVsFdTitle} Comparison Matrix`}
          >
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-300">
                <th scope="col" className="py-3 px-4 font-semibold text-[11px] uppercase tracking-wider text-slate-400 w-1/3">
                  {t.metric}
                </th>
                <th scope="col" className="py-3 px-4 font-bold text-xs text-purple-300 w-1/3 bg-purple-950/20 border-l border-r border-slate-800/80">
                  <div className="flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-purple-400" />
                    <span>{t.sipMutualFund}</span>
                  </div>
                </th>
                <th scope="col" className="py-3 px-4 font-bold text-xs text-sky-300 w-1/3">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                    <span>{t.bankFd}</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {rows.map((row, index) => (
                <tr 
                  key={index} 
                  className={cn(
                    "hover:bg-slate-800/30 transition-colors",
                    row.bold && "bg-slate-950/40 font-bold"
                  )}
                >
                  <td className="py-2.5 px-4 font-medium text-slate-300">
                    {row.metric}
                  </td>
                  <td className={cn(
                    "py-2.5 px-4 bg-purple-950/10 border-l border-r border-slate-800/80",
                    row.highlight === 'sip' ? "text-purple-300 font-semibold" : "text-slate-300",
                    row.bold && "text-emerald-400 text-sm font-extrabold"
                  )}>
                    {row.sip}
                  </td>
                  <td className={cn(
                    "py-2.5 px-4",
                    row.highlight === 'fd' ? "text-sky-300 font-semibold" : "text-slate-400",
                    row.bold && "text-slate-200 text-sm font-bold"
                  )}>
                    {row.fd}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Wealth Delta Summary */}
        <div className="p-3 bg-purple-950/30 border-t border-purple-500/20 flex flex-wrap items-center justify-between gap-2 px-4 text-xs">
          <span className="text-slate-300">
            {locale === 'hi' ? 'SIP द्वारा अतिरिक्त धन निर्माण:' : 'SIP Outperformance Advantage:'}
          </span>
          <span className="font-extrabold text-emerald-400 text-sm flex items-center gap-1">
            <ArrowUpRight className="w-4 h-4" />
            +{formatINR(sipData.sipMaturity - sipData.fdMaturity, { locale })}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

