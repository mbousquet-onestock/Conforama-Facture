/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Printer, Download, CreditCard, ShoppingBag, MapPin, Phone, Mail, ChevronRight, CheckCircle2 } from 'lucide-react';

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
  const [customerName, setCustomerName] = useState('Jean Dupont');
  const [customerAddress, setCustomerAddress] = useState('Rue du Mont-Blanc 12\n1201 Genève\nSuisse');
  const [isPrinting, setIsPrinting] = useState(false);
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
    <div className={`min-h-screen ${isPrinting ? 'bg-white' : 'bg-slate-200'} font-sans text-slate-900 flex flex-col items-center py-0 md:py-12 px-0`}>
      <div className={`w-full max-w-[210mm] shadow-2xl transition-all duration-300 ${isPrinting ? 'shadow-none' : ''}`}>
        
        {/* Floating Print Action (Not printed) */}
        {!isPrinting && (
          <div className="fixed bottom-8 right-8 z-50">
            <button 
              onClick={handlePrint}
              className="flex items-center gap-3 px-6 py-4 bg-[#e2001a] text-white rounded-full font-bold shadow-2xl hover:scale-105 active:scale-95 transition-all"
              title="Imprimer la facture"
            >
              <Printer className="w-6 h-6" />
              <span className="hidden md:inline uppercase tracking-widest text-xs">Imprimer / PDF</span>
            </button>
          </div>
        )}

        {/* The Invoice Document (A4 Ratio) */}
        <motion.div 
          ref={printRef}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-white p-[15mm] md:p-[20mm] flex flex-col min-h-[297mm] relative overflow-hidden ${isPrinting ? 'p-0 shadow-none border-none' : 'border border-slate-300'}`}
        >
          {/* Main Invoice Header */}

          <header className="flex justify-between items-start mb-16">
            <div className="flex flex-col">
              <div className="bg-[#e2001a] text-white px-6 py-3 font-black text-4xl tracking-tighter mb-6 inline-block w-fit">
                Conforama
              </div>
              <div className="text-[11px] text-slate-500 uppercase tracking-[0.2em] leading-relaxed font-medium">
                Conforama Suisse SA<br />
                Route de Reculon 1<br />
                1030 Bussigny, Suisse
              </div>
            </div>
            <div className="text-right">
              <h1 className="text-6xl font-light text-slate-200 uppercase tracking-tighter mb-4">Facture</h1>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
                <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest self-center">N° Facture:</span>
                <span className="font-bold text-slate-900">{invoiceNumber}</span>
                <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest self-center">Date:</span>
                <span className="font-bold text-slate-900">{invoiceDate}</span>
                <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest self-center">N° Client:</span>
                <span className="font-bold text-slate-900">7721094</span>
              </div>
            </div>
          </header>

          {/* Client & Billing Details */}
          <div className="grid grid-cols-2 gap-20 mb-16">
            <div className="border-l-4 border-slate-200 pl-8">
              <h2 className="text-[10px] uppercase tracking-widest text-slate-400 font-black mb-4">Adresse de facturation</h2>
              <div className="space-y-1">
                <p className="text-xl font-black text-slate-900">{customerName}</p>
                <pre className="text-slate-600 font-sans whitespace-pre-wrap leading-relaxed">{customerAddress}</pre>
              </div>
            </div>
            <div className="border-l-4 border-[#e2001a] pl-8">
              <h2 className="text-[10px] uppercase tracking-widest text-slate-400 font-black mb-4">Lieu de livraison</h2>
              <div className="space-y-1">
                <p className="text-xl font-black text-slate-900">{customerName}</p>
                <pre className="text-slate-600 font-sans whitespace-pre-wrap leading-relaxed">{customerAddress}</pre>
                <p className="text-[10px] uppercase tracking-widest font-bold text-[#e2001a] mt-2 italic">Transport spécialisée (Étage)</p>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="flex-grow mb-16">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-900 text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">
                  <th className="py-4 pr-4">Référence</th>
                  <th className="py-4">Description de l'article</th>
                  <th className="py-4 text-right">Prix Unitaire</th>
                  <th className="py-4 text-center">Qté</th>
                  <th className="py-4 text-right">Total (CHF)</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {ITEMS.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100 group transition-colors hover:bg-slate-50/50">
                    <td className="py-6 font-mono text-xs text-slate-400 tracking-tight">{item.id}</td>
                    <td className="py-6">
                      <p className="font-bold text-slate-900 text-base">{item.name}</p>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">{item.category}</p>
                    </td>
                    <td className="py-6 text-right font-medium text-slate-600">{item.price.toFixed(2)}</td>
                    <td className="py-6 text-center font-bold text-slate-900">{item.quantity}</td>
                    <td className="py-6 text-right font-black text-slate-900">{(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Section */}
          <div className="flex justify-between items-end gap-12">
            <div className="max-w-md bg-slate-50 p-6 rounded-lg text-[10px] leading-relaxed text-slate-500 border border-slate-200 font-medium italic">
              <strong className="text-slate-700 not-italic uppercase tracking-widest block mb-1">Informations TVA & Garantie:</strong>
              No TVA CHE-105.844.757. Le montant inclut la Taxe sur la Valeur Ajoutée (TVA) en vigueur. 
              Veuillez conserver cette facture comme preuve d'achat pour la garantie. Conforama s'engage à vous fournir des produits de qualité.
            </div>
            <div className="w-80 space-y-3">
              <div className="flex justify-between py-1 text-slate-500 font-bold uppercase text-[10px] tracking-widest">
                <span>Sous-total HT</span>
                <span className="text-sm font-bold text-slate-900">{subtotal.toFixed(2)} CHF</span>
              </div>
              <div className="flex justify-between py-1 text-slate-500 font-bold uppercase text-[10px] tracking-widest border-b border-slate-200 pb-3">
                <span>TVA (8.1%)</span>
                <span className="text-sm font-bold text-slate-900">{vatAmount.toFixed(2)} CHF</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-2xl font-black tracking-tighter uppercase">TOTAL</span>
                <span className="text-4xl font-black text-[#e2001a] tracking-tight">{total.toFixed(2)} CHF</span>
              </div>
            </div>
          </div>

          {/* Footer Styling */}
          <footer className="mt-20 pt-8 border-t-2 border-slate-900 flex justify-between items-center">
            <div className="flex gap-8">
              <div className="flex items-center gap-2 text-[10px] text-slate-400 uppercase font-black tracking-[0.15em]">
                <CreditCard className="w-3 h-3 text-slate-300" /> Mode de paiement: Visa ****4412
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-400 uppercase font-black tracking-[0.15em]">
                <CheckCircle2 className="w-3 h-3 text-green-500" /> Statut: Règlement Reçu
              </div>
            </div>
            <div className="flex gap-3">
              <span className="w-2 h-2 rounded-full bg-[#e2001a]"></span>
              <span className="w-2 h-2 rounded-full bg-slate-200"></span>
              <span className="w-2 h-2 rounded-full bg-slate-200"></span>
            </div>
          </footer>
        </motion.div>
      </div>

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
            padding: 0 !important;
            background: white !important;
          }
          .min-h-[297mm] {
             min-height: auto !important;
          }
        }
      `}</style>
    </div>
  );
}

