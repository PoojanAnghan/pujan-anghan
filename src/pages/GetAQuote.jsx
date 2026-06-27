import { useState } from "react"
import emailjs from "@emailjs/browser"

const SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const AUTOREPLY_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_AUTOREPLY_TEMPLATE_ID;

const INITIAL_FORM = {
  name: "",
  email: "",
  whatsapp: "",
  company: "",
  service: "",
  description: "",
  budget: "",
  timeline: "",
  designReady: "",
  referral: "",
}

const INITIAL_ERRORS = {}

export default function GetAQuote() {
  const [form, setForm]       = useState(INITIAL_FORM)
  const [errors, setErrors]   = useState(INITIAL_ERRORS)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  const validate = () => {
    const e = {}
    if (!form.name.trim())        e.name        = "Full name is required."
    if (!form.email.trim())       e.email       = "Email address is required."
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email address."
    if (!form.service)            e.service     = "Please select a service."
    if (!form.description.trim()) e.description = "Project description is required."
    if (!form.budget)             e.budget      = "Please select a budget range."
    if (!form.timeline)           e.timeline    = "Please select a timeline."
    if (!form.designReady)        e.designReady = "Please select an option."
    return e
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError(null)
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setLoading(true)
    try {
      if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
        throw new Error("Missing EmailJS environment keys (VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, or VITE_EMAILJS_PUBLIC_KEY). Please make sure they are defined in your .env file and restart your Vite server.");
      }
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          from_name:    form.name,
          from_email:   form.email,
          whatsapp:     form.whatsapp     || "Not provided",
          company:      form.company      || "Not provided",
          service:      form.service,
          budget:       form.budget,
          timeline:     form.timeline,
          message:      form.description,
          design_ready: form.designReady,
          referral:     form.referral     || "Not specified",
        },
        PUBLIC_KEY
      )
      if (AUTOREPLY_TEMPLATE_ID) {
        try {
          await emailjs.send(
            SERVICE_ID,
            AUTOREPLY_TEMPLATE_ID,
            {
              from_name:    form.name,
              from_email:   form.email,
              service:      form.service,
              budget:       form.budget,
              timeline:     form.timeline,
              company:      form.company      || "Not provided",
              design_ready: form.designReady,
              message:      form.description,
            },
            PUBLIC_KEY
          );
        } catch (autoReplyErr) {
          console.error("Auto-reply transmission failed:", autoReplyErr);
        }
      }
      setSuccess(true)
      setForm(INITIAL_FORM)
    } catch (err) {
      console.error("Submission failed:", err);
      const errMsg = err?.text || err?.message || (typeof err === 'string' ? err : "EmailJS API request failed.");
      setSubmitError(
        <span>
          Submission failed: {errMsg}. You can email me directly at{" "}
          <a
            href={`mailto:anghanpoojan66@gmail.com?subject=Project Quote Request - ${encodeURIComponent(
              form.service
            )}&body=${encodeURIComponent(
              `Name: ${form.name}\nEmail: ${form.email}\nWhatsApp: ${form.whatsapp || 'Not provided'}\nCompany: ${form.company || 'Not provided'}\nService: ${form.service}\nBudget: ${form.budget}\nTimeline: ${form.timeline}\nDesign Ready: ${form.designReady}\nReferral: ${form.referral || 'Not specified'}\n\nDescription:\n${form.description}`
            )}`}
            className="text-emerald-400 underline hover:text-emerald-300 font-semibold"
          >
            anghanpoojan66@gmail.com
          </a>
        </span>
      );
    } finally {
      setLoading(false)
    }
  }

  const inputCls = (field) =>
    `w-full bg-slate-800 text-white rounded-lg px-4 py-2.5 text-sm border outline-none
     focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all
     ${errors[field] ? "border-red-500" : "border-slate-700"}`

  const ErrorMsg = ({ field }) =>
    errors[field] ? (
      <p className="text-red-400 text-xs mt-1">{errors[field]}</p>
    ) : null

  const Label = ({ children, required }) => (
    <label className="block text-sm font-medium text-slate-300 mb-1.5">
      {children}
      {required && <span className="text-emerald-400 ml-0.5">*</span>}
    </label>
  )

  if (success) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30
            flex items-center justify-center mx-auto mb-6 text-3xl">
            ✓
          </div>
          <h2 className="text-2xl font-semibold text-white mb-3">Brief received!</h2>
          <p className="text-slate-400 leading-relaxed mb-6">
            Thanks for reaching out. I'll review your project brief and reply
            within 24 hours with a rough estimate.
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="text-emerald-400 text-sm border border-emerald-500/30
              rounded-lg px-5 py-2 hover:bg-emerald-500/10 transition-colors"
          >
            Submit another request
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 px-6 py-16">
      <div className="max-w-5xl mx-auto">

        {/* Page heading */}
        <div className="mb-12 text-center">
          <span className="inline-flex items-center gap-2 text-emerald-400 text-sm font-medium
            bg-emerald-400/10 border border-emerald-400/20 rounded-full px-3 py-1 mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Currently available
          </span>
          <h1 className="text-4xl font-semibold text-white mb-3">Get a quote</h1>
          <p className="text-slate-400 max-w-md mx-auto">
            Tell me about your project and I'll get back within 24 hours
            with a rough estimate.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* LEFT — sidebar */}
          <aside className="lg:col-span-1 space-y-6">

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-medium text-slate-300 uppercase tracking-wider">
                Contact directly
              </h3>
              <a href="mailto:anghanpoojan66@gmail.com"
                className="flex items-center gap-3 text-slate-400 hover:text-emerald-400
                  transition-colors text-sm">
                <span className="text-lg">✉</span>
                anghanpoojan66@gmail.com
              </a>
              <a href="https://wa.me/917043832747?text=Hi%20Poojan%2C%20I'm%20interested%20in%20discussing%20a%20web%20app%20project%20with%20you." target="_blank" rel="noreferrer"
                className="flex items-center gap-3 text-slate-400 hover:text-emerald-400
                  transition-colors text-sm">
                <span className="text-lg">💬</span>
                WhatsApp me
              </a>
              <a href="https://www.linkedin.com/in/poojan-anghan-447073340" target="_blank" rel="noreferrer"
                className="flex items-center gap-3 text-slate-400 hover:text-emerald-400
                  transition-colors text-sm">
                <span className="text-lg">🔗</span>
                linkedin.com/in/poojan-anghan
              </a>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Next slot open now
              </div>
              <div className="text-slate-400 text-sm">
                ⚡ Avg. response time: under 4 hours
              </div>
              <div className="text-slate-400 text-sm">
                🌍 Available for remote work worldwide
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
              <h3 className="text-sm font-medium text-slate-300 mb-3">What happens next</h3>
              <ol className="space-y-2.5">
                {[
                  "You submit the brief below",
                  "I review and reply within 24h",
                  "We hop on a quick call if needed",
                  "You get a fixed-price quote",
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-400">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/10 border
                      border-emerald-500/30 text-emerald-400 text-xs flex items-center
                      justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

          </aside>

          {/* RIGHT — form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} noValidate
              className="bg-slate-800/30 border border-slate-700 rounded-xl p-7 space-y-7">

              {/* Section 1 */}
              <div>
                <h2 className="text-base font-medium text-white mb-4 pb-2
                  border-b border-slate-700">
                  About you
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label required>Full name</Label>
                    <input name="name" value={form.name} onChange={handleChange}
                      placeholder="Poojan Anghan" className={inputCls("name")} />
                    <ErrorMsg field="name" />
                  </div>
                  <div>
                    <Label required>Email address</Label>
                    <input name="email" type="email" value={form.email} onChange={handleChange}
                      placeholder="you@company.com" className={inputCls("email")} />
                    <ErrorMsg field="email" />
                  </div>
                  <div>
                    <Label>WhatsApp number</Label>
                    <input name="whatsapp" type="tel" value={form.whatsapp} onChange={handleChange}
                      placeholder="+91 98765 43210" className={inputCls("whatsapp")} />
                  </div>
                  <div>
                    <Label>Company / Business name</Label>
                    <input name="company" value={form.company} onChange={handleChange}
                      placeholder="Acme Inc." className={inputCls("company")} />
                  </div>
                </div>
              </div>

              {/* Section 2 */}
              <div>
                <h2 className="text-base font-medium text-white mb-4 pb-2
                  border-b border-slate-700">
                  Your project
                </h2>
                <div className="space-y-4">
                  <div>
                    <Label required>Service needed</Label>
                    <select name="service" value={form.service} onChange={handleChange}
                      className={inputCls("service")}>
                      <option value="">Select a service...</option>
                      <option>Custom Web App</option>
                      <option>API Development & Integration</option>
                      <option>Admin Dashboard / Portal</option>
                      <option>Bug Fix / Code Review</option>
                      <option>Not sure — let's talk</option>
                    </select>
                    <ErrorMsg field="service" />
                  </div>
                  <div>
                    <Label required>Project description</Label>
                    <textarea name="description" value={form.description}
                      onChange={handleChange} rows={4}
                      placeholder="Describe what you want to build, the problem it solves, and any features you have in mind."
                      className={inputCls("description")} />
                    <ErrorMsg field="description" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label required>Estimated budget</Label>
                      <select name="budget" value={form.budget} onChange={handleChange}
                        className={inputCls("budget")}>
                        <option value="">Select a range...</option>
                        <option>Under ₹5,000</option>
                        <option>₹5,000 – ₹15,000</option>
                        <option>₹15,000 – ₹50,000</option>
                        <option>₹50,000+</option>
                        <option>Not sure yet</option>
                      </select>
                      <ErrorMsg field="budget" />
                    </div>
                    <div>
                      <Label required>Timeline</Label>
                      <select name="timeline" value={form.timeline} onChange={handleChange}
                        className={inputCls("timeline")}>
                        <option value="">Select a timeline...</option>
                        <option>As soon as possible</option>
                        <option>Within 1 month</option>
                        <option>1–3 months</option>
                        <option>Flexible</option>
                      </select>
                      <ErrorMsg field="timeline" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3 */}
              <div>
                <h2 className="text-base font-medium text-white mb-4 pb-2
                  border-b border-slate-700">
                  A few extras
                </h2>
                <div className="space-y-4">
                  <div>
                    <Label required>Do you have a design ready?</Label>
                    <div className="flex gap-3 flex-wrap mt-1">
                      {["Yes", "No", "Need help with design"].map(opt => (
                        <label key={opt}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg border
                            text-sm cursor-pointer transition-all
                            ${form.designReady === opt
                              ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                              : "border-slate-700 text-slate-400 hover:border-slate-500"}`}>
                          <input type="radio" name="designReady" value={opt}
                            checked={form.designReady === opt}
                            onChange={handleChange} className="hidden" />
                          {opt}
                        </label>
                      ))}
                    </div>
                    <ErrorMsg field="designReady" />
                  </div>
                  <div>
                    <Label>How did you hear about me?</Label>
                    <select name="referral" value={form.referral} onChange={handleChange}
                      className={inputCls("referral")}>
                      <option value="">Select...</option>
                      <option>Google search</option>
                      <option>LinkedIn</option>
                      <option>GitHub</option>
                      <option>Referral</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Submit */}
              {submitError && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg
                  px-4 py-3 text-red-400 text-sm">
                  {submitError}
                </div>
              )}

              <button type="submit" disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60
                  disabled:cursor-not-allowed text-black font-medium py-3 rounded-lg
                  transition-colors text-sm flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-black/30 border-t-black
                      rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send my project brief →"
                )}
              </button>

              <p className="text-slate-500 text-xs text-center">
                No spam. Your details are only used to respond to your enquiry.
              </p>

            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
