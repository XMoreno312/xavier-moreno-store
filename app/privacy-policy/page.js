import Link from "next/link";
import LegalPage from "@/components/LegalPage";

export const metadata = {
  title: "Privacy Policy — Zae Moreno",
  description:
    "How Zae Moreno collects, uses, and protects your information on this site.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage eyebrow="Legal" title="Privacy Policy" updated="May 15, 2026">
      <p>
        We respect your privacy. This Privacy Policy explains what information
        we collect when you visit the site or purchase a license, why we collect
        it, and how it is handled.
      </p>

      <h2>1. Information We Collect</h2>
      <ul>
        <li>
          <strong>Contact information you give us</strong> — name, email
          address, and any message you send through a form on the site.
        </li>
        <li>
          <strong>Purchase information</strong> — handled by our payment
          processor (Stripe). We receive limited purchase details (e.g.
          confirmation, email, the license tier purchased) but never see or
          store full card numbers.
        </li>
        <li>
          <strong>Basic analytics</strong> — pages visited, device type,
          referrer. Used to improve the site experience.
        </li>
      </ul>

      <h2>2. How We Use It</h2>
      <ul>
        <li>To deliver your licensed files and license documentation.</li>
        <li>To respond to inquiries and provide customer support.</li>
        <li>
          To send occasional updates if you opt in to the mailing list. You can
          unsubscribe at any time using the link in any email.
        </li>
      </ul>

      <h2>3. Sharing</h2>
      <p>
        We do not sell your personal information. We share data only with
        service providers (such as Stripe for payments, our email service, and
        our hosting provider) strictly as needed to operate the site, and with
        authorities when legally required.
      </p>

      <h2>4. Cookies</h2>
      <p>
        The site uses essential cookies and may use analytics cookies to
        understand how visitors use the site. You can disable cookies in your
        browser, but parts of the site may not function correctly without them.
      </p>

      <h2>5. Your Rights</h2>
      <p>
        Depending on where you live, you may have the right to access, correct,
        or delete the personal information we hold about you, and to object to
        or restrict certain processing. To make a request, email{" "}
        bishopxavier20@gmail.com.
      </p>

      <h2>6. Data Security</h2>
      <p>
        We use reasonable safeguards to protect the information we collect, but
        no online system is fully secure. You share information with us at your
        own risk.
      </p>

      <h2>7. Children</h2>
      <p>
        This site is not directed to, and we do not knowingly collect
        information from, children under 13.
      </p>

      <h2>8. Changes</h2>
      <p>
        We may update this Policy from time to time. Material changes will be
        posted on this page with a new effective date.
      </p>

      <h2>9. Related Documents</h2>
      <p>
        See also the{" "}
        <Link href="/terms-of-service">Terms of Service</Link> and the{" "}
        <Link href="/license-agreement">License Agreement</Link>.
      </p>
    </LegalPage>
  );
}
