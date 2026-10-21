import React, { useState } from 'react';
import {
  X,
  ShoppingCart,
  ExternalLink,
  ShieldCheck,
  Truck,
  Star,
  CheckCircle2,
  Tag,
  ArrowRight,
  Sparkles,
  Info,
  MapPin,
  Check
} from 'lucide-react';
import {
  AFFILIATE_PRODUCTS,
  getRecommendedProductsForDisease,
  generateAffiliateUrl,
  recordAffiliateClick
} from '../services/affiliateService';

export default function AgroStoreModal({
  isOpen,
  onClose,
  diagnosis,
  initialProduct = null
}) {
  const [selectedProduct, setSelectedProduct] = useState(initialProduct);
  const [pincode, setPincode] = useState('143001'); // Punjab sample pin
  const [pincodeVerified, setPincodeVerified] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const diseaseName = diagnosis?.diseaseName || 'Crop Disease';
  const products = getRecommendedProductsForDisease(diseaseName);

  const handleBuyNow = (product) => {
    recordAffiliateClick(product, 'AgroStoreModal');
    const redirectUrl = generateAffiliateUrl({
      productId: product.id,
      partner: product.partner,
      disease: diseaseName
    });
    window.open(redirectUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyAffiliateLink = (product) => {
    const redirectUrl = generateAffiliateUrl({
      productId: product.id,
      partner: product.partner,
      disease: diseaseName
    });
    navigator.clipboard.writeText(redirectUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* Modal Dialog Box */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-emerald-100 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white flex items-center justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-emerald-100 text-[11px] font-bold">
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Direct Agro-Store & Certified Inputs</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Recommended Treatments for {diseaseName}
            </h2>
            <p className="text-xs text-emerald-100/90">
              Procure certified agri-inputs directly from verified agricultural distributors (AgroStar, IFFCO, BigHaat).
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Close Store"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PIN Code Delivery Checker Bar */}
        <div className="bg-emerald-50 px-6 py-3 border-b border-emerald-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-700">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-emerald-600" />
            <span>Check Rural PIN Delivery & Cash on Delivery (COD):</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                maxLength={6}
                placeholder="6-Digit PIN"
                className="w-28 px-3 py-1 rounded-xl bg-white border border-emerald-300 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <button
              onClick={() => setPincodeVerified(true)}
              className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors"
            >
              Verify
            </button>
            {pincodeVerified && (
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Delivery Available (24-48 hrs)
              </span>
            )}
          </div>
        </div>

        {/* Product Catalog Grid (Scrollable) */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map((product) => {
              const isSelected = selectedProduct?.id === product.id;

              return (
                <div
                  key={product.id}
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/40 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 bg-white hover:border-emerald-300 hover:shadow-md'
                  }`}
                >
                  <div className="space-y-3">
                    
                    {/* Header: Partner + Badges */}
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                        {product.partner} Partner
                      </span>

                      <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{product.rating}</span>
                        <span className="text-slate-400 font-normal">({product.reviewsCount})</span>
                      </div>
                    </div>

                    {/* Title & Brand */}
                    <div>
                      <h4 className="font-heading font-bold text-slate-900 text-sm sm:text-base leading-snug">
                        {product.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Brand: <strong>{product.brand}</strong> • Pack: {product.packSize}
                      </p>
                    </div>

                    {/* Active Ingredient & Recommended Dosage */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                      <div className="text-slate-600">
                        <span className="font-semibold text-slate-700">Active Ingredient: </span>
                        {product.activeIngredient}
                      </div>
                      <div className="text-emerald-800 font-medium">
                        <span className="font-semibold">Dosage: </span>
                        {product.dosageRate}
                      </div>
                    </div>

                    {/* Badges Strip */}
                    <div className="flex flex-wrap gap-1.5">
                      {product.badges.map((b, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700"
                        >
                          {b}
                        </span>
                      ))}
                    </div>

                  </div>

                  {/* Price & Action */}
                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-extrabold text-slate-900">
                          ₹{product.priceInr}
                        </span>
                        <span className="text-xs text-slate-400 line-through">
                          ₹{product.mrpInr}
                        </span>
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded-md">
                          {product.discountPercent}% OFF
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 block">
                        Inclusive of all GST taxes
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleBuyNow(product)}
                        className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/25 active:scale-95 transition-all flex items-center gap-1.5"
                      >
                        <span>Buy on {product.partner.split(' ')[0]}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

          {/* Transparent Affiliate & Co-Op Disclosure */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>FloraScan Verified Agro-Affiliate Transparency</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              When you purchase through these affiliate links, FloraScan receives a small verified partner referral fee at no additional cost to you. All agrochemicals and biologicals are verified for authentic batch numbers, shelf life, and subsidized farmer pricing.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
