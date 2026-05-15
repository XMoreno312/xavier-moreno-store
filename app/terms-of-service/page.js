import Link from "next/link";
import LegalPage from "@/components/LegalPage";

export const metadata = {
  title: "Terms of Service — Xavier Moreno",
  description:
    "The terms that govern use of xaviermoreno.com and any license purchased through the site.",
};

export default function TermsOfServicePage() {
  return (
    <LegalPage eyebrow="Legal" title="Terms of Service" updated="May 15, 2026">
      <p>
        Welcome. These Terms of Service (&ldquo;Terms&rdquo;) govern your use of
        this site and any license you purchase through it. By using the site or
        completing a purchase, you agree to these Terms, the{" "}
        <Link href="/license-agreement">License Agreement</Link>, and the{" "}
        <Link href="/privacy-policy">Privacy Policy</Link>.
      </p>

      <h2>1. About Xavier Moreno</h2>
      <p>
        This site is operated by Xavier Moreno, an independent producer,
        songwriter, and recording artist (&ldquo;we,&rdquo; &ldquo;us,&rdquo;
        &ldquo;Xavier Moreno&rdquo;). The site offers licenses to musical
        productions and instrumentals (each, a &ldquo;Production&rdquo;). It
        does not sell or transfer ownership of any Production.
      </p>

      <h2>2. Eligibility</h2>
      <p>
        You must be at least 18 years old, or have permission from a parent or
        legal guardian, and be able to enter into binding contracts in your
        jurisdiction.
      </p>

      <h2>3. Purchases Are Licenses</h2>
      <p>
        Every purchase on this site is a license to use the Production, granted
        under the tier purchased and the terms of the License Agreement.
        Purchases do not transfer copyright, authorship, publishing interest,
        producer rights, stems, melodies, arrangements, the master recording of
        the instrumental, or any other intellectual-property right in the
        Production. <strong>All rights not expressly granted are reserved by
        Xavier Moreno.</strong>
      </p>

      <h2>4. Payment</h2>
      <p>
        Payments are processed securely through Stripe or another payment
        processor. We never see or store full card numbers. The buyer is
        responsible for entering correct contact and delivery information at
        checkout; we are not liable for delivery failures caused by incorrect
        information provided by the buyer.
      </p>

      <h2>5. Delivery</h2>
      <p>
        Licensed files and the corresponding license document are delivered
        electronically to the email address provided at checkout. Delivery
        typically completes within minutes of payment confirmation.
      </p>

      <h2>6. Refunds</h2>
      <p>
        Digital products are generally non-refundable once delivered, unless
        there is a technical issue with the file or a duplicate charge. Refund
        requests should be sent to bishopxavier20@gmail.com within fourteen
        (14) days of purchase and will be reviewed in good faith.
      </p>

      <h2>7. Prohibited Use</h2>
      <p>
        The Production may only be used under the rights expressly granted in
        the License Agreement. Resale, sublicensing, redistribution, false
        claims of authorship, and uploading the instrumental on its own to
        sample libraries, beat stores, NFTs, or AI training datasets are
        prohibited. See the{" "}
        <Link href="/license-agreement">License Agreement</Link> for the
        complete list.
      </p>

      <h2>8. Intellectual Property</h2>
      <p>
        All Productions, audio files, artwork, photography, copy, and the site
        itself remain the exclusive property of Xavier Moreno. All rights not
        expressly granted are reserved.
      </p>

      <h2>9. Disclaimers</h2>
      <p>
        The site and the Productions are provided on an &ldquo;as is&rdquo; and
        &ldquo;as available&rdquo; basis without warranties of any kind, except
        those that cannot be excluded under applicable law.
      </p>

      <h2>10. Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by law, Xavier Moreno&rsquo;s total
        liability arising from your use of this site or any license purchased
        through it is limited to the amount you actually paid for the relevant
        license. Xavier Moreno is not liable for indirect, incidental,
        consequential, or punitive damages.
      </p>

      <h2>11. Governing Law</h2>
      <p>
        These Terms are governed by the laws of the state in which Xavier
        Moreno resides at the time of purchase, without regard to conflict-of-
        law principles.
      </p>

      <h2>12. Changes</h2>
      <p>
        We may update these Terms from time to time. The version in effect at
        the time of your purchase governs that purchase.
      </p>
    </LegalPage>
  );
}
