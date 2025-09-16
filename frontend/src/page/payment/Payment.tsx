import { useState } from "react";

export default function PaymentCard() {
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [isFlipped, setIsFlipped] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Payment submitted!");
  };

  const formatCardNumber = (num: string) =>
    num
      .replace(/\D/g, "")
      .replace(/(.{4})/g, "$1 ")
      .trim();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-2xl flex flex-col md:flex-row gap-6">
        {/* Card Preview */}
        <div
          className={`w-full md:w-1/2 h-56 perspective`}
          onMouseEnter={() => setIsFlipped(false)}
          onMouseLeave={() => setIsFlipped(false)}
        >
          <div
            className={`relative w-full h-full transition-transform duration-500 transform ${
              isFlipped ? "rotate-y-180" : ""
            }`}
          >
            {/* Front */}
            <div className="absolute w-full h-full backface-hidden bg-blue-500 text-white rounded-xl p-6 flex flex-col justify-between shadow-lg">
              <div className="text-sm">Bank</div>
              <div className="text-lg tracking-widest">
                {cardNumber || "#### #### #### ####"}
              </div>
              <div className="flex justify-between items-center">
                <div>{cardName || "Cardholder Name"}</div>
                <div>{expiry || "MM/YY"}</div>
              </div>
            </div>
            {/* Back */}
            <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-gray-700 text-white rounded-xl p-6 flex flex-col justify-between shadow-lg">
              <div className="bg-black h-10 w-full my-2"></div>
              <div className="flex justify-end">
                <div className="bg-white text-black px-2 rounded">
                  {cvv || "###"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <form
          onSubmit={handleSubmit}
          className="w-full md:w-1/2 flex flex-col gap-4 bg-white p-6 rounded-xl shadow-lg"
        >
          <h2 className="text-2xl font-bold mb-2 text-center">Payment</h2>

          <div>
            <label className="block mb-1 font-medium">Card Number</label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Cardholder Name</label>
            <input
              type="text"
              value={cardName}
              onChange={(e) => setCardName(e.target.value.toUpperCase())}
              placeholder="John Doe"
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block mb-1 font-medium">Expiry</label>
              <input
                type="text"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                placeholder="MM/YY"
                maxLength={5}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1 font-medium">CVV</label>
              <input
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                placeholder="123"
                maxLength={3}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                onFocus={() => setIsFlipped(true)}
                onBlur={() => setIsFlipped(false)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-4 w-full bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Pay Now
          </button>
        </form>
      </div>
    </div>
  );
}
