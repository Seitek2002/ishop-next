"use client";

import { useRef, useState, type FormEvent } from "react";
import { normalizeKgPhone } from "@/utils/phone";
import { CONTACT, CONTACTS } from "../content";
import { ArrowBadge, Roll } from "./ButtonParts";
import Magnetic from "./Magnetic";
import ui from "../ui.module.scss";
import s from "./Contact.module.scss";

// "+996555123456" -> "+996 555 123 456"
const formatKg = (normalized: string) => {
  const d = normalized.slice(4);
  const parts = [d.slice(0, 3), d.slice(3, 6), d.slice(6, 9)].filter(Boolean);
  return parts.length ? `+996 ${parts.join(" ")}` : "+996";
};

export default function Contact() {
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");
  const [sent, setSent] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const digits = normalizeKgPhone(phone).slice(4);

  const onChange = (raw: string) => {
    setError("");
    // Deleting back into the +996 prefix clears the field instead of re-reading it as digits.
    if (raw.replace(/\D/g, "").length <= 3 && raw.length < phone.length) {
      setPhone("");
      return;
    }
    setPhone(formatKg(normalizeKgPhone(raw)));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (digits.length !== 9) {
      setError(CONTACT.errorIncomplete);
      inputRef.current?.focus();
      return;
    }
    setStatus("sending");
    try {
      // Layout-only, as before the redesign: no lead endpoint is wired up yet.
      await new Promise((r) => setTimeout(r, 900));
      setSent(phone);
      setStatus("done");
      setPhone("");
    } catch {
      setError(CONTACT.errorServer);
      setStatus("idle");
    }
  };

  return (
    <section id="contact" data-theme="saffron" className={s.section} aria-labelledby="contact-title">
      <div className={`${ui.wrap} ${s.grid}`}>
        <div className={s.copy}>
          <h2 id="contact-title" className={s.title}>
            {CONTACT.title}
          </h2>
          <p className={ui.lead}>{CONTACT.lead}</p>
        </div>

        <div className={s.formSide}>
          {status === "done" ? (
            <div className={s.ticket} role="status">
              <span className={s.ticketTitle}>{CONTACT.successTitle}</span>
              <span className={s.ticketPhone}>{sent}</span>
              <span className={s.ticketText}>{CONTACT.successText}</span>
              <button type="button" className={ui.link} onClick={() => setStatus("idle")}>
                {CONTACT.again}
              </button>
            </div>
          ) : (
            <form className={s.form} onSubmit={onSubmit} noValidate>
              <label htmlFor="lead-phone" className={s.label}>
                {CONTACT.label}
              </label>
              <div className={s.field} data-error={Boolean(error)}>
                <input
                  ref={inputRef}
                  id="lead-phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="+996 555 123 456"
                  value={phone}
                  onChange={(e) => onChange(e.target.value)}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? "lead-phone-error" : undefined}
                  className={s.input}
                />
                <span className={s.underline} aria-hidden />
              </div>
              <p id="lead-phone-error" className={s.error} role="alert">
                {error}
              </p>

              <Magnetic className={s.submitWrap}>
                <button type="submit" className={`${ui.btn} ${s.submit}`} disabled={status === "sending"} data-fill>
                  <Roll>{status === "sending" ? CONTACT.sending : CONTACT.submit}</Roll>
                  <ArrowBadge />
                </button>
              </Magnetic>

              <p className={s.policy}>{CONTACT.policy}</p>
              <p className={s.call}>
                {CONTACT.orCall}:{" "}
                <a href={CONTACTS.phoneHref} className={ui.link}>
                  {CONTACTS.phone}
                </a>
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
