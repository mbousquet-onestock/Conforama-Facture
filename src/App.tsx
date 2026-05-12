/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Printer, CreditCard, ShoppingBag, CheckCircle2 } from 'lucide-react';

// Pricing data (Based on Conforama.ch typical pricing)
const ITEMS = [
  {
    id: '607961',
    name: 'Fauteuil JADE - Terracotta',
    price: 129.95,
    quantity: 1,
    category: 'Mobilier'
  },
  {
    id: '618065',
    name: 'CANDY Réfri-congélateur combiné',
    price: 549.95,
    quantity: 1,
    category: 'Gros Electroménager'
  }
];

const VAT_RATE = 0.081; // Swiss VAT 8.1%

export default function App() {
  const [customerName] = useState('Jean Dupont');
  const [customerAddress] = useState('Rue du Mont-Blanc 12\n1201 Genève\nSuisse');
  const [isPrinting, setIsPrinting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const subtotal = ITEMS.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const vatAmount = subtotal * VAT_RATE;
  const total = subtotal + vatAmount;

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 100);
  };

  const invoiceNumber = `CH-${new Date().getFullYear()}-88492`;
  const invoiceDate = new Date().toLocaleDateString('fr-CH', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).replace(/\//g, '.');

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 flex flex-col items-center justify-center p-6">
      {/* Landing Page Content */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-12 rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full text-center space-y-8"
      >
        <div className="flex justify-center">
          <div className="bg-[#e2001a] text-white px-6 py-3 font-black text-3xl tracking-tighter uppercase italic">
            Conforama
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-black uppercase tracking-tight text-slate-800">Facturation & Services</h1>
          <p className="text-slate-500 font-medium tracking-wide">Gérez vos factures Conforama Suisse en toute simplicité.</p>
        </div>

        <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 text-left space-y-6 text-sm font-medium">
          <div className="flex justify-between items-center border-b border-slate-200 pb-4">
            <span className="text-[10px] uppercase tracking-widest font-black text-slate-400">Dernière Transaction</span>
            <span className="font-bold text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">{invoiceNumber}</span>
          </div>
          <div className="space-y-4">
            {ITEMS.map(item => (
              <div key={item.id} className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-slate-800 font-bold">{item.name}</span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest leading-none mt-1">Réf: {item.id}</span>
                </div>
                <span className="font-mono font-bold text-slate-900">{item.price.toFixed(2)} CHF</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center pt-6 border-t border-slate-200">
            <span className="text-sm font-black uppercase tracking-tight text-slate-400">Total à régler</span>
            <span className="text-2xl font-black text-[#e2001a] tracking-tight">{total.toFixed(2)} CHF</span>
          </div>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full bg-[#1A1A1A] text-white py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-slate-800 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-4 group"
        >
          <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
          Afficher la Facture
        </button>
      </motion.div>

      {/* Modal Overlay */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto px-4 py-16 bg-slate-900/60 backdrop-blur-md print:bg-white print:p-0 print:block">
            {/* Modal Container */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="relative w-full max-w-[210mm] print:max-w-none shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] print:shadow-none"
            >
              {/* Modal Controls (Not printed) */}
              <div className="absolute -top-16 right-0 flex gap-4 print:hidden">
                <button 
                  onClick={handlePrint}
                  className="flex items-center gap-3 px-8 py-3 bg-[#e2001a] text-white rounded-xl font-bold shadow-2xl hover:bg-red-700 transition-all text-xs uppercase tracking-widest active:scale-95"
                >
                  <Printer className="w-4 h-4" /> Exporter PDF
                </button>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="w-12 h-12 bg-white text-slate-900 rounded-xl flex items-center justify-center shadow-2xl hover:bg-slate-50 transition-all active:scale-95 group"
                >
                  <span className="text-3xl font-light leading-none group-hover:rotate-90 transition-transform">&times;</span>
                </button>
              </div>

              {/* The Invoice Document */}
              <div 
                ref={printRef}
                className="bg-white p-[20mm] flex flex-col min-h-[297mm] relative overflow-hidden transition-all print:p-0 print:min-h-0 shadow-inner"
              >
                {/* Header */}
                <header className="flex justify-between items-start mb-20">
                  <div className="flex flex-col">
                    <div className="bg-[#e2001a] text-white px-8 py-4 font-black text-5xl tracking-tighter mb-8 inline-block w-fit shadow-lg">
                      Conforama
                    </div>
                    <div className="text-[11px] text-slate-400 uppercase tracking-[0.25em] leading-relaxed font-bold">
                      Conforama Suisse SA<br />
                      Route de Reculon 1<br />
                      1030 Bussigny, Suisse
                    </div>
                  </div>
                  <div className="text-right">
                    <h1 className="text-7xl font-light text-slate-100 uppercase tracking-tighter mb-6">Facture</h1>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                      <span className="text-slate-400 font-black uppercase text-[10px] tracking-widest self-center text-right text-[9px]">Référence:</span>
                      <span className="font-black text-slate-900 text-left tracking-tight">{invoiceNumber}</span>
                      <span className="text-slate-400 font-black uppercase text-[10px] tracking-widest self-center text-right text-[9px]">Date:</span>
                      <span className="font-black text-slate-900 text-left tracking-tight">{invoiceDate}</span>
                      <span className="text-slate-400 font-black uppercase text-[10px] tracking-widest self-center text-right text-[9px]">Client N°:</span>
                      <span className="font-black text-slate-900 text-left tracking-tight">7721094</span>
                    </div>
                  </div>
                </header>

                {/* Client Details */}
                <div className="grid grid-cols-2 gap-24 mb-20">
                  <div className="border-l-4 border-slate-100 pl-8">
                    <h2 className="text-[10px] uppercase tracking-[0.2em] text-slate-300 font-black mb-6">Facturation</h2>
                    <div className="space-y-1">
                      <p className="text-2xl font-black text-slate-900 leading-none mb-2">{customerName}</p>
                      <pre className="text-slate-500 font-sans whitespace-pre-wrap leading-relaxed text-sm font-medium">{customerAddress}</pre>
                    </div>
                  </div>
                  <div className="border-l-4 border-[#e2001a] pl-8">
                    <h2 className="text-[10px] uppercase tracking-[0.2em] text-slate-300 font-black mb-6">Livraison</h2>
                    <div className="space-y-1">
                      <p className="text-2xl font-black text-slate-900 leading-none mb-2">{customerName}</p>
                      <pre className="text-slate-500 font-sans whitespace-pre-wrap leading-relaxed text-sm font-medium">{customerAddress}</pre>
                      <div className="mt-4 inline-block px-3 py-1 bg-red-50 text-[9px] uppercase tracking-widest font-black text-[#e2001a] rounded">
                        Livraison Spécialisée (Étage)
                      </div>
                    </div>
                  </div>
                </div>

                {/* Table */}
                <div className="flex-grow mb-20 text-sm">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b-2 border-slate-900 text-[10px] uppercase tracking-[0.3em] font-black text-slate-400">
                        <th className="py-5">Réf.</th>
                        <th className="py-5">Désignation</th>
                        <th className="py-5 text-right px-4">Prix</th>
                        <th className="py-5 text-center px-4">Qté</th>
                        <th className="py-5 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ITEMS.map((item) => (
                        <tr key={item.id} className="border-b border-slate-100">
                          <td className="py-8 font-mono text-[11px] text-slate-400 tracking-tighter">{item.id}</td>
                          <td className="py-8">
                            <p className="font-black text-slate-900 text-lg leading-tight mb-1">{item.name}</p>
                            <p className="text-[10px] text-slate-300 uppercase font-black tracking-widest">{item.category}</p>
                          </td>
                          <td className="py-8 text-right font-bold text-slate-500 px-4 whitespace-nowrap">{item.price.toFixed(2)}</td>
                          <td className="py-8 text-center font-black text-slate-900 px-4">{item.quantity}</td>
                          <td className="py-8 text-right font-black text-slate-900 text-lg whitespace-nowrap">{(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div className="flex justify-between items-end gap-16 mt-auto">
                  <div className="max-w-sm bg-slate-50 p-8 rounded-2xl text-[10px] leading-relaxed text-slate-400 font-bold uppercase tracking-widest border border-slate-100 italic">
                    <span className="text-slate-900 not-italic block mb-2 underline decoration-[#e2001a] decoration-2 underline-offset-4 tracking-normal">Garantie & TVA :</span>
                    TVA CHE-105.844.757 comprise. Cette facture fait office de bon de garantie pour une durée de 24 mois à compter de la date d'émission.
                  </div>
                  <div className="w-80 space-y-4">
                    <div className="flex justify-between text-slate-400 font-black uppercase text-[10px] tracking-[0.2em]">
                      <span>Sous-total HT</span>
                      <span className="text-slate-900 text-sm whitespace-nowrap">{subtotal.toFixed(2)} CHF</span>
                    </div>
                    <div className="flex justify-between text-slate-400 font-black uppercase text-[10px] tracking-[0.2em] border-b border-slate-100 pb-4">
                      <span>TVA (8.1%)</span>
                      <span className="text-slate-900 text-sm whitespace-nowrap">{vatAmount.toFixed(2)} CHF</span>
                    </div>
                    <div className="flex justify-between items-center pt-4">
                      <span className="text-2xl font-black uppercase tracking-tighter text-slate-400">Total Net</span>
                      <span className="text-4xl font-black text-[#e2001a] tracking-tight whitespace-nowrap">{total.toFixed(2)} CHF</span>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <footer className="mt-24 pt-8 border-t-2 border-slate-900 flex justify-between items-center text-[10px] text-slate-300 uppercase font-black tracking-[0.25em]">
                  <div className="flex gap-10">
                    <span className="flex items-center gap-3"><CreditCard className="w-4 h-4 text-slate-200" /> Paiement Visa</span>
                    <span className="flex items-center gap-3 text-green-500"><CheckCircle2 className="w-4 h-4" /> Validé</span>
                  </div>
                  <span className="text-slate-400 font-bold">© Conforama Suisse SA</span>
                </footer>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        @media print {
          @page {
            margin: 0;
            size: A4;
          }
          body {
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .min-h-screen {
            background: white !important;
            padding: 0 !important;
            display: block !important;
          }
          .fixed {
            position: absolute !important;
            background: white !important;
            padding: 0 !important;
            overflow: visible !important;
            display: block !important;
          }
          .shadow-2xl, .shadow-xl, .shadow-lg, .shadow-md, .shadow-sm, .shadow-inner {
            box-shadow: none !important;
          }
          .min-h-[297mm] {
            min-height: auto !important;
            border: none !important;
          }
        }
      `}</style>
    </div>
  );
}
