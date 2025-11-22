import React, { useState } from 'react';
import { ChevronDown, Check, X, Star, BarChart3, Calculator, Home, TrendingUp, DollarSign, Clock, Phone } from 'lucide-react';

// The main component which exports the entire replicated page.
const App = () => {
  return (
    <div className="min-h-screen bg-white font-['Inter']">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <HeroSection />
        <PartnersSection />
        <ComparisonTable />
        <CTASection />
        <TestimonialsSection />
        <LoanCalculatorSection />
        {/* <OtherCalculators /> */}
        {/* <LoanTipsSection /> */}
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
};

// --- Component 1: Header ---
const Header = () => (
  <header className="sticky top-0 z-10 bg-white border-b border-gray-100">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">
      <div className="text-2xl font-bold text-gray-900">
        jugyah<span className="text-green-600">.</span>
      </div>
      <nav className="hidden lg:flex space-x-8 text-sm font-medium text-gray-600">
        <a href="#" className="hover:text-green-600">Loans</a>
        <a href="#" className="hover:text-green-600">Calculators</a>
        {/* <a href="#" className="hover:text-green-600">Resources</a> */}
        <a href="#" className="hover:text-green-600">Partners</a>
      </nav>
      <div className="flex items-center space-x-4">
        <button className="text-sm font-medium text-gray-600 hover:text-green-600">
          Sign In
        </button>
        <button className="hidden sm:block text-sm font-medium text-white bg-gray-900 hover:bg-gray-700 py-2 px-4 rounded-lg transition">
          Register
        </button>
      </div>
    </div>
  </header>
);

// --- Component 2: Hero Section ---
const StatCard = ({ value, label, icon }) => (
  <div className="bg-gray-900 text-white p-6 rounded-xl space-y-2 border border-gray-700 w-full">
    <div className="text-4xl font-extrabold">{value}</div>
    <div className="text-sm text-gray-400">{label}</div>
    <div className="flex items-center justify-between mt-2">
      <div className="text-sm text-gray-500">View details</div>
      <div className="text-gray-400">{icon}</div>
    </div>
  </div>
);

const HeroSection = () => (
  <section className="py-12 sm:py-20 lg:pt-28 lg:pb-16 flex flex-col lg:flex-row items-center justify-between">
    <div className="lg:w-5/12 text-center lg:text-left mb-10 lg:mb-0">
      <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight">
        Your Loans,
        <br />
        <span className="text-green-600">Simplified</span>
      </h1>
      <p className="mt-6 text-lg text-gray-600">
        We help you get the best loan offer by comparing multiple banks with our expert guidance.
      </p>
      <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <button className="flex-1 sm:flex-none text-base font-semibold text-white bg-green-600 hover:bg-green-700 py-3 px-8 rounded-xl transition shadow-lg shadow-green-200">
          Get Started
        </button>
        <button className="flex-1 sm:flex-none text-base font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 py-3 px-8 rounded-xl transition shadow-md">
          Explore Options
        </button>
      </div>
    </div>

    <div className="lg:w-6/12 grid grid-cols-1 sm:grid-cols-2 gap-4">
      <StatCard
        value="₹ 5000 Cr+"
        label="Loans Disbursed"
        icon={<TrendingUp className="w-6 h-6" />}
      />
      <StatCard
        value="60+"
        label="Partner Banks"
        icon={<Home className="w-6 h-6" />}
      />
      <StatCard
        value="6000+"
        label="Happy Customers"
        icon={<Star className="w-6 h-6" />}
      />
      <StatCard
        value="4.9 / 5"
        label="Average Rating"
        icon={<BarChart3 className="w-6 h-6" />}
      />
    </div>
  </section>
);

// --- Component 3: Partners Section ---
const PartnersSection = () => {
  const logos = [
    { name: 'HDFC', text: 'HDFC Bank' },
    { name: 'ICICI', text: 'ICICI Bank' },
    { name: 'SBI', text: 'SBI' },
    { name: 'Axis', text: 'Axis Bank' },
    { name: 'Kotak', text: 'Kotak Mahindra' },
    { name: 'Bajaj', text: 'Bajaj Finance' },
  ];

  return (
    <section className="py-12 text-center border-t border-gray-100">
      <p className="text-sm font-medium text-gray-500 mb-6">
        A partnership with <span className="text-gray-900">Strongest Banks</span>
      </p>
      <div className="flex flex-wrap justify-center gap-6 sm:gap-10">
        {logos.map((logo) => (
          <div key={logo.name} className="opacity-70 hover:opacity-100 transition duration-300">
            <span className="text-xl font-bold text-gray-800">{logo.name}</span>
            {/* In a real app, this would be an SVG/Image logo */}
          </div>
        ))}
      </div>
    </section>
  );
};

// --- Component 4: Comparison Table ---
const TableRow = ({ param, expertValue, bankValue, expertIcon, bankIcon }) => {
  const Icon = ({ isCheck }) =>
    isCheck ? (
      <Check className="w-5 h-5 text-green-400" />
    ) : (
      <X className="w-5 h-5 text-red-400" />
    );

  const expertColor = expertIcon === 'check' ? 'text-green-400' : 'text-red-400';
  const bankColor = bankIcon === 'check' ? 'text-green-400' : 'text-red-400';

  return (
    <div className="grid grid-cols-3 gap-4 border-b border-gray-700 py-4 items-center">
      <div className="text-sm text-gray-300 font-medium">{param}</div>
      <div className="text-sm text-white flex items-center space-x-2">
        {expertIcon && <Icon isCheck={expertIcon === 'check'} />}
        <span>{expertValue}</span>
      </div>
      <div className="text-sm text-white flex items-center space-x-2">
        {bankIcon && <Icon isCheck={bankIcon === 'check'} />}
        <span>{bankValue}</span>
      </div>
    </div>
  );
};

const ComparisonTable = () => (
  <section className="my-16">
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Compare Our Advantages</h2>
    <div className="bg-gray-800 rounded-xl p-6 shadow-2xl">
      {/* Table Header */}
      <div className="grid grid-cols-3 gap-4 pb-4 border-b border-gray-600">
        <div className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Parameters</div>
        <div className="text-sm font-semibold text-green-400 uppercase tracking-wider">Expert</div>
        <div className="text-sm font-semibold text-red-400 uppercase tracking-wider">Bank</div>
      </div>

      {/* Table Rows */}
      <TableRow
        param="Success Rate"
        expertValue="98% (High)"
        bankValue="60% (Low)"
        expertIcon="check"
        bankIcon="x"
      />
      <TableRow
        param="Processing Time"
        expertValue="24 - 48 HRS"
        bankValue="7 - 10 Days"
        expertIcon="check"
        bankIcon="x"
      />
      <TableRow
        param="Pre-Qualified Offers"
        expertValue="Multiple Options"
        bankValue="None/Limited"
        expertIcon="check"
        bankIcon="x"
      />
      <TableRow
        param="Documentation & Support"
        expertValue="Dedicated RM & Tech Support"
        bankValue="Self-Service"
        expertIcon="check"
        bankIcon="x"
      />
      <TableRow
        param="Interest Rate"
        expertValue="Best Market Rate"
        bankValue="Standard Rate"
        expertIcon="check"
        bankIcon="x"
      />
    </div>
    <div className="flex justify-center mt-6">
      <button className="text-sm font-semibold text-white bg-green-600 hover:bg-green-700 py-3 px-8 rounded-xl transition shadow-lg shadow-green-200">
        Start My Application
      </button>
    </div>
  </section>
);

// --- Component 5: CTA Section ---
const CTASection = () => (
  <section className="my-16">
    <div className="relative bg-cover bg-center rounded-xl p-12 overflow-hidden"
      style={{
        backgroundImage: "url('https://placehold.co/1200x400/1f2937/ffffff?text=Professional+Working+on+Laptop')",
        minHeight: '400px',
      }}>
      <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-[2px] rounded-xl"></div>
      <div className="relative z-10 max-w-lg text-white">
        <h2 className="text-4xl font-extrabold leading-snug">
          Learn the smarter way to apply for a loan.
        </h2>
        <p className="mt-4 text-gray-200">
          Our experts guide you through every step, ensuring a smooth and successful application.
        </p>
        <button className="mt-6 text-base font-semibold text-white bg-green-600 hover:bg-green-700 py-3 px-8 rounded-xl transition shadow-lg">
          Connect with an Expert
        </button>
      </div>
    </div>
  </section>
);

// --- Component 6: Testimonials Section ---
const TestimonialCard = ({ name, role, review, rating }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-md flex flex-col justify-between h-full">
    <div className="flex items-start space-x-4">
      <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-white text-lg font-bold">
        {name.charAt(0)}
      </div>
      <div>
        <div className="font-semibold text-gray-900">{name}</div>
        <div className="text-xs text-gray-500">{role}</div>
      </div>
    </div>
    <div className="mt-4">
      <p className="text-sm text-gray-700 line-clamp-4">
        &ldquo;{review}&rdquo;
      </p>
    </div>
    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
      ))}
    </div>
  </div>
);

const TestimonialsSection = () => {
  const reviews = [
    { name: 'Manoj S.', role: 'Business Owner', review: "The personalized support I received from the Jugyah team was exceptional. They found me a loan rate I couldn't get anywhere else. Highly recommend their service!", rating: 5 },
    { name: 'Priya K.', role: 'IT Professional', review: "Applying for a home loan felt overwhelming until I used Jugyah. The process was transparent, quick, and the dedicated relationship manager was a huge help.", rating: 5 },
    { name: 'Rahul V.', role: 'Startup Founder', review: "I needed quick funding for my startup. Jugyah's pre-qualified offers saved me weeks of research. Got the funds in 48 hours. Five stars!", rating: 4 },
  ];

  return (
    <section className="py-16">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl font-extrabold text-gray-900">
          Hear what our clients have to say about us <span className="text-gray-400">♥</span>
        </h2>
        <a href="#" className="hidden sm:inline-flex items-center text-sm font-semibold text-green-600 hover:text-green-700">
          View All Reviews <ChevronDown className="w-4 h-4 ml-1 transform rotate-[-90deg]" />
        </a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((review, index) => (
          <TestimonialCard key={index} {...review} />
        ))}
      </div>
    </section>
  );
};

// --- Component 7: Loan Calculator Section ---
const CalculatorSlider = ({ label, value, unit, min, max, step, onChange }) => (
  <div className="mb-6">
    <div className="flex justify-between items-center mb-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="text-lg font-bold text-gray-900">{value.toLocaleString('en-IN')} {unit}</div>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-600"
      style={{
        '--tw-range-progress-width': `${((value - min) / (max - min)) * 100}%`,
      }}
    />
  </div>
);

const LoanCalculatorSection = () => {
  const [loanAmount, setLoanAmount] = useState(5000000);
  const [interestRate, setInterestRate] = useState(9.5);
  const [tenure, setTenure] = useState(15);

  const calculateEMI = () => {
    const principal = loanAmount;
    const rate = interestRate / 100 / 12;
    const time = tenure * 12;

    if (rate === 0) return principal / time; // Simple division if interest is 0
    const emi = principal * rate * Math.pow(1 + rate, time) / (Math.pow(1 + rate, time) - 1);
    return isNaN(emi) || emi === Infinity ? 0 : emi;
  };

  const monthlyEMI = calculateEMI();
  const totalInterest = monthlyEMI * tenure * 12 - loanAmount;

  return (
    <section className="py-16">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-8">EMI Calculator</h2>
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Input Controls */}
        <div>
          <CalculatorSlider
            label="Loan Amount"
            value={loanAmount}
            unit="₹"
            min={100000}
            max={10000000}
            step={10000}
            onChange={setLoanAmount}
          />
          <CalculatorSlider
            label="Interest Rate"
            value={interestRate}
            unit="%"
            min={5}
            max={20}
            step={0.1}
            onChange={setInterestRate}
          />
          <CalculatorSlider
            label="Loan Tenure"
            value={tenure}
            unit="Years"
            min={1}
            max={30}
            step={1}
            onChange={setTenure}
          />
        </div>

        {/* Right: Results Display */}
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg shadow-inner border-l-4 border-green-600">
            <div className="text-sm text-gray-500">Your Monthly EMI</div>
            <div className="text-3xl font-extrabold text-green-600">
              ₹ {monthlyEMI.toFixed(0).toLocaleString('en-IN')}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-500">Total Principal</div>
              <div className="font-semibold text-gray-900">₹ {loanAmount.toLocaleString('en-IN')}</div>
            </div>
            <div>
              <div className="text-gray-500">Total Interest</div>
              <div className="font-semibold text-gray-900">₹ {totalInterest.toFixed(0).toLocaleString('en-IN')}</div>
            </div>
          </div>

          {/* Placeholder for the Pie Chart / Visual */}
          <div className="bg-white p-4 rounded-lg shadow-sm h-32 flex items-center justify-center border border-gray-200">
            <span className="text-gray-400 text-sm">Placeholder for Amortization Chart</span>
          </div>

          <button className="w-full text-base font-semibold text-white bg-gray-900 hover:bg-gray-700 py-3 rounded-xl transition">
            Apply Now with this EMI
          </button>
        </div>
      </div>
    </section>
  );
};

// --- Component 8: Other Calculators ---
const CalcCard = ({ icon: Icon, title, description }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center text-center hover:shadow-lg transition cursor-pointer h-full">
    <div className="p-3 bg-gray-100 rounded-full mb-4">
      <Icon className="w-6 h-6 text-green-600" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
    <p className="text-sm text-gray-500 mt-2">{description}</p>
  </div>
);

const OtherCalculators = () => (
  <section className="py-16">
    <h2 className="text-2xl font-bold text-gray-900 mb-8">Try Our Other Calculators</h2>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <CalcCard
        icon={Calculator}
        title="EMI Calculator"
        description="Calculate your monthly EMI quickly and accurately."
      />
      <CalcCard
        icon={Home}
        title="Home Loan Eligibility"
        description="Check your maximum eligible loan amount from different banks."
      />
      <CalcCard
        icon={DollarSign}
        title="Personal Loan Calculator"
        description="Plan your personal loan repayment based on various options."
      />
    </div>
  </section>
);

// --- Component 9: Loan Tips & Guide Section ---
const TipCard = ({ title, imagePlaceholder }) => (
  <a href="#" className="block group">
    <div className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1">
      <img
        src={imagePlaceholder}
        alt={title}
        className="w-full h-40 object-cover"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = `https://placehold.co/400x200/9ca3af/ffffff?text=Guide`;
        }}
      />
      <div className="p-4 bg-white">
        <h3 className="text-sm font-semibold text-gray-900 group-hover:text-green-600 line-clamp-2">
          {title}
        </h3>
        <p className="text-xs text-gray-500 mt-1 flex items-center">
          <Clock className="w-3 h-3 mr-1" /> 5 Min Read
        </p>
      </div>
    </div>
  </a>
);

const LoanTipsSection = () => (
  <section className="py-16 border-t border-gray-100">
    <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Loan Tips and Guide</h2>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      <TipCard
        title="How to Improve Your CIBIL Score for Better Loan Rates"
        imagePlaceholder="https://placehold.co/400x200/059669/ffffff?text=CIBIL+Score"
      />
      <TipCard
        title="The Ultimate Checklist Before Applying for a Home Loan"
        imagePlaceholder="https://placehold.co/400x200/ef4444/ffffff?text=Home+Loan"
      />
      <TipCard
        title="Understanding the Different Types of Business Loans"
        imagePlaceholder="https://placehold.co/400x200/3b82f6/ffffff?text=Business+Finance"
      />
      <TipCard
        title="Top 5 Mistakes to Avoid While Taking a Personal Loan"
        imagePlaceholder="https://placehold.co/400x200/f59e0b/ffffff?text=Personal+Tips"
      />
    </div>
  </section>
);

// --- Component 10: FAQ Section ---
const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 py-4">
      <button
        className="flex justify-between items-center w-full text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-medium text-gray-900">{question}</span>
        <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
      </button>
      {isOpen && (
        <p className="mt-3 text-gray-600 text-sm">{answer}</p>
      )}
    </div>
  );
};

const FAQSection = () => (
  <section className="py-16">
    <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Frequently asked questions</h2>
    <div className="max-w-4xl">
      <FAQItem
        question="What is the minimum CIBIL score required for a loan?"
        answer="Most banks require a CIBIL score of 750 or above for favorable loan terms. However, some NBFCs may approve loans for scores between 650-750, often at a higher interest rate. Our experts can advise you on the best path forward."
      />
      <FAQItem
        question="How long does the loan approval process take?"
        answer="The approval time varies by loan type and bank. With our expert assistance, we can often secure pre-qualified offers and complete the documentation process within 24 to 48 hours for personal loans, and 5-7 days for home loans."
      />
      <FAQItem
        question="Are there any hidden charges when applying through Jugyah?"
        answer="No, we maintain complete transparency. All processing fees and other charges are clearly disclosed upfront. Our service is primarily focused on providing unbiased comparisons and expert guidance."
      />
    </div>
  </section>
);


// --- Component 11: Footer ---
const FooterLinkGroup = ({ title, links }) => (
  <div className="space-y-4">
    <h4 className="text-base font-semibold text-gray-900">{title}</h4>
    <ul className="space-y-3">
      {links.map((link, index) => (
        <li key={index}>
          <a href="#" className="text-sm text-gray-600 hover:text-green-600 transition">
            {link}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

const Footer = () => (
  <footer className="bg-gray-50 border-t border-gray-100 mt-16 pt-12 pb-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
        {/* Logo/Contact Column */}
        <div className="col-span-2 lg:col-span-1 space-y-4">
          <div className="text-3xl font-bold text-gray-900">
            jugyah<span className="text-green-600">.</span>
          </div>
          <p className="text-sm text-gray-600">
            Get the best loan deals with expert guidance.
          </p>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Phone className="w-4 h-4 text-green-600" />
            <span>+91 98765 43210</span>
          </div>
        </div>

        {/* Link Groups */}
        <FooterLinkGroup
          title="Company"
          links={['About Us', 'Careers', 'Press', 'Blog']}
        />
        <FooterLinkGroup
          title="Products"
          links={['Personal Loan', 'Home Loan', 'Business Loan', 'Education Loan']}
        />
        <FooterLinkGroup
          title="Support"
          links={['Help Center', 'Contact Us', 'Privacy Policy', 'Terms of Service']}
        />

        {/* Action/Subscribe Column - Replicating the chat widget button look */}
        <div className="col-span-2 md:col-span-1 lg:col-span-1 flex justify-end md:justify-start">
          <button className="fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition flex items-center space-x-2 text-sm">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.805A9.73 9.73 0 0112 4c4.97 0 9 3.582 9 8z" />
            </svg>
            <span className='hidden sm:inline'>Chat With Us</span>
          </button>
        </div>

      </div>
      
      {/* Copyright */}
      <div className="mt-12 pt-6 border-t border-gray-200 text-center">
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} Jugyah Financial Services. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

export default App;