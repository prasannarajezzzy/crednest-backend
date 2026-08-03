import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ContactForm } from './LeadForms';

const questions = [
  { title: 'Is revenue reasonably predictable?', hint: 'Recurring, contracted or repeat revenue generally improves debt visibility.' },
  { title: 'Are unit economics positive or trending there?', hint: 'Lenders look for credible contribution margins and operating discipline.' },
  { title: 'Has the company raised institutional equity?', hint: 'Not mandatory for every product, but relevant for venture debt.' },
  { title: 'Can you document a clear use of funds?', hint: 'Working capital, CAPEX, runway and receivables each lead to different structures.' },
];

export default function CompatibilityQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const complete = step >= questions.length;
  const score = useMemo(() => Math.round((answers.filter(Boolean).length / questions.length) * 100), [answers]);

  function answer(value: boolean) {
    setAnswers((current) => [...current.slice(0, step), value]);
    setStep((current) => current + 1);
  }

  function goBack() {
    setStep((current) => Math.max(0, current - 1));
  }

  return (
    <section className="quiz" aria-labelledby="quiz-title">
      <div className="quiz__intro">
        <span className="section-kicker">Debt compatibility</span>
        <h2 id="quiz-title">Is debt the right next move?</h2>
        <p>Four practical questions. One directional signal. A proper credit assessment still requires verified financial data.</p>
        <div className="quiz__steps" aria-hidden="true">
          {questions.map((_, index) => <span key={index} className={index < step ? 'is-complete' : index === step ? 'is-current' : ''} />)}
        </div>
      </div>
      <div className="quiz__panel" aria-live="polite">
        {!complete ? (
          <>
            <span className="quiz__count">Question {step + 1} of {questions.length}</span>
            <h3>{questions[step].title}</h3>
            <p>{questions[step].hint}</p>
            <div className="quiz__answers">
              <button type="button" onClick={() => answer(true)}>Yes, broadly <ArrowRight size={17} /></button>
              <button type="button" onClick={() => answer(false)}>Not yet / unsure <ArrowRight size={17} /></button>
            </div>
            {step > 0 && <button className="text-button" type="button" onClick={goBack}><ArrowLeft size={15} /> Previous</button>}
          </>
        ) : (
          <div className="quiz__result">
            <CheckCircle2 size={34} aria-hidden="true" />
            <span>Your directional compatibility</span>
            <strong>{score}%</strong>
            <h3>{score >= 75 ? 'Debt looks worth exploring.' : score >= 50 ? 'A tailored structure may fit.' : 'Strengthen the credit story first.'}</h3>
            <p>This score is educational and not a credit decision. Share a few details for a free debt assessment.</p>
            <ContactForm source="compatibility-quiz" compact submitLabel="Get free assessment" metadata={{ score, answers: answers.map(String).join(',') }} />
            <button className="text-button" type="button" onClick={() => { setStep(0); setAnswers([]); }}>Retake assessment</button>
          </div>
        )}
      </div>
    </section>
  );
}
