import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { setWallet } from '../redux/slices/userSlice';
import { toast } from 'react-toastify';
import { FaWallet, FaPlus, FaArrowUp, FaArrowDown, FaCheckCircle } from 'react-icons/fa';

const WalletPage = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { wallet } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [addAmount, setAddAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    fetchWalletData();
  }, [isAuthenticated, navigate]);

  const fetchWalletData = async () => {
    try {
      const walletRes = await api.get('/users/wallet');
      const historyRes = await api.get('/payments/history');

      dispatch(setWallet(walletRes.data.wallet));
      setPaymentHistory(historyRes.data.payments || []);
    } catch (error) {
      toast.error('Failed to load wallet data');
    }
  };

  const handleAddMoney = async (e) => {
    e.preventDefault();
    if (!addAmount || addAmount <= 0) {
      toast.warning('Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/payments/wallet/add-money', {
        amount: parseFloat(addAmount),
      });

      toast.success('Payment initiated');
      setAddAmount('');
      fetchWalletData();
    } catch (error) {
      toast.error('Failed to add money');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Wallet</h1>
            <p className="text-gray-600">Manage your funds and view transaction history</p>
          </div>

          {/* Main Balance Card */}
          <div className="bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 rounded-3xl p-8 mb-8 shadow-xl text-white">
            <div className="flex items-start justify-between mb-8">
              <div>
                <p className="text-white/80 text-sm font-medium mb-2">Available Balance</p>
                <h2 className="text-6xl font-bold">₹{wallet.walletBalance || 0}</h2>
              </div>
              <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
                <FaWallet size={32} />
              </div>
            </div>
            <p className="text-white/90 text-sm">Ready to use for your rides</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Add Money Section */}
            <div className="lg:col-span-1">
              <div className="card-elevated sticky top-24">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <FaPlus className="text-yellow-500" /> Add Money
                </h3>

                <form onSubmit={handleAddMoney} className="space-y-6">
                  <div className="form-group">
                    <label className="form-label">Amount (₹)</label>
                    <input
                      type="number"
                      value={addAmount}
                      onChange={(e) => setAddAmount(e.target.value)}
                      placeholder="Enter amount"
                      min="100"
                      max="50000"
                      className="input-field text-lg font-bold"
                    />
                    <p className="text-xs text-gray-500 mt-2">Minimum: ₹100 | Maximum: ₹50,000</p>
                  </div>

                  <div>
                    <label className="form-label mb-3 block">Quick Add</label>
                    <div className="grid grid-cols-2 gap-3">
                      {[500, 1000, 2000, 5000].map((amount) => (
                        <button
                          key={amount}
                          type="button"
                          onClick={() => setAddAmount(amount.toString())}
                          className={`py-3 rounded-xl font-bold transition border-2 ${
                            addAmount === amount.toString()
                              ? 'bg-yellow-400 text-gray-900 border-yellow-500'
                              : 'bg-white border-gray-200 text-gray-900 hover:border-yellow-400'
                          }`}
                        >
                          ₹{amount}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-primary font-bold py-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <FaPlus size={16} />
                    {loading ? 'Processing...' : 'Add Money to Wallet'}
                  </button>
                </form>

                {/* Safety Note */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs text-blue-700">
                    <span className="font-bold">Secure:</span> All transactions are encrypted and secure. Your wallet balance never expires.
                  </p>
                </div>
              </div>
            </div>

            {/* Transaction History */}
            <div className="lg:col-span-2">
              <div className="card-elevated">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <FaCheckCircle className="text-green-600" /> Transaction History
                  </h3>
                  {paymentHistory.length > 0 && (
                    <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      {paymentHistory.length} transactions
                    </span>
                  )}
                </div>

                {paymentHistory.length === 0 ? (
                  <div className="text-center py-16">
                    <FaWallet className="text-gray-300 text-5xl mx-auto mb-4" />
                    <p className="text-gray-600 text-lg mb-4">No transactions yet</p>
                    <p className="text-gray-500 text-sm">Start adding money to your wallet and your transactions will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-0">
                    {paymentHistory.map((payment, index) => (
                      <div
                        key={payment._id}
                        className={`flex items-center justify-between p-4 hover:bg-gray-50 transition ${
                          index !== paymentHistory.length - 1 ? 'border-b border-gray-200' : ''
                        }`}
                      >
                        <div className="flex items-center gap-4 flex-1">
                          {/* Icon */}
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                            payment.type === 'credit'
                              ? 'bg-green-100'
                              : 'bg-red-100'
                          }`}>
                            {payment.type === 'credit' ? (
                              <FaArrowDown className="text-green-600" size={18} />
                            ) : (
                              <FaArrowUp className="text-red-600" size={18} />
                            )}
                          </div>

                          {/* Details */}
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-bold text-gray-900">{payment.description || payment.paymentMethod}</p>
                              <p className={`font-bold text-lg ${
                                payment.type === 'credit'
                                  ? 'text-green-600'
                                  : 'text-red-600'
                              }`}>
                                {payment.type === 'credit' ? '+' : '-'}₹{payment.amount}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <p className="text-xs text-gray-500">
                                {new Date(payment.transactionDate).toLocaleDateString('en-IN', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </p>
                              <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                payment.paymentStatus === 'completed'
                                  ? 'bg-green-100 text-green-700'
                                  : payment.paymentStatus === 'pending'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-red-100 text-red-700'
                              }`}>
                                {payment.paymentStatus?.charAt(0).toUpperCase() + payment.paymentStatus?.slice(1)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Stats */}
              {paymentHistory.length > 0 && (
                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div className="card">
                    <p className="text-gray-600 text-sm mb-2">Total Added</p>
                    <p className="text-2xl font-bold text-green-600">
                      ₹{paymentHistory.filter(p => p.type === 'credit').reduce((sum, p) => sum + p.amount, 0)}
                    </p>
                  </div>
                  <div className="card">
                    <p className="text-gray-600 text-sm mb-2">Total Used</p>
                    <p className="text-2xl font-bold text-red-600">
                      ₹{paymentHistory.filter(p => p.type === 'debit').reduce((sum, p) => sum + p.amount, 0)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default WalletPage;
