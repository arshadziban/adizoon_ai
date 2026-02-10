import React from "react";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Get started with basic features",
    features: [
      "5 voice messages / day",
      "Text chat limited",
      "Basic transcription",
      "Chat history (local)",
    ],
    current: true,
  },
  {
    name: "Pro",
    price: "$12",
    period: "/ month",
    description: "For power users who need more",
    features: [
      "Unlimited voice messages",
      "Priority transcription",
      "Advanced AI responses",
      "Cloud chat history",
      "Custom voice models",
      "Priority support",
    ],
    popular: true,
  },
  {
    name: "Team",
    price: "$29",
    period: "/ month",
    description: "Collaborate with your team",
    features: [
      "Everything in Pro",
      "Up to 10 team members",
      "Shared chat workspace",
      "Admin dashboard",
      "API access",
      "Dedicated support",
    ],
  },
];

export default function UpgradePage({ onClose }) {
  return (
    <div className="h-full w-full bg-[#161616] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-[#2a2a2a]">
        <h2 className="text-lg font-semibold text-white">Upgrade plan</h2>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-white hover:bg-[#2a2a2a] rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Title */}
        <div className="text-center mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Choose your plan</h1>
          <p className="text-gray-500 text-sm">Unlock more features to supercharge your workflow</p>
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border p-6 flex flex-col ${
                plan.popular
                  ? "border-[#EE9225] bg-[#1e1e1e]"
                  : "border-[#2a2a2a] bg-[#1e1e1e]"
              }`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-[#EE9225] text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Popular
                  </span>
                </div>
              )}

              {/* Plan header */}
              <div className="mb-5">
                <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="mb-5">
                <span className="text-3xl font-bold text-white">{plan.price}</span>
                <span className="text-sm text-gray-500 ml-1">{plan.period}</span>
              </div>

              {/* Features */}
              <ul className="space-y-2.5 mb-6 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <svg className="w-4 h-4 text-[#EE9225] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Button */}
              {plan.current ? (
                <button
                  disabled
                  className="w-full rounded-lg border border-[#3a3a3a] bg-[#2a2a2a] text-gray-500 font-medium py-2.5 text-sm cursor-not-allowed"
                >
                  Current plan
                </button>
              ) : (
                <button
                  className={`w-full rounded-lg font-medium py-2.5 text-sm transition-colors ${
                    plan.popular
                      ? "bg-[#EE9225] text-white hover:bg-[#d6831f]"
                      : "bg-[#2a2a2a] text-white border border-[#3a3a3a] hover:bg-[#3a3a3a]"
                  }`}
                >
                  Upgrade to {plan.name}
                </button>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
