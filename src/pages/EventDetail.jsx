import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { submitBooking } from "../api/chefApi";
import toast from "react-hot-toast";
import { SERVICES } from "../constants";

// ── Form fields per service ──────────────────────────────────
const SERVICE_FORMS = {
  "private-dining": {
    title: "Private Dining",
    icon: "🥂",
    subtitle: "Tell us about your intimate dining experience",
    fields: [
      {
        name: "name",
        label: "Full Name",
        type: "text",
        required: true,
        placeholder: "Your full name",
      },
      {
        name: "email",
        label: "Email Address",
        type: "email",
        required: true,
        placeholder: "your@email.com",
      },
      {
        name: "phone",
        label: "Phone Number",
        type: "tel",
        required: true,
        placeholder: "+234 800 000 0000",
      },
      { name: "date", label: "Preferred Date", type: "date", required: true },
      { name: "time", label: "Preferred Time", type: "time", required: true },
      {
        name: "guests",
        label: "Number of Guests",
        type: "number",
        required: true,
        placeholder: "2–20 guests",
        min: 2,
        max: 20,
      },
      {
        name: "location",
        label: "Dining Location",
        type: "text",
        required: true,
        placeholder: "Your home address or venue name",
      },
      {
        name: "cuisine",
        label: "Cuisine Preference",
        type: "select",
        required: false,
        options: [
          "Nigerian Cuisine",
          "French-Nigerian Fusion",
          "Surprise me",
          "Custom (describe below)",
        ],
      },
      {
        name: "dietary",
        label: "Dietary Requirements",
        type: "text",
        required: false,
        placeholder: "Vegan, nut allergy, halal...",
      },
      {
        name: "occasion",
        label: "Occasion",
        type: "text",
        required: false,
        placeholder: "Anniversary, birthday, proposal...",
      },
      {
        name: "budget",
        label: "Approximate Budget",
        type: "select",
        required: false,
        options: [
          "$1,200 – $2,000",
          "$2,000 – $4,000",
          "$4,000 – $8,000",
          "$8,000+",
          "Flexible",
        ],
      },
      {
        name: "notes",
        label: "Additional Notes",
        type: "textarea",
        required: false,
        placeholder: "Any other details, vision, or requests...",
      },
    ],
  },

  weddings: {
    title: "Weddings & Celebrations",
    icon: "💍",
    subtitle: "Let us make your celebration unforgettable",
    fields: [
      {
        name: "name",
        label: "Full Name",
        type: "text",
        required: true,
        placeholder: "Bride / Groom / Event Planner name",
      },
      {
        name: "email",
        label: "Email Address",
        type: "email",
        required: true,
        placeholder: "your@email.com",
      },
      {
        name: "phone",
        label: "Phone Number",
        type: "tel",
        required: true,
        placeholder: "+234 800 000 0000",
      },
      {
        name: "event_type",
        label: "Celebration Type",
        type: "select",
        required: true,
        options: [
          "Traditional Wedding",
          "White Wedding",
          "Engagement Party",
          "Birthday (50th/60th/70th)",
          "Naming Ceremony",
          "Anniversary Gala",
          "Other",
        ],
      },
      { name: "date", label: "Event Date", type: "date", required: true },
      {
        name: "guests",
        label: "Expected Guest Count",
        type: "number",
        required: true,
        placeholder: "e.g. 250",
        min: 20,
      },
      {
        name: "venue",
        label: "Venue Name & Address",
        type: "text",
        required: true,
        placeholder: "Lagos Continental Hotel, VI...",
      },
      {
        name: "cuisine",
        label: "Menu Style",
        type: "select",
        required: true,
        options: [
          "Full Nigerian",
          "Nigerian + Continental",
          "Traditional & Contemporary mix",
          "Custom — describe below",
        ],
      },
      {
        name: "service_style",
        label: "Service Style",
        type: "select",
        required: false,
        options: [
          "Plated & served",
          "Buffet",
          "Food stations",
          "Mix of styles",
        ],
      },
      {
        name: "dietary",
        label: "Dietary Requirements",
        type: "text",
        required: false,
        placeholder: "Halal, vegan, diabetic-friendly...",
      },
      {
        name: "tasting",
        label: "Tasting Session Needed?",
        type: "select",
        required: false,
        options: ["Yes, please arrange one", "No, not needed", "Not sure yet"],
      },
      {
        name: "budget",
        label: "Approximate Budget",
        type: "select",
        required: false,
        options: [
          "Under $10,000",
          "$10,000 – $25,000",
          "$25,000 – $50,000",
          "$50,000+",
          "To be discussed",
        ],
      },
      {
        name: "notes",
        label: "Additional Notes",
        type: "textarea",
        required: false,
        placeholder:
          "Theme, colours, special traditions, cultural requirements...",
      },
    ],
  },

  corporate: {
    title: "Corporate Catering",
    icon: "🏢",
    subtitle: "Elevate your business event with exceptional cuisine",
    fields: [
      {
        name: "name",
        label: "Contact Name",
        type: "text",
        required: true,
        placeholder: "Your full name",
      },
      {
        name: "company",
        label: "Company Name",
        type: "text",
        required: true,
        placeholder: "Company or organisation name",
      },
      {
        name: "email",
        label: "Work Email",
        type: "email",
        required: true,
        placeholder: "name@company.com",
      },
      {
        name: "phone",
        label: "Phone Number",
        type: "tel",
        required: true,
        placeholder: "+234 800 000 0000",
      },
      {
        name: "event_type",
        label: "Event Type",
        type: "select",
        required: true,
        options: [
          "Executive Dinner",
          "Product Launch",
          "Team Lunch",
          "Client Entertainment",
          "Conference Catering",
          "Award Night",
          "Other",
        ],
      },
      { name: "date", label: "Event Date", type: "date", required: true },
      { name: "time", label: "Start Time", type: "time", required: true },
      {
        name: "guests",
        label: "Number of Guests",
        type: "number",
        required: true,
        placeholder: "e.g. 50",
        min: 5,
      },
      {
        name: "venue",
        label: "Venue / Office Address",
        type: "text",
        required: true,
        placeholder: "Venue name and address",
      },
      {
        name: "service_style",
        label: "Service Style",
        type: "select",
        required: true,
        options: [
          "Plated dinner",
          "Buffet",
          "Canapes & cocktails",
          "Working lunch boxes",
          "Mix",
        ],
      },
      {
        name: "dietary",
        label: "Dietary Requirements",
        type: "text",
        required: false,
        placeholder: "Any dietary needs across the team",
      },
      {
        name: "invoice",
        label: "Invoice Required?",
        type: "select",
        required: false,
        options: ["Yes — company invoice needed", "No — personal payment"],
      },
      {
        name: "budget",
        label: "Budget Per Head",
        type: "select",
        required: false,
        options: [
          "$85 – $120/head",
          "$120 – $180/head",
          "$180 – $250/head",
          "$250+/head",
          "To be discussed",
        ],
      },
      {
        name: "notes",
        label: "Additional Notes",
        type: "textarea",
        required: false,
        placeholder:
          "Brand guidelines, dress code, AV needs, special requests...",
      },
    ],
  },

  "cooking-classes": {
    title: "Cooking Classes",
    icon: "📚",
    subtitle: "Book your Nigerian culinary masterclass",
    fields: [
      {
        name: "name",
        label: "Full Name",
        type: "text",
        required: true,
        placeholder: "Your full name",
      },
      {
        name: "email",
        label: "Email Address",
        type: "email",
        required: true,
        placeholder: "your@email.com",
      },
      {
        name: "phone",
        label: "Phone Number",
        type: "tel",
        required: true,
        placeholder: "+234 800 000 0000",
      },
      {
        name: "class_type",
        label: "Class Type",
        type: "select",
        required: true,
        options: [
          "Nigerian Soups Masterclass",
          "Suya & Street Food",
          "Jollof Rice Secrets",
          "Nigerian Desserts & Pastries",
          "Full Nigerian Tasting Menu",
          "Private custom class",
        ],
      },
      {
        name: "chef",
        label: "Preferred Chef",
        type: "select",
        required: false,
        options: [
          "Marcus Osei (Nigerian Cuisine)",
          "Isabelle Fontaine (French-Nigerian Fusion)",
          "Yuki Tanaka (Pastry & Desserts)",
          "No preference",
        ],
      },
      { name: "date", label: "Preferred Date", type: "date", required: true },
      {
        name: "participants",
        label: "Number of Participants",
        type: "number",
        required: true,
        placeholder: "Max 12",
        min: 1,
        max: 12,
      },
      {
        name: "level",
        label: "Cooking Level",
        type: "select",
        required: true,
        options: ["Complete beginner", "Home cook", "Intermediate", "Advanced"],
      },
      {
        name: "purpose",
        label: "Purpose of Class",
        type: "select",
        required: false,
        options: [
          "Personal interest",
          "Team building",
          "Date night",
          "Birthday treat",
          "Professional development",
          "Other",
        ],
      },
      {
        name: "dietary",
        label: "Dietary Requirements",
        type: "text",
        required: false,
        placeholder: "Any allergies or dietary needs",
      },
      {
        name: "notes",
        label: "What do you want to learn?",
        type: "textarea",
        required: false,
        placeholder: "Specific dishes, techniques, or goals...",
      },
    ],
  },
};

// ── Input renderer ───────────────────────────────────────────
function FormField({ field, value, onChange }) {
  const base = `w-full bg-transparent border-b border-warm-gray/30 py-3 font-body
    text-sm text-charcoal placeholder-warm-gray/50 focus:border-gold
    focus:outline-none transition-colors`;

  if (field.type === "select") {
    return (
      <select
        name={field.name}
        value={value}
        onChange={onChange}
        className={base}
        style={{ appearance: "none" }}
      >
        <option value="">Select an option</option>
        {field.options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    );
  }

  if (field.type === "textarea") {
    return (
      <textarea
        name={field.name}
        value={value}
        onChange={onChange}
        rows={3}
        placeholder={field.placeholder}
        className={`${base} resize-none`}
      />
    );
  }

  return (
    <input
      name={field.name}
      type={field.type}
      value={value}
      onChange={onChange}
      placeholder={field.placeholder}
      min={field.min}
      max={field.max}
      className={base}
    />
  );
}

// ── Main page ────────────────────────────────────────────────
export default function EventDetail() {
  const { service } = useParams();
  const navigate = useNavigate();
  const config = SERVICE_FORMS[service];
  const serviceInfo = SERVICES.find((s) => s.path === `/events/${service}`);

  const [form, setForm] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const mutation = useMutation({
    mutationFn: submitBooking,
    onSuccess: () => setSubmitted(true),
    onError: () => toast.error("Something went wrong. Please try again."),
  });

  // 404 for unknown service slugs
  if (!config) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center text-center px-6">
        <div>
          <p className="font-display text-3xl text-charcoal mb-4">
            Service not found
          </p>
          <button
            onClick={() => navigate("/events")}
            className="text-gold text-sm tracking-widest uppercase font-body hover:underline"
          >
            ← Back to Events
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    config.fields.forEach((f) => {
      if (f.required && !form[f.name])
        newErrors[f.name] = "This field is required";
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    mutation.mutate({ service, ...form });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-gold flex items-center justify-center mx-auto mb-6">
            <Check size={28} className="text-charcoal" />
          </div>
          <div className="font-display text-4xl font-light text-charcoal mb-2">
            Request Received!
          </div>
          <div className="w-14 h-px bg-gold mx-auto my-4" />
          <p className="text-warm-gray font-body leading-relaxed mb-8">
            Thank you for your {config.title} enquiry. Our events team will
            review your request and contact you within <strong>24 hours</strong>{" "}
            to confirm details.
          </p>
          <div className="bg-white border border-gold/20 p-6 mb-8 text-left">
            <div className="text-xs tracking-widest uppercase text-gold font-body mb-4">
              Your Booking Summary
            </div>
            <div className="space-y-2">
              {["name", "email", "date", "guests"].map((key) =>
                form[key] ? (
                  <div
                    key={key}
                    className="flex justify-between text-sm font-body"
                  >
                    <span className="text-warm-gray capitalize">
                      {key.replace("_", " ")}
                    </span>
                    <span className="text-charcoal font-medium">
                      {form[key]}
                    </span>
                  </div>
                ) : null,
              )}
              <div className="flex justify-between text-sm font-body">
                <span className="text-warm-gray">Service</span>
                <span className="text-charcoal font-medium">
                  {config.title}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => navigate("/events")}
              className="bg-charcoal text-cream text-xs tracking-widest uppercase
                px-8 py-4 hover:bg-gold hover:text-charcoal transition-all font-body"
            >
              View All Services
            </button>
            <button
              onClick={() => navigate("/")}
              className="border border-charcoal text-charcoal text-xs tracking-widest uppercase
                px-8 py-4 hover:bg-charcoal hover:text-cream transition-all font-body"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero banner */}
      <div className="bg-charcoal pt-8 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate("/events")}
            className="flex items-center gap-2 text-warm-gray hover:text-gold
              transition-colors font-body text-sm mb-8"
          >
            <ArrowLeft size={14} /> Back to Events
          </button>

          <div className="flex items-start gap-6">
            <div className="text-5xl">{config.icon}</div>
            <div>
              <div className="text-gold text-xs tracking-widest uppercase font-body mb-2">
                Book a Service
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-light text-cream leading-none">
                {config.title}
              </h1>
              <div className="w-14 h-px bg-gold my-4" />
              <p className="text-warm-gray font-body">{config.subtitle}</p>
            </div>
          </div>

          {/* Features chips */}
          {serviceInfo?.features && (
            <div className="flex flex-wrap gap-2 mt-8">
              {serviceInfo.features.map((f) => (
                <span
                  key={f}
                  className="flex items-center gap-1.5 text-xs font-body text-cream/70
                    border border-gold/20 px-3 py-1.5"
                >
                  <Check size={10} className="text-gold" />
                  {f}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Left — pricing info */}
          <div className="md:col-span-1">
            <div className="sticky top-28">
              <div className="bg-charcoal p-6 mb-6">
                <div className="text-gold text-xs tracking-widest uppercase font-body mb-2">
                  Starting From
                </div>
                <div className="font-display text-3xl text-cream font-light">
                  {serviceInfo?.from}
                </div>
                <div className="w-8 h-px bg-gold my-4" />
                <p className="text-warm-gray text-xs font-body leading-relaxed">
                  Final pricing is confirmed after we review your requirements.
                  No hidden charges.
                </p>
              </div>

              <div className="border border-gold/20 p-6">
                <div className="text-xs tracking-widest uppercase text-gold font-body mb-4">
                  What's Included
                </div>
                <ul className="space-y-2">
                  {serviceInfo?.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 text-xs text-warm-gray font-body"
                    >
                      <Check size={12} className="text-gold mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 text-center">
                <p className="text-warm-gray text-xs font-body mb-2">
                  Prefer to call?
                </p>
                <a
                  href="tel:+12125550192"
                  className="text-gold font-body text-sm hover:underline tracking-wide"
                >
                  +1 (212) 555-0192
                </a>
              </div>
            </div>
          </div>

          {/* Right — form */}
          <div className="md:col-span-2">
            <div className="bg-white border border-gold/15 p-8">
              <h2 className="font-display text-2xl text-charcoal mb-8">
                Your Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                {config.fields.map((field) => (
                  <div
                    key={field.name}
                    className={
                      field.type === "textarea" ||
                      field.name === "venue" ||
                      field.name === "location"
                        ? "sm:col-span-2"
                        : ""
                    }
                  >
                    <label
                      className="block font-body mb-2"
                      style={{
                        fontSize: 10,
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        color: "#C9A84C",
                      }}
                    >
                      {field.label}
                      {field.required && (
                        <span className="text-red-400 ml-1">*</span>
                      )}
                    </label>
                    <FormField
                      field={field}
                      value={form[field.name] || ""}
                      onChange={handleChange}
                    />
                    {errors[field.name] && (
                      <p className="text-red-400 text-xs mt-1 font-body">
                        {errors[field.name]}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Submit */}
              <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
                <button
                  onClick={handleSubmit}
                  disabled={mutation.isPending}
                  className="w-full sm:w-auto bg-charcoal text-cream text-xs tracking-widest
                    uppercase px-12 py-4 border border-charcoal hover:bg-gold
                    hover:border-gold hover:text-charcoal transition-all duration-300
                    font-body font-medium flex items-center justify-center gap-3
                    disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {mutation.isPending ? (
                    <>
                      <div
                        className="w-4 h-4 border-2 border-cream/30 border-t-cream
                        rounded-full animate-spin"
                      />
                      Submitting...
                    </>
                  ) : (
                    <>Submit Enquiry</>
                  )}
                </button>
                <p className="text-warm-gray text-xs font-body text-center sm:text-left">
                  We respond within 24 hours · No commitment required
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
